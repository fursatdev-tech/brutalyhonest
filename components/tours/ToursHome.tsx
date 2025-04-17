import { SafePackage } from "@/util/types";
import Nodata from "@/util/Nodata";
import PackageCard from "@/components/tours/PackageCard";
import Image from "next/image";

interface Props {
  packages: SafePackage[];
  noDataTitle?: string;
  noDataSubtitle?: string;
}

const ToursHome = async ({ packages, ...props }: Props) => {
  return (
    <>
      {/* Hero image */}
      <div className="sm:hidden h-[calc(100vh-80px)] rounded-xl mb-6">
        <div className="z-0 top-40 w-full">
          <Image
            priority
            src="/images/hero/Group.png"
            layout="fill"
            alt="Hero Image"
            objectFit="cover"
            quality={100}
          />
        </div>
        <div className="relative z-10">
          <p className="text-3xl text-center pt-5 font-medium w-1/2 mx-auto">
            Leisurely Travel Like a
            <span className="text-[#00BFBF]"> Creator </span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 pb-28">
        {packages.map((tour, index) => (
          <PackageCard key={tour.id} data={tour} />
        ))}

        {packages.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center">
            <Nodata title={props.noDataTitle} subtitle={props.noDataSubtitle} />
          </div>
        )}
      </div>
    </>
  );
};

export default ToursHome;
