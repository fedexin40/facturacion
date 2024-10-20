'use client'

import { formaPago, regimenFiscal, usoCFDI } from "@/catalogos_sat/catalogos";
import { useDetailsInvoice, useInvoiceDetailsActions, useInvoiceErrorActions } from "@/stores/invoices";
import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { createInvoice } from "../../actions/invoice";
import AlertDialog from "../../components/alert";

export default function FacturacionClient() {
  const router = useRouter()
  const { setInvoiceDetails } = useInvoiceDetailsActions()
  const useInvoice = useDetailsInvoice()
  const [isPending, startTransition] = useTransition();
  const { openError } = useInvoiceErrorActions()
  const { setErrorMessage } = useInvoiceErrorActions()

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>,
  ) {
    setInvoiceDetails({ ...useInvoice, [event.target.name]: event.target.value });
  }

  function InvoiceCreate() {
    startTransition(async () => {
      // Read the input parameters from the form
      const input = {
        rfc: useInvoice.rfc,
        name: useInvoice.name,
        orderNumber: useInvoice.orderNumber,
        zip: useInvoice.zip,
        usoCFDI: useInvoice.usoCFDI,
        regimenFiscal: useInvoice.regimenFiscal,
        formaPago: useInvoice.formaPago
      };
      // Update the address if the user already has one
      const errors = await createInvoice(input);
      if (errors) {
        openError();
        setErrorMessage(errors);
      }
    });
  }

  return (
    <>
      <AlertDialog />
      <div className="w-full px-10 md:px-36">
        <form>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="flex flex-col">
              <label className="lg:text-base md:text-sm italic">Número de Orden</label>
              <input
                className="text-sm focus:outline-none	 border-b-2 border-neutral-800 bg-white px-2 py-1"
                name="orderNumber"
                onChange={handleChange}
                required={true} />
            </div>
            <div className="flex flex-col">
              <label className="lg:text-base md:text-sm italic">RFC</label>
              <input
                className="text-sm focus:outline-none hover:border-b-2 border-b-2 border-neutral-800 bg-white px-2 py-1"
                name="rfc"
                onChange={handleChange}
                required={true} />
            </div>
            <div className="flex flex-col">
              <label className="lg:text-base md:text-sm italic">Denominación/Razón Social</label>
              <input
                className="text-sm focus:outline-none border-b-2 border-neutral-800 bg-white px-2 py-1"
                name="name"
                onChange={handleChange}
                required={true} />
            </div>
            <div className="flex flex-col">
              <label className="lg:text-base md:text-sm italic">Código postal</label>
              <input
                className="text-sm focus:outline-none border-b-2 border-neutral-800 bg-white px-2 py-1"
                name="zip"
                onChange={handleChange}
                required={true} />
            </div>
            <div className="flex flex-col">
              <label className="lg:text-base md:text-sm italic">Régimen fiscal</label>
              <select
                onChange={handleChange}
                name="regimenFiscal"
                required={true}
                className="text-sm focus:outline-none ring-0 shadow-none focus:shadow-none focus:border-t-0  focus:border-b-2 active:ring-0 focus:ring-0  border-b-2 pt-4 border-neutral-800 bg-white px-2 py-1 w-full"
              >
                {regimenFiscal?.map(({ raw, verbose }) => (
                  <option className="" key={raw} value={raw || ''}>
                    {verbose}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col">
              <label className="lg:text-base md:text-sm italic">Uso de CFDI</label>
              <select
                onChange={handleChange}
                name="usoCFDI"
                required={true}
                className="text-sm ring-0 shadow-none focus:shadow-none focus:outline-none focus:border-t-0  focus:border-b-2 active:ring-0 focus:ring-0  border-b-2 pt-4 border-neutral-800 bg-white px-2 py-1 w-full"
              >
                {usoCFDI?.map(({ raw, verbose }) => (
                  <option className="" key={raw} value={raw || ''}>
                    {verbose}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col">
              <label className="lg:text-base md:text-sm italic">Forma de Pago</label>
              <select
                onChange={handleChange}
                name="formaPago"
                required={true}
                className="text-sm ring-0 shadow-none focus:shadow-none focus:outline-none focus:border-t-0  focus:border-b-2 active:ring-0 focus:ring-0  border-b-2 pt-4 border-neutral-800 bg-white px-2 py-1 w-full"
              >
                {formaPago?.map(({ raw, verbose }) => (
                  <option className="" key={raw} value={raw || ''}>
                    {verbose}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-5 justify-center pt-10 items-center">
            <div>
              <div
                className={clsx(
                  'text-center p-5 border-2 border-zinc-700 w-52 rounded-lg hover:cursor-pointer hover:opacity-50',
                  { 'hover:cursor-not-allowed opacity-50': isPending },
                )}
                onClick={() => InvoiceCreate()}
              >
                Facturar
              </div>
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
        </form>
      </div>
    </>
  );
}
