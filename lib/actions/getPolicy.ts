import prismadb from "@/lib/prismadb";

export const getPolicy = async (type: string) => {
  try {
    return await prismadb.policy.findUnique({
      where: {
        type,
      },
    });
  } catch (error) {
    throw Error(`${error}`);
  }
};
