"use client";

import { IoChevronForward } from "react-icons/io5";
import { parseAsString, useQueryState } from "nuqs";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { saveInterestsAndSocial } from "@/lib/actions/saveInterestsAndSocial";
import { showError } from "@/util/catchError";
import { revalidatePath } from "next/cache";

const Page = () => {
    const router = useRouter();
    const [hostedBefore, setHostedBefore] = useQueryState(
        "hosted-before",
        parseAsString
    );
    const [prevHostedTrips, setPrevHostedTrips] = useQueryState(
        "prev-hosted-trips",
        parseAsString.withDefault("")
    );
    const [prevAvgCost, setPrevAvgCost] = useQueryState(
        "prev-avg-cost",
        parseAsString.withDefault("")
    );
    const [loading, setLoading] = useState(false);

    const navigate = async () => {
        setLoading(true);

        const { error } = await saveInterestsAndSocial({
            hostedBefore: !!(hostedBefore === "yes"),
            prevHostedTrips,
            prevAvgCost,
        });

        if (error) {
            setLoading(false);
            return showError({ message: error });
        }

        router.push("/hosting/tours/onboarding-success");
    };

    const isDisabled =
        !hostedBefore ||
        (hostedBefore === "yes" && (!prevHostedTrips || !prevAvgCost));

    return (
        <>
            <p className="font-bold text-3xl">Tell us About Your Experience</p>

            <div className="space-y-3">
                <p className="font-medium">
                    Have you hosted trips or retreats before?
                </p>

                <ToggleGroup
                    type="single"
                    variant="outline"
                    className="justify-start"
                    onValueChange={(v) => setHostedBefore(v)}
                >
                    <ToggleGroupItem value="no" aria-label="Toggle no">
                        No
                    </ToggleGroupItem>
                    <ToggleGroupItem value="yes" aria-label="Toggle yes">
                        Yes
                    </ToggleGroupItem>
                </ToggleGroup>
            </div>

            {hostedBefore === "yes" && (
                <>
                    <div className="space-y-3">
                        <p className="font-medium">
                            How many trips have you hosted?
                        </p>

                        <ToggleGroup
                            type="single"
                            variant="outline"
                            className="flex-wrap justify-start"
                            onValueChange={(v) => setPrevHostedTrips(v)}
                        >
                            <ToggleGroupItem
                                value="1-2"
                                aria-label="Toggle 1-2"
                                className="min-w-[99px]"
                            >
                                1 - 2
                            </ToggleGroupItem>
                            <ToggleGroupItem
                                value="3-5"
                                aria-label="Toggle 3-5"
                                className="min-w-[99px]"
                            >
                                3 - 5
                            </ToggleGroupItem>
                            <ToggleGroupItem
                                value="6+"
                                aria-label="Toggle 6+"
                                className="min-w-[99px]"
                            >
                                6+
                            </ToggleGroupItem>
                        </ToggleGroup>
                    </div>

                    <div className="space-y-3">
                        <p className="font-medium">
                            What was the average cost per traveler?
                            <br />
                            <span className="text-muted-foreground text-sm">
                                (Not Including airfare)
                            </span>
                        </p>

                        <ToggleGroup
                            type="single"
                            variant="outline"
                            className="flex-wrap justify-start"
                            onValueChange={(v) => setPrevAvgCost(v)}
                        >
                            <ToggleGroupItem
                                value="0-1000"
                                aria-label="Toggle 0-1000"
                                className="min-w-[99px]"
                            >
                                $0 - $1000
                            </ToggleGroupItem>
                            <ToggleGroupItem
                                value="1000-2000"
                                aria-label="Toggle 1000-2000"
                                className="min-w-[99px]"
                            >
                                $1000 - $2000
                            </ToggleGroupItem>
                            <ToggleGroupItem
                                value="2000-3000"
                                aria-label="Toggle 2000-3000"
                                className="min-w-[99px]"
                            >
                                $2000 - $3000
                            </ToggleGroupItem>
                            <ToggleGroupItem
                                value="3000+"
                                aria-label="Toggle 3000+"
                                className="min-w-[99px]"
                            >
                                $3000+
                            </ToggleGroupItem>
                        </ToggleGroup>
                    </div>
                </>
            )}

            <Button
                className="w-fit"
                disabled={isDisabled || loading}
                onClick={navigate}
                loading={loading}
            >
                Next <IoChevronForward className="w-4 h-4 ms-2" />
            </Button>
        </>
    );
};

export default Page;
