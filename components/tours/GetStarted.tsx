import Image from "next/image";
import { IoChevronForward } from "react-icons/io5";
import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";

import { Button } from "@/components/ui/button";

const GetStarted = async () => {
  const user = await currentUser();

  return (
    <div className="grid place-content-center min-h-[calc(100vh-284px)] space-y-8 max-w-2xl mx-auto">
      <div className="relative hidden h-[40px] w-[100px] md:block">
        <Image
          priority
          className="cursor-pointer object-contain md:block"
          src="/images/logo.png"
          fill
          alt="Logo"
        />
      </div>

      <div>
        <p className="text-3xl font-bold">Hi {user?.firstName} 👋</p>
        <p className="text-3xl font-bold">
          Welcome to <span className="text-primary-light">BrutalyHonest Tours</span>
        </p>
      </div>

      <p>
        BrutalyHonest tours is your seamless solution to planning, selling and managing
        group travel. We&apos;re excited to have your here!
      </p>

      <p>Become a Host in 3 easy steps.</p>

      <Link href="/hosting/tours/interests" className="w-fit">
        <Button className="w-fit">
          Get Started <IoChevronForward className="ms-2 h-4 w-4" />
        </Button>
      </Link>
    </div>
  );
};

export default GetStarted;
