"use client";
import Image from "next/image";
import Link from "next/link";
import { useContext } from "react";

import { AppContext } from "@/util/AppContext";

const Logo = () => {
  const { data } = useContext(AppContext);

  const urlBase = data?.isHost ? "/hosting" : "/";

  return (
    <>
      <Link
        href={urlBase}
        className="relative hidden h-[40px] w-[100px] md:block"
      >
        <Image
          priority
          className="cursor-pointer object-contain md:block"
          src="/images/logo.png"
          fill
          alt="Logo"
        />
      </Link>

      <Link
        href={urlBase}
        className="relative block h-[50px] w-[40px] md:hidden"
      >
        <Image
          className="cursor-pointer object-contain md:block"
          src="/images/favicon.png"
          fill
          priority
          alt="Logo"
        />
      </Link>
    </>
  );
};

export default Logo;
