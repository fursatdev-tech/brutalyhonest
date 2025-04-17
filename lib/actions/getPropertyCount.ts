import prismadb from "@/lib/prismadb";
import { currentUser } from "@clerk/nextjs/server";

export default async function getPropertyCount() {
    const user = await currentUser();

    if (!user) return { isExistingHost: false };

    const userId = user.id;

    try {
        const propertiesCount = await prismadb.listing.count({
            where: {
                OR: [
                    {
                        userId,
                    },
                    {
                        host: {
                            userId,
                        },
                    },
                    {
                        coHost: {
                            some: {
                                host: {
                                    userId,
                                },
                            },
                        },
                    },
                ],
            },
        });

        return { isExistingHost: propertiesCount > 0 };
    } catch (error: any) {
        throw new Error(error);
    }
}
