"use client";
import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";
import { PiCheckCircleDuotone } from "react-icons/pi";
import Link from "next/link";

import { Button } from "@/components/ui/button";

const Submitted = () => {
    const [params, setParams] = useQueryStates({
        overallRating: parseAsInteger.withDefault(0),
        host: parseAsString,
    });

    const rating = params.overallRating;
    const host = params.host;

    const isPositive = rating >= 4;

    return (
        <div className="flex flex-col justify-center items-center gap-6 mx-auto max-w-sm text-center">
            <PiCheckCircleDuotone size={80} className="text-primary" />

            <h1 className="font-bold !text-3xl">
                {isPositive ? "Glad" : "Sad"} to hear{" "}
                {isPositive ? "you loved" : "you had issues at"} {host}&apos;s
                place!
            </h1>

            <p className="text-muted">
                Thanks for your review — your feedback helps {host} know what{" "}
                {isPositive ? "stood out" : "went wrong"}, and lets other guests
                know what to look forward to.
            </p>

            <Link href="/">
                <Button variant="secondary">Done</Button>
            </Link>
        </div>
    );
};

export default Submitted;
