import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import Image from "next/image";
import Facturar, { Search } from "../components/facturar";

export default function Home() {
  return (
    <div className="flex flex-col px-10 py-10 bg-zinc-700 w-full h-full">
      <div className="self-center">
        <div className="relative h-36 w-36">
          <Image src="/logoBlanco.png"
            alt="" fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
        </div>
      </div>
      <div className="p-10 flex flex-col items-center mt-10 bg-white rounded-lg shadow-md shadow-black text-black gap-10">
        <div>
          Bienvenido al sitio de Facturación Electrónica de Proyecto 705
        </div>
        <div>
          <div className="pb-10">
            Importante:
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex flex-row gap-2">
              <div><WarningAmberIcon className="h-5 w-5" /></div>
              <div className="pt-1">Podrás facturar compras en línea de Proyecto 705.</div>
            </div>
            <div className="flex flex-row gap-2">
              <div><WarningAmberIcon className="h-5 w-5" /></div>
              <div className="pt-1">Debes contar con número de orden, RFC (Registro Federal de Contribuyentes) y correo electrónico.</div>
            </div>
            <div className="flex flex-row gap-2">
              <div><WarningAmberIcon className="h-5 w-5" /></div>
              <div className="pt-1">Tienes 7 días para tramitar tu factura después de realizar tu compra.</div>
            </div>
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-5 pt-10">
          <Facturar />
          <Search />
        </div>
      </div>
    </div>
  );
}
