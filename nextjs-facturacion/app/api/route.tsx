import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest): Promise<Response> {
  let result
  const rfc = req.nextUrl.searchParams.get("rfc")
  const order_number = req.nextUrl.searchParams.get("order_number")
  if (!rfc || !order_number) {
    return NextResponse.next()
  }

  console.log(rfc, order_number)
  const url = `http://backend:9000/cfdi/api/invoice?rfc=${rfc}&order_number=${order_number}`
  try {
    result = await fetch(
      url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
    })
  }
  catch (error) {
    console.error(error)
    return NextResponse.next()
  }
  const blob = await result.blob()
  const headers = new Headers();
  headers.append("Content-Disposition", 'attachment; filename="Invoice.zip"');
  headers.append("Content-Type", "application/zip");
  return new Response(blob, {
    headers,
  });
}
