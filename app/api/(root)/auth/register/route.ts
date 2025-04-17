import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (body.type !== "user.created")
      return NextResponse.json({ message: "Incorrect Event" }, { status: 200 });

    const user = body.data;

    //return if not logged-in
    if (!user) return NextResponse.json({ message: "NA" }, { status: 200 });

    // create userData object from clerk user
    const userData = {
      name: `${user.first_name} ${user.last_name}`,
      createdAt: new Date(user.created_at),
      updatedAt: new Date(user.updated_at),
      email: user.email_addresses[0].email_address.toLowerCase().trim(),
      emailVerified: !!(
        user.email_addresses[0].verification?.status === "verified"
      ),
      image: user.image_url,
      username: user.username,
      ...(!!user.phone_numbers.length && {
        phoneNumber: user.phone_numbers[0].phone_number,
        phoneVerified: !!(
          user.phone_numbers[0].verification?.status === "verified"
        ),
      }),
    };

    // create user if doesn't exist of update
    await prismadb.user.upsert({
      where: {
        clerkId: user.id,
      },
      create: { ...userData, clerkId: user.id },
      update: userData,
    });

    const host = await prismadb.host.findUnique({
      where: { hostEmail: userData.email },
      select: { id: true },
    });

    if (host)
      await prismadb.host.update({
        where: { id: host.id },
        data: {
          userId: user.id,
        },
      });

    return NextResponse.json({ message: "Success" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: `${error}` }, { status: 500 });
  }
}
