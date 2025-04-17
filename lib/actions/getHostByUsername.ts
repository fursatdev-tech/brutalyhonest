import prismadb from "@/lib/prismadb";

export default async function getHostByUsername(username: string) {
  if (!username) return null;

  try {
    const host = await prismadb.host.findFirst({
      where: {
        user: {
          username,
        },
      },
      select: {
        name: true,
        profilePhotoUrl: true,
        description: true,
      },
    });

    if (!host) return null;

    return host;
  } catch (error: any) {
    throw new Error(error);
  }
}
