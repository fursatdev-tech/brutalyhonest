"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { PiGift } from "react-icons/pi";
import { Fragment } from "react";

import Logo from "@/components/navbar/Logo";
import UserMenu from "@/components/navbar/UserMenu";
import { hostMenuItems } from "./data";
import { cn } from "@/lib/utils";

import styles from "./navbar.module.css";

const HostNavBar = () => {
  let pathname = usePathname().replace("/hosting", "");

  if (pathname === "") pathname = "/dashboard";

  return (
    <div className="flex justify-between items-center gap-6 border-b-2 px-6 py-3 bg-background">
      <Logo />

      <div className="hidden md:flex gap-2 items-center">
        {hostMenuItems.map((item, idx) => (
          <Fragment key={idx}>
            {!item?.hidden && (
              <Link
                href={item.link}
                className={cn(
                  "text-sm font-semibold px-4 py-2 transition cursor-pointer text-muted-foreground relative rounded-full hover:bg-gray-100",
                  pathname.includes(item.ghostLink) && "text-secondary",
                  pathname.includes(item.ghostLink) && styles.hostBorder
                )}
              >
                {item.name}
              </Link>
            )}
          </Fragment>
        ))}
      </div>

      <div className="flex gap-4 items-center">
        <Link
          href="/hosting/referral"
          className={cn(
            "hover:text-primary transition",
            pathname.includes("referral") && "text-primary"
          )}
        >
          <PiGift size={20} />
        </Link>

        <UserMenu nolink />
      </div>
    </div>
  );
};

export default HostNavBar;
