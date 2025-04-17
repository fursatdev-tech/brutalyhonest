"use client";
import { parseAsString, useQueryStates } from "nuqs";
import { useContext } from "react";
import { PiNote } from "react-icons/pi";

import { Textarea } from "@/components/ui/textarea";
import { ReviewContext } from "@/components/profile/review/ReviewContext";

const PrivateNote = () => {
    const { data, setData } = useContext(ReviewContext);

    const [params, setParams] = useQueryStates({
        host: parseAsString,
    });

    const host = params.host;

    return (
        <>
            <PiNote size={80} />

            <div className="space-y-6">
                <h1 className="font-bold !text-3xl">Write a private note</h1>

                <p className="text-muted">
                    This feedback&apos;s just for {host} — Share what they can
                    improve about their place or how they host.
                </p>

                <div>
                    <Textarea
                        placeholder="Write feedback that won't be shared with other guests (optional)"
                        rows={10}
                        maxLength={1000}
                        value={data.privateNote}
                        onChange={(e) =>
                            setData((prev) => ({
                                ...prev,
                                privateNote: e.target.value,
                            }))
                        }
                    />
                    <p className="text-right mt-2 font-semibold text-muted-foreground text-xs">
                        {data?.privateNote?.length || 0}/1000
                    </p>
                </div>
            </div>
        </>
    );
};

export default PrivateNote;
