import Image from "next/image";
import { TiPlus } from "react-icons/ti";
import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import Container from "@/components/ui/container";
import CopyReferralLink from "@/components/referral/CopyReferralLink";

const HostReferral = async () => {
  const user = await currentUser();

  const username = user?.username || "";

  return (
    <Container className="pb-28">
      <div className="grid grid-cols-4 place-content-center mx-auto gap-8">
        <div className="col-span-4 md:col-span-1 border shadow-sm rounded-xl py-6 px-4 space-y-8 mb-auto">
          <Link href="tours">
            <Button className="w-full">
              Start Surveying&nbsp;&nbsp;
              <TiPlus className="w-4 h-4" />
            </Button>
          </Link>

          <div className="space-y-4">
            <p className="font-bold">Survey your audience!</p>

            <p>
              Start surveying to gain insights about what itineraries fit your
              audience best.
            </p>
          </div>
        </div>

        <div className="col-span-4 md:col-span-3 border shadow-sm rounded-xl p-8 md:p-12">
          <div className="grid grid-cols-2 gap-4">
            <Image
              src="/images/referral/refer.svg"
              width={300}
              height={300}
              alt="refer a host"
              className="col-span-2 md:col-span-1"
            />

            <div className="col-span-2 md:col-span-1 space-y-4 my-auto">
              <p className="font-bold text-2xl">Refer a Host and Earn $500</p>
              <p>
                Know someone who would be a great BrutalyHonest Host? Share your signup
                link and get $500 when their trip confirms!
              </p>

              <div className="space-y-2">
                <p className="font-bold">Share Your Link</p>

                <div className="border rounded-xl flex p-1 items-center justify-between">
                  <p className="pl-2 md:pl-4 text-sm">
                    https://brutalyhonest.ai/referral/{username}
                  </p>

                  <CopyReferralLink username={username} />
                </div>

                <Link href="/host-referral-program" target="_blank">
                  <Button variant="link" className="px-1">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default HostReferral;
