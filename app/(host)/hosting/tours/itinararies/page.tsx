import { IoArrowBack } from "react-icons/io5";
import Link from "next/link";
import { Metadata } from "next";

import ToursHome from "@/components/tours/ToursHome";
import { getTours } from "@/lib/actions/getListings";
import { SafePackage } from "@/util/types";

export const metadata: Metadata = {
  title: "Tour Itineraries",
};

export default async function page() {
  return (
    <>
      <div className="flex gap-4 items-center">
        <Link
          href="../tours"
          className="border-2 rounded-full p-2 hover:border-primary transition hover:text-primary"
        >
          <IoArrowBack size={20} />
        </Link>
        <h1>Tour Itineraries</h1>
      </div>
      <ToursHome packages={(await getTours({})) as SafePackage[]} />
    </>
  );
}
