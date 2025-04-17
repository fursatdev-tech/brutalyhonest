"use client";
import { Separator } from "@/components/ui/separator";
import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";
import ReactStars from "react-stars";
import { HiOutlineChatBubbleLeftRight } from "react-icons/hi2";

import ReviewSubtitle from "@/components/profile/review/ReviewSubtitle";
import CommunicationOptions from "@/components/profile/review/CommunicationOptions";

const Communication = () => {
    const [params, setParams] = useQueryStates({
        communicationRating: parseAsInteger.withDefault(0),
        host: parseAsString,
    });

    const rating = params.communicationRating;
    const host = params.host;

    return (
        <>
            <HiOutlineChatBubbleLeftRight size={80} />

            <div className="space-y-6">
                <h1 className="font-bold !text-3xl">
                    How well did {host} communicate?
                </h1>

                <p className="text-muted">
                    From booking to checkout, how well did {host} communicate
                    with you?
                </p>

                <div>
                    <ReactStars
                        count={5}
                        size={48}
                        color2={"#008080"}
                        half={false}
                        value={rating}
                        onChange={(communicationRating) =>
                            setParams((prev) => ({
                                ...prev,
                                communicationRating,
                            }))
                        }
                    />

                    <ReviewSubtitle rating={rating} name="well" />
                </div>

                {rating > 0 && (
                    <>
                        <Separator />

                        <CommunicationOptions />
                    </>
                )}
            </div>
        </>
    );
};

export default Communication;
