import Image from "next/image";
import DownloadButtons from "./client";

export default function Download({ searchParams }: { searchParams?: { [key: string]: string | string[] | undefined }; }) {
  let rfc
  let order_number

  if (searchParams) {
    rfc = searchParams['rfc'] || '';
    order_number = searchParams['order_number'] || '';
  }

  return (
    <div className="flex flex-col px-10 py-10 bg-zinc-700 w-full h-screen">
      <div className="self-center">
        <div className="relative h-36 w-36">
          <Image src="/logoBlanco.png"
            alt="" fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
        </div>
      </div>
      <div className="p-10 flex flex-col items-center mt-10 bg-white rounded-lg shadow-md shadow-black text-black md:gap-10">
        <div>
          Selecciones la forma en que desea obtener su factura
        </div>
        <div>
          <DownloadButtons order_number={order_number || ''} rfc={rfc || ''} />
        </div>
      </div>
    </div>
  );
}
