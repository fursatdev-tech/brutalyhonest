import { currentUser } from "@clerk/nextjs/server";

import prismadb from "@/lib/prismadb";

export const getTermsAcceptanceStatus = async () => {
  const user = await currentUser();

  try {
    if (!user) return new Error("Unauthorized");

    const foundHost = await prismadb.host.findUnique({
      where: {
        userId: user.id,
      },
      select: {
        acceptedTerms: true,
      },
    });

    if (!foundHost) return false;

    return foundHost.acceptedTerms;
  } catch (error) {
    throw new Error(`${error}`);
  }
};
