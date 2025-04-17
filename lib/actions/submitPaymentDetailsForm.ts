"use server";

import { currentUser } from "@clerk/nextjs/server";
import { AccountType, PreferredMode } from "@prisma/client";
import * as z from "zod";
import { revalidatePath } from "next/cache";

import prismadb from "@/lib/prismadb";

export const submitPaymentDetailsForm = async (
  prevState: { message: string },
  formData: FormData
) => {
  try {
    const user = await currentUser();

    if (!user) return { message: "User not found" };

    const schema = z.object({
      accountType: z.enum([AccountType.current, AccountType.savings]),
      preferredMode: z.enum([
        PreferredMode.vpa,
        PreferredMode.bank,
        PreferredMode.paypal,
      ]),
      name: z.string().optional().nullable(),
      accountNumber: z.string().optional().nullable(),
      ifsc: z.string().optional().nullable(),
      paypal: z.string().optional().nullable(),
      upi: z.string().optional().nullable(),
      pathname: z.string(),
    });

    const parse = schema.safeParse({
      accountType: formData.get("accountType"),
      preferredMode: formData.get("preferredMode"),
      name: formData.get("name"),
      accountNumber: formData.get("accountNumber"),
      ifsc: formData.get("ifsc"),
      paypal: formData.get("paypal"),
      upi: formData.get("upi"),
      pathname: formData.get("pathname"),
    });

    if (!parse.success) return { message: "Invalid form data" };

    const { pathname } = parse.data;

    const pasedData = Object.fromEntries(
      Object.entries(parse.data).filter(
        ([key, value]) => value !== null && key !== "pathname"
      )
    );

    await prismadb.account.upsert({
      where: {
        userId: user.id,
      },
      create: { ...pasedData, userId: user.id },
      update: pasedData,
    });

    revalidatePath(pathname);

    return { message: "Details saved/updated" };
  } catch (error: any) {
    return { message: `${error}` };
  }
};
