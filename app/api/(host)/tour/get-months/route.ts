import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const data = await prismadb.month.findMany();

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: `${error}` }, { status: 500 });
  }
}
