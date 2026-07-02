import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const link = searchParams.get("link");
  const res = await fetch(link ? link : "");
  const html = await res.text();

  return NextResponse.json({ html });
}
