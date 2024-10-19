import Image from "next/image";
import FacturacionClient from "./client";

export default function Facturacion() {
  return (
    <div className="flex flex-col px-10 py-10 bg-zinc-700 w-full lg:h-full md:h-screen">
      <div className="self-center">
        <div className="relative h-36 w-36">
          <Image src="/logoBlanco.png"
          alt="" fill
          className="object-contain"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"/>
        </div>
      </div>
      <div className="py-10 flex flex-col items-center mt-10 bg-white rounded-lg shadow-md shadow-black text-black gap-10">
        <FacturacionClient/>
      </div>
    </div>
  );
}
