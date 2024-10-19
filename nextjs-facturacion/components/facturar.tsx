'use client'
import { useRouter } from 'next/navigation'

export default function Facturar() {
  const router = useRouter()

  return (
    <div
      className="text-center p-5 border-2 border-zinc-700 w-52 rounded-lg hover:cursor-pointer hover:opacity-50"
      onClick={() => router.push("/facturacion")}>
      Facturar
    </div>
  )
}

export function Search() {
  const router = useRouter()
  return (
    <div
      className="text-center p-5 border-2 border-zinc-700 w-52 rounded-lg hover:cursor-pointer hover:opacity-50"
      onClick={() => router.push("/search")}>
      Recuperar Factura
    </div>
  )
}
