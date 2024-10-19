'use server'
import { invoiceDetails } from '@/stores/invoices';
import { redirect } from 'next/navigation';
import { postcodeValidator } from 'postcode-validator';


export async function createInvoice(input: invoiceDetails) {

  const rawFormData = {
    orderNumber: input.orderNumber,
    rfc: input.rfc,
    name: input.name,
    zip: input.zip,
    regimenFiscal: input.regimenFiscal,
    usoCFDI: input.usoCFDI,
    formaPago: input.formaPago
  }
  // Validate zip as first step
  const zipValidation = postcodeValidator(String(rawFormData.zip), 'MX')
  if (zipValidation == false) {
    return ("El Código Postal no es correcto")
  }
  let result
  console.log(rawFormData)
  try {
    result = await fetch(
      'http://backend:9000/cfdi/api/invoice', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify({
        order_number: rawFormData.orderNumber,
        rfc: rawFormData.rfc,
        name: rawFormData.name,
        zip: rawFormData.zip,
        regimenFiscal: rawFormData.regimenFiscal,
        usoCFDI: rawFormData.usoCFDI,
        formaPago: rawFormData.formaPago
      })
    })
  }
  catch (error) {
    console.error(error)
    return (error)
  }
  console.log(result)
  if (!result.ok) {
    const body = await result.json()
    return (body)

  }
  return redirect(`/download/?rfc=${rawFormData.rfc}&order_number=${rawFormData.orderNumber}`)
}

export async function sendbyEmail({
  rfc,
  order_number,
  email
}: {
  rfc: string | string[] | undefined,
  order_number: string | string[] | undefined,
  email: string | string[] | undefined
}) {
  let result
  if (!email) {
    return ('Seleccione un correo electronico')
  }
  const url = `http://backend:9000/cfdi/api/invoice?rfc=${rfc}&order_number=${order_number}&email=${email}`
  try {
    result = await fetch(url, {
    })
  }
  catch (error) {
    console.error(error)
    return (error)
  }
  if (!result.ok) {
    const body = await result.json()
    return (body)
  }
}


export async function searchInvoice({
  rfc,
  order_number,
}: {
  rfc: string,
  order_number: string,
}) {
  if (!rfc) {
    return ('Ingrese un RFC')
  }
  if (!order_number) {
    return ('Ingrese un número de orden')
  }
  let result
  const url = `http://backend:9000/cfdi/api/invoice?rfc=${rfc}&order_number=${order_number}`
  try {
    result = await fetch(url, {
    })
  }
  catch (error) {
    console.error(error)
    return (error)
  }
  if (!result.ok) {
    const body = await result.json()
    return (body)
  }
}