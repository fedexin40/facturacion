'use client'

import { searchInvoice } from '@/actions/invoice';
import AlertDialog from '@/components/alert';
import { useDetailsInvoice, useInvoiceDetailsActions, useInvoiceErrorActions } from '@/stores/invoices';
import clsx from 'clsx';
import { redirect, useRouter } from 'next/navigation';
import { useTransition } from 'react';

export default function RecoverInvoice() {
  const router = useRouter()
  const useInvoice = useDetailsInvoice()
  const { setInvoiceDetails } = useInvoiceDetailsActions()
  const [isPending, startTransition] = useTransition();
  const { openError } = useInvoiceErrorActions()
  const { setErrorMessage } = useInvoiceErrorActions()


  function handleChange(
    event: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>,
  ) {
    setInvoiceDetails({ ...useInvoice, [event.target.name]: event.target.value });
  }

  function getInvoice() {
    startTransition(async () => {
      const errors = await searchInvoice({ rfc: useInvoice.rfc, order_number: useInvoice.orderNumber });
      if (errors) {
        openError();
        setErrorMessage(errors);
      }
      else {
        redirect(`/download/?rfc=${useInvoice.rfc}&order_number=${useInvoice.orderNumber}`)
      }
    });
  }


  return (
    <>
      <AlertDialog />
      <div className="flex flex-col md:flex-row justify-center pt-10 gap-20">
        <div className="flex flex-col">
          <label className="lg:text-base md:text-sm italic">RFC</label>
          <input
            className="text-sm focus:outline-none border-b-2 border-neutral-800 bg-white px-2 py-1"
            name="rfc"
            required={true}
            onChange={handleChange}
          />
        </div>
        <div className="flex flex-col">
          <label className="lg:text-base md:text-sm italic">Número de orden</label>
          <input
            className="text-sm focus:outline-none border-b-2 border-neutral-800 bg-white px-2 py-1"
            name="orderNumber"
            required={true}
            onChange={handleChange}
          />
        </div>
      </div >
      <div className="flex flex-col md:flex-row gap-5 justify-center pt-20">
        <div
          className={clsx(
            'text-center p-5 border-2 border-zinc-700 w-52 rounded-lg hover:cursor-pointer hover:opacity-50',
            { 'hover:cursor-not-allowed opacity-50': isPending },
          )}
          onClick={() => getInvoice()}>
          Buscar factura
        </div>
        <div
          className={clsx(
            'text-center p-5 border-2 border-zinc-700 w-52 rounded-lg hover:cursor-pointer hover:opacity-50',
            { 'hover:cursor-not-allowed opacity-50': isPending },
          )}
          onClick={() => router.push("/")}>
          Regresar
        </div>
      </div>
    </>
  );
}
