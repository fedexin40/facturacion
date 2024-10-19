import time
import smtplib

from decimal import Decimal
from satcfdi import render
from satcfdi.models import Signer
from satcfdi.create.cfd import cfdi40
from satcfdi.create.cfd.catalogos import RegimenFiscal, MetodoPago, FormaPago
from satcfdi.pacs import Environment
from satcfdi.pacs.finkok import Finkok
from .models import Company, Saleor, Pac, Smtp
from gql import gql, Client
from gql.transport.aiohttp import AIOHTTPTransport
from email.mime.multipart import MIMEMultipart
from email.mime.application import MIMEApplication
from email.mime.text import MIMEText


# Provide a GraphQL query
query = gql(
"""
    query Order($order_number: String!) {
        orders(first: 1, filter: {numbers: [$order_number]}) {
            edges {
                node {
                    lines {
                        productName
                        quantity
                        unitPrice {
                            gross {
                                amount
                            }
                        }
                    }
                }
            }
        }
    }
""")

# Authentication query
authentication_query = gql(
"""
mutation tokenCreate($email: String!, $password: String!)  {
    tokenCreate(email: $email, password: $password) {
        token
    }
}
""")

class invoice_documents(object):
    def __init__(self, xml, pdf, name):
        self.xml = xml
        self.pdf = pdf
        self.name = name

def sign_invoice(data):

    def _concepto(line):
        return (
            cfdi40.Concepto(
                # TODO: clave prod is hardcoded
                clave_prod_serv='54101604',
                cantidad=line.get('quantity'),
                # TODO: clave unidad is also hardcoded
                clave_unidad='E48',
                descripcion=line.get('productName'),
                valor_unitario=Decimal(line.get('unitPrice').get('gross').get('amount')),
                _traslados_incluidos=False  # indica si el valor unitario incluye los traslados
            )
        )

    saleor = Saleor.objects.all()[0]
    saleor_api = saleor.saleor_api
    saleor_user = saleor.username
    saleor_password = saleor.password
    transport = AIOHTTPTransport(url=saleor_api)

    # Create a GraphQL client using the defined transport
    client = Client(transport=transport, fetch_schema_from_transport=True)
    # Get token
    authentication_params = {
        "email": saleor_user,
        "password": saleor_password
    }
    token = client.execute(
        authentication_query, variable_values=authentication_params)
    # Replace client with client with token
    token = token.get('tokenCreate').get('token')
    transport = AIOHTTPTransport(
        url=saleor_api,
        headers={'Authorization': 'Bearer ' + token})
    client = Client(
        transport=transport, fetch_schema_from_transport=True)
    order_number = data.get("order_number").strip()
    order_params = {"order_number": order_number}
    order = client.execute(query, variable_values=order_params)
    if not order.get('orders').get('edges'):
        raise Exception("No encontramos ninguna orden con ese número")
    # Read the order lines
    lines = order.get('orders').get('edges')[0].get('node').get('lines')
    invoice_lines = [_concepto(x) for x in lines ]
    company = Company.objects.all()
    if not company:
        raise ('No hay una compañia cargada para poder facturar')
    company = company[0]
    # It should be only one company with only one certificate
    certificate = company.certificate
    key = company.certificate_key
    password = company.password
    zip = str(company.zip).strip()
    rfc = str(company.rfc).strip()
    signer = Signer.load(
        certificate=open(certificate.path, 'rb').read(),
        key=open(key.path, 'rb').read(), password=password)
    if rfc != signer.rfc:
        raise (
            "El RFC de los certificados y el cargado en el sistema "
            "no coinciden"
        )
    print(data),
    current_year = time.strftime("%Y")
    invoice = cfdi40.Comprobante(
        emisor=cfdi40.Emisor(
            rfc=signer.rfc,
            nombre=signer.legal_name,
            regimen_fiscal=RegimenFiscal.REGIMEN_SIMPLIFICADO_DE_CONFIANZA
        ),
        lugar_expedicion=zip,
        receptor=cfdi40.Receptor(
            rfc=data.get('rfc').strip(),
            nombre=data.get('name').strip(),
            uso_cfdi=data.get('usoCFDI'),
            domicilio_fiscal_receptor=data.get('zip').strip(),
            regimen_fiscal_receptor=data.get('regimenFiscal')
        ),
        forma_pago=data.get('formaPago'),
        metodo_pago=MetodoPago.PAGO_EN_UNA_SOLA_EXHIBICION,
        serie=current_year,
        folio=data.get('folio'),
        conceptos=invoice_lines
    )
    invoice.sign(signer)
    # from satcfdi.pacs.finkok import Finkok
    username_pac = Pac.objects.all()[0].user
    password_pac = Pac.objects.all()[0].password
    pac = Finkok(
        username=username_pac, password=password_pac,
        environment=Environment.TEST)
    doc = pac.stamp(invoice)
    pdf = render.pdf_bytes(invoice)
    documents = invoice_documents(
        xml=doc.xml,
        pdf=pdf,
        name=doc.document_id
    )
    return documents


def send_by_email(email_subject, email_to, zip_file, invoice_number):
    smtp = Smtp.objects.all()[0]
    smtp_user = smtp.user
    smtp_pass = smtp.password
    smtp_server = smtp.server
    smtp_port = smtp.port
    # Create a multipart message
    msg = MIMEMultipart()
    body_part = MIMEText(
      'Muchas gracias por su compra.\n Su factura se encuentra adjunta',
      'plain'
    )
    msg['Subject'] = email_subject
    msg['From'] = smtp_user
    msg['To'] = email_to
    # Add body to email
    msg.attach(body_part)
    # open and read the file in binary
    # Attach the file with filename to the email
    file_name = invoice_number + '.zip'
    msg.attach(MIMEApplication(zip_file.getvalue(), Name=file_name))
    smtp_obj = smtplib.SMTP(smtp_server, smtp_port)
    smtp_obj.starttls()
    smtp_obj.login(smtp_user, smtp_pass)
    # Convert the message to a string and send it
    smtp_obj.sendmail(msg['From'], msg['To'], msg.as_string())
    smtp_obj.quit()