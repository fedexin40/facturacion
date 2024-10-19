'use client'

import { useRouter } from 'next/navigation';


export default function DownloadButtons({
  rfc,
  order_number
}: {
  rfc: string | string[],
  order_number: string | string[]
}) {
  const router = useRouter()

  return (
    <>
      <div className="flex flex-col md:flex-row gap-12 justify-center pt-20">
        <div>
          <div
            className="lg:text-base md:text-sm text-center p-5 border-2 border-zinc-700 w-64 rounded-lg hover:cursor-pointer hover:opacity-50 whitespace-nowrap"
            onClick={() => router.push(`/api/?rfc=${rfc}&order_number=${order_number}`)}
          >
            Descargar zip
          </div>
        </div>
        <div
          className="lg:text-base md:text-sm text-center p-5 border-2 border-zinc-700 w-64 rounded-lg hover:cursor-pointer hover:opacity-50 whitespace-nowrap"
          onClick={() => router.push(`/email/?rfc=${rfc}&order_number=${order_number}`)}>
          Enviar por correo electrónico
        </div>
      </div>
    </>
  );
}
