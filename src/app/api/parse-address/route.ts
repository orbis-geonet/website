import { parseAddress } from "@/lib/utils";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const address = searchParams.get("address");
    if (address) {
      const res = parseAddress(address);
      if (res) return NextResponse.json(res);
    }
  } catch (err) {
    return NextResponse.json({ error: true, errorMessage: err });
  }

  return NextResponse.json({
    error: true,
    errorMessage: "Internal Server Error",
  });
}
