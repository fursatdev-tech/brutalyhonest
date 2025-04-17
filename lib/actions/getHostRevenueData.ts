import { currentUser } from "@clerk/nextjs/server";
import { format, startOfMonth } from "date-fns";

import prismadb from "@/lib/prismadb";

export const getHostRevenueData = async () => {
  const user = await currentUser();

  if (!user) return [];

  try {
    const reservationsHostPromise = prismadb.revenue.findMany({
      where: {
        host: {
          user: {
            clerkId: user.id,
          },
        },
      },
      select: {
        createdAt: true,
        hostEarning: true,
        earning: true,
      },
    });

    const reservationsCoHostPromise = prismadb.revenue.findMany({
      where: {
        cohost: {
          some: {
            host: {
              user: {
                clerkId: user.id,
              },
            },
          },
        },
      },
      select: {
        createdAt: true,
        coHostEarning: true,
        earning: true,
      },
    });

    const [reservationsHost, reservationsCoHost] = await Promise.all([
      reservationsHostPromise,
      reservationsCoHostPromise,
    ]);

    const monthlySalesMap = new Map();

    const reservations = [...reservationsHost, ...reservationsCoHost];

    for (const reservation of reservations) {
      const monthStart = startOfMonth(reservation.createdAt);
      const monthYearKey = format(monthStart, "MMM yy");

      const hostEarning =
        "hostEarning" in reservation
          ? reservation?.hostEarning
          : "coHostEarning" in reservation
          ? reservation?.coHostEarning
          : 0;

      if (!monthlySalesMap.has(monthYearKey))
        monthlySalesMap.set(monthYearKey, { Sales: 0, Earnings: 0 });

      const current = monthlySalesMap.get(monthYearKey);
      current.Sales += reservation.earning;
      current.Earnings += hostEarning;
    }

    const monthlySales = Array.from(monthlySalesMap, ([Month, data]) => ({
      Month,
      ...data,
    }));

    return monthlySales;
  } catch (error) {
    return [];
  }
};

interface IHostEarning {
  createdAt: Date;
  earning: number;
  hostEarning: number;
}
