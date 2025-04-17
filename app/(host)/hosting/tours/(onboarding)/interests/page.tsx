"use client";

import { IoChevronForward } from "react-icons/io5";
import { parseAsArrayOf, parseAsString, useQueryState } from "nuqs";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { InterestsData } from "@/components/tours/interestsData";
import { cn } from "@/lib/utils";
import { saveInterestsAndSocial } from "@/lib/actions/saveInterestsAndSocial";
import { showError } from "@/util/catchError";

const Page = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [interests, setInterests] = useQueryState(
        "interests",
        parseAsArrayOf(parseAsString).withDefault([])
    );
    const [loading, setLoading] = useState(false);

    const addOrRemoveInterest = (value: string) => {
        if (interests.includes(value))
            return setInterests((prev) =>
                prev.filter((item) => item !== value)
            );

        setInterests((prev) => [...prev, value]);
    };

    const navigate = async () => {
        if (!interests.length) return;

        setLoading(true);

        const { error } = await saveInterestsAndSocial({ interests });

        if (error) {
            setLoading(false);
            return showError({ message: error });
        }

        router.push(
            `/hosting/tours/socials?${decodeURIComponent(
                searchParams.toString()
            )}`
        );
    };

    return (
        <>
            <p className="font-bold text-3xl">Tell us About Your Interests</p>
            <p>
                Select at least once interest to personalize your BrutalyHonest Tour
                experience
            </p>

            <div className="flex flex-wrap gap-3">
                {InterestsData.map((item, idx) => {
                    const Icon = item.icon;
                    return (
                        <div
                            className={cn(
                                "rounded-lg p-5 w-[calc(50%-14px)] md:w-36 flex flex-col gap-4 justify-between border-2 cursor-pointer transition text-secondary-foreground text-sm",
                                interests.includes(item.value) && item.class
                            )}
                            key={idx}
                            onClick={() => addOrRemoveInterest(item.value)}
                        >
                            <Icon size={36} />

                            <p className="font-medium leading-tight">
                                {item.text}
                            </p>
                        </div>
                    );
                })}
            </div>

            <Button
                className="w-fit"
                disabled={!interests.length || loading}
                onClick={navigate}
                loading={loading}
            >
                Next <IoChevronForward className="w-4 h-4 ms-2" />
            </Button>
        </>
    );
};

export default Page;
