"use client";
import { IoChevronForward } from "react-icons/io5";
import { usePathname } from "next/navigation";

import { OnboardingBreadCrumbps } from "@/components/navbar/data";
import { cn } from "@/lib/utils";

const OnboardingBreadcrump = () => {
  const pathname = usePathname();

  return (
    <div className="flex gap-3 items-center">
      {OnboardingBreadCrumbps.map((item, idx) => (
        <div key={idx} className="flex gap-3 items-center text-sm">
          {idx !== 0 && <IoChevronForward />}
          <p
            className={cn(
              pathname.includes(item.active) && "text-primary transition"
            )}
          >
            {item.name}
          </p>
        </div>
      ))}
    </div>
  );
};

export default OnboardingBreadcrump;
