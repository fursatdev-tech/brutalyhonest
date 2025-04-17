import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const policies = await prismadb.cancellationPolicy.findMany({});

    return NextResponse.json({ data: policies });
  } catch (error: any) {
    return new NextResponse(`${error}`, { status: 500 });
  }
}
