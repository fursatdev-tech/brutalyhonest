"use client";
import { parseAsString, useQueryStates } from "nuqs";
import { LuPencilLine } from "react-icons/lu";
import { useContext } from "react";

import { Textarea } from "@/components/ui/textarea";
import { ReviewContext } from "@/components/profile/review/ReviewContext";

const PublicReview = () => {
    const { data, setData } = useContext(ReviewContext);

    const [params, setParams] = useQueryStates({
        host: parseAsString,
    });

    const host = params.host;

    return (
        <>
            <LuPencilLine size={80} />

            <div className="space-y-6">
                <h1 className="font-bold !text-3xl">Write a public review</h1>

                <p className="text-muted">
                    We&apos;ll show this feedback to other guests — after the
                    review period ends, we&apos;ll publish it on {host}&apos;s
                    listing page.
                </p>

                <div>
                    <Textarea
                        placeholder="Say a few words about your stay"
                        rows={10}
                        maxLength={1000}
                        value={data.publicReview}
                        onChange={(e) =>
                            setData((prev) => ({
                                ...prev,
                                publicReview: e.target.value,
                            }))
                        }
                    />
                    <p className="text-right mt-2 font-semibold text-muted-foreground text-xs">
                        {data?.publicReview?.length || 0}/1000
                    </p>
                </div>
            </div>
        </>
    );
};

export default PublicReview;
