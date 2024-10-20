import zipfile
import os

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Invoices, Users
from .serializers import UsersSerializer
from .invoice import sign_invoice
from django.http import HttpResponse
from django.core.files.base import ContentFile
from io import BytesIO
from .invoice import send_by_email

class UserListApiView(APIView):

    def get(self, request, *args, **kwargs):
        rfc = self.request.query_params.get("rfc")
        user = Users.objects.filter(rfc=rfc)
        serializer = UsersSerializer(user, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def post(self, request, *args, **kwargs):
        '''
        Create the customer with the given data
        '''
        data = {
            'rfc': request.data.get('rfc'),
            'name': request.data.get('name'),
            'email': request.data.get('email'), 
        }
        serializer = UsersSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class InvoiceListApiView(APIView):
    def get(self, request, *args, **kwargs):
        order_number = self.request.query_params.get("order_number")
        customer_rfc = self.request.query_params.get("rfc")
        email = self.request.query_params.get("email")
        if not order_number or not customer_rfc:
            return Response(status=status.HTTP_200_OK)
        invoice = Invoices.objects.filter(
            order_number=order_number,
            user__rfc=customer_rfc)
        if not invoice:
            return Response(
                'No existe una factura que coincida con la informacion dada',
                status=status.HTTP_400_BAD_REQUEST)
        invoice = invoice[0]

        zip_buffer = BytesIO()
        zipf = zipfile.ZipFile(zip_buffer, "w")
        zipf.write(
            invoice.invoice_xml.path,
            arcname=os.path.basename(invoice.invoice_xml.path),
            compress_type=zipfile.ZIP_DEFLATED
        )
        zipf.write(
            invoice.invoice_pdf.path,
            arcname=os.path.basename(invoice.invoice_pdf.path),
            compress_type = zipfile.ZIP_DEFLATED
        )
        zipf.close()
        if email:
            name = 'Factura numero ' + invoice.invoice_number
            send_by_email(
              email_subject=name, email_to=email,
              zip_file=zip_buffer, invoice_number=invoice.invoice_number
            )
            return Response(
                status=status.HTTP_200_OK)
        response = HttpResponse(zip_buffer.getvalue(), content_type='application/zip')
        response['Content-Disposition'] = 'attachment; filename={name}.zip'.format(
            name=invoice.invoice_number)
        return response
    
    def post(self, request, *args, **kwargs):
        '''
        Create the Invoice with given data
        '''
        data = {
            'order_number': request.data.get('order_number'),
            'rfc': request.data.get('rfc'),
            'name': request.data.get('name'),
            'zip': request.data.get('zip'),
            'regimenFiscal': request.data.get('regimenFiscal'),
            'usoCFDI': request.data.get('usoCFDI'),
            'formaPago': request.data.get('formaPago')
        }
        user = Users.objects.filter(rfc=data.get('rfc'))
        if not user:
            user = Users(
                rfc=data.get('rfc'),
                name=data.get('name'),
                zip=data.get('zip')
            )
            serializer = UsersSerializer(data=data)
            if serializer.is_valid():
                serializer.save()
            else:
                return Response(
                    serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        invoice = Invoices.objects.filter(
            order_number=data.get('order_number'))
        if invoice:
            return Response(
              'Ya existe una factura asociada a ese número de orden',
              status=status.HTTP_400_BAD_REQUEST)
        # Get last folio used
        last_invoice = Invoices.objects.all()
        if not last_invoice:
            data['folio'] = '100'
        else:
            data['folio'] = str(last_invoice.latest().folio + 1)
        try:
          result = sign_invoice(data)
        except Exception as error:
            return Response(
              error.__str__(), status=status.HTTP_400_BAD_REQUEST)
        user = Users.objects.filter(rfc=data.get('rfc')).first()
        xml_file = ContentFile(
            result.xml, data.get('rfc') + "_" + data.get('folio') + '.xml')
        pdf_file = ContentFile(
            result.pdf, data.get('rfc') + "_" + data.get('folio') + '.pdf')
        new_invoice = Invoices(
            order_number = data.get('order_number'),
            invoice_number = data.get('rfc') + "_" + data.get('folio'),
            invoice_xml = xml_file,
            invoice_pdf = pdf_file,
            folio = data.get('folio'),
            user=user
        )
        new_invoice.save()
        return Response(status=status.HTTP_200_OK)
        