import { currentUser } from "@clerk/nextjs/server";
import { Account } from "@prisma/client";

import prismadb from "@/lib/prismadb";

export const getHostStripeAccount = async () => {
  const user = await currentUser();

  if (!user) return false;

  const foundAccount = await prismadb.account.findUnique({
    where: {
      userId: user.id,
    },
    select: {
      id: true,
    },
  });

  if (!foundAccount) return false;

  return true;
};

export const getAccountData = async () => {
  const user = await currentUser();

  if (!user) return {} as Account;

  try {
    const foundAccount = await prismadb.account.findUnique({
      where: {
        userId: user.id,
      },
      select: {
        preferredMode: true,
        accountType: true,
        upi: true,
        paypal: true,
        accountNumber: true,
        ifsc: true,
        name: true,
      },
    });

    if (!foundAccount) return {} as Account;

    return foundAccount;
  } catch (error) {
    return {} as Account;
  }
};
