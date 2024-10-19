'use client'

import { sendbyEmail } from '@/actions/invoice';
import AlertDialog from '@/components/alert';
import { useDetailsInvoice, useInvoiceDetailsActions, useInvoiceErrorActions } from '@/stores/invoices';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';

export default function SendEmail({
  rfc,
  order_number
}: {
  rfc: string | string[] | undefined,
  order_number: string | string[] | undefined
}) {
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

  function enviarCorreo() {
    startTransition(async () => {
      const errors = await sendbyEmail({ rfc: rfc, order_number: order_number, email: useInvoice.email })
      if (errors) {
        openError();
        setErrorMessage(errors);
      }
    })

  }

  return (
    <>
      <AlertDialog />
      <div className="flex flex-col justify-center pt-10">
        <label className="lg:text-base md:text-sm italic">Email</label>
        <input
          className="text-sm focus:outline-none border-b-2 border-neutral-800 bg-white px-2 py-1"
          name="email"
          type="email"
          required={true}
          onChange={handleChange}
        />
        <div className="flex flex-col md:flex-row gap-12 justify-center pt-20">
          <div
            className={clsx(
              'lg:text-base md:text-sm text-center p-5 border-2 border-zinc-700 w-64 rounded-lg hover:cursor-pointer hover:opacity-50 whitespace-nowrap',
              { 'hover:cursor-not-allowed opacity-50': isPending },
            )}
            onClick={() => enviarCorreo()}>
            Enviar correo
          </div>
          <div
            className={clsx(
              'lg:text-base md:text-sm text-center p-5 border-2 border-zinc-700 w-64 rounded-lg hover:cursor-pointer hover:opacity-50 whitespace-nowrap',
              { 'hover:cursor-not-allowed opacity-50': isPending },
            )}
            onClick={() => router.push("/")}>
            Regresar al Menú Principal
          </div>
        </div>
      </div >
    </>
  );
}
