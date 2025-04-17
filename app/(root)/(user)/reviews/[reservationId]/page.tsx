"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import BImage from "@/util/Image";

const Getstarted = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchparams = useSearchParams();

  const host = searchparams.get("host");

  return (
    <>
      <div className="max-w-xl mx-auto space-y-6">
        <div className="relative w-28 h-28 bg-black/5 rounded-full">
          <BImage
            src="/images/review.jpg"
            alt="Review"
            className="rounded-full"
          />
        </div>

        <h1 className="!text-3xl font-bold">Write a review for {host}</h1>

        <div className="space-y-3 text-muted">
          <p>
            Tell us how things went at {host}&apos;s place. Your feedback
            encourages Hosts to do their best and helps future guests know what
            to expect.
          </p>
          <p>
            We&apos;ll wait to publish your review for 13 days or until {host}
            writes a review for you — whichever comes first.
          </p>
        </div>
      </div>

      <div className="fixed bottom-0 py-4 space-y-4 w-full">
        <Progress className="rounded-none h-1" value={0} max={100} />

        <div className="max-w-xl mx-auto flex justify-end">
          <Button
            className="text-primary-foreground"
            variant="secondary"
            onClick={() =>
              router.push(pathname + "/stay?" + searchparams.toString())
            }
          >
            Get started
          </Button>
        </div>
      </div>
    </>
  );
};

export default Getstarted;
