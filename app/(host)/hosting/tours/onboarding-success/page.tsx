import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";
import { IoChevronForward } from "react-icons/io5";

import { Button } from "@/components/ui/button";
import ThreeStepProcess from "@/components/tours/ThreeStepProcess";

const Page = async () => {
  const user = await currentUser();

  return (
    <div className="grid place-content-center min-h-[calc(100vh-284px)] space-y-8  max-w-2xl mx-auto">
      <p className="text-3xl font-bold">
        Congratulations, {user?.firstName} 🎉
      </p>
      <p>
        You&apos;re one step closer to hosting trips with your audience. Now,
        let&apos;s better understand where your audience wants to travel.
      </p>

      <ThreeStepProcess one />

      <Link href="/hosting/tours" className="w-fit">
        <Button className="w-fit">
          Start Surveying <IoChevronForward className="ms-2 h-4 w-4" />
        </Button>
      </Link>
    </div>
  );
};

export default Page;
