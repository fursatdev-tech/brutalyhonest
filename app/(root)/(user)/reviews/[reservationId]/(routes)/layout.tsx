"use client";
import { useParams, usePathname, useRouter } from "next/navigation";
import { IoIosArrowBack } from "react-icons/io";
import qs from "query-string";
import {
    parseAsArrayOf,
    parseAsInteger,
    parseAsString,
    useQueryStates,
} from "nuqs";
import axios from "axios";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
    ReviewData,
    ReviewProvider,
} from "@/components/profile/review/ReviewContext";
import { showError } from "@/util/catchError";
import { saveOrUpdateReview } from "@/util/routes";
import { ReviewStatus } from "@prisma/client";

interface Props {
    children: React.ReactNode;
}

const Layout = ({ children }: Props) => {
    const router = useRouter();
    const pathname = usePathname();
    const routeParam = useParams();
    const [progress, setProgress] = useState(0);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<ReviewData>({
        reservationId: routeParam.reservationId,
    } as ReviewData);

    const [params, setParams] = useQueryStates({
        overallRating: parseAsInteger,
        checkinRating: parseAsInteger,
        cleanlinessRating: parseAsInteger,
        accuracyRating: parseAsInteger,
        communicationRating: parseAsInteger,
        locationRating: parseAsInteger,
        valueRating: parseAsInteger,
        checkinFeedback: parseAsArrayOf(parseAsString),
        cleanlinessFeedback: parseAsArrayOf(parseAsString),
        accuracyFeedback: parseAsArrayOf(parseAsString),
        communicationFeedback: parseAsArrayOf(parseAsString),
        locationFeedback: parseAsArrayOf(parseAsString),
        host: parseAsString,
    });

    const isLastStep = pathname.includes("private");

    const navigate = () => {
        if (isLastStep) saveAndNavigate();

        let url = "";

        switch (true) {
            case pathname.includes("stay"):
                url = getUrl("stay", "check-in");
                break;

            case pathname.includes("check-in"):
                url = getUrl("check-in", "clean");
                break;

            case pathname.includes("clean"):
                url = getUrl("clean", "accuracy");
                break;

            case pathname.includes("accuracy"):
                url = getUrl("accuracy", "communication");
                break;

            case pathname.includes("communication"):
                url = getUrl("communication", "location");
                break;

            case pathname.includes("location"):
                url = getUrl("location", "value");
                break;

            case pathname.includes("value"):
                url = getUrl("value", "public");
                break;

            case pathname.includes("public"):
                url = getUrl("public", "private");
                break;

            default:
                break;
        }

        router.push(url);
    };

    useEffect(() => {
        saveUpdateReview();

        switch (true) {
            case pathname.includes("stay"):
                return setProgress(10);

            case pathname.includes("check-in"):
                return setProgress(20);

            case pathname.includes("clean"):
                return setProgress(30);

            case pathname.includes("accuracy"):
                return setProgress(40);

            case pathname.includes("communication"):
                return setProgress(50);

            case pathname.includes("location"):
                return setProgress(60);

            case pathname.includes("value"):
                return setProgress(70);

            case pathname.includes("public"):
                return setProgress(80);

            case pathname.includes("private"):
                return setProgress(90);

            default:
                break;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathname]);

    const saveUpdateReview = async () => {
        setLoading(true);

        try {
            await axios.post(saveOrUpdateReview, {
                ...params,
                ...data,
                status: isLastStep
                    ? ReviewStatus.submitted
                    : ReviewStatus.draft,
            });
        } catch (error: any) {
            showError(error);
        } finally {
            setLoading(false);
        }
    };

    const getUrl = (oldVal: string, newVal: string) => {
        return qs.stringifyUrl(
            {
                url: pathname.replace(oldVal, newVal),
                query: params,
            },
            { skipNull: true }
        );
    };

    const getIsDisabled = () => {
        switch (true) {
            case pathname.includes("stay"):
                return !params.overallRating;

            case pathname.includes("check-in"):
                return (
                    !params.checkinRating ||
                    (params.checkinRating <= 3 &&
                        !params.checkinFeedback?.length)
                );

            case pathname.includes("clean"):
                return (
                    !params.cleanlinessRating ||
                    (params.cleanlinessRating <= 3 &&
                        !params.cleanlinessFeedback?.length)
                );

            case pathname.includes("accuracy"):
                return (
                    !params.accuracyRating ||
                    (params.accuracyRating <= 3 &&
                        !params.accuracyFeedback?.length)
                );

            case pathname.includes("communication"):
                return (
                    !params.communicationRating ||
                    (params.communicationRating <= 3 &&
                        !params.communicationFeedback?.length)
                );

            case pathname.includes("location"):
                return (
                    !params.locationRating ||
                    (params.locationRating <= 3 &&
                        !params.locationFeedback?.length)
                );

            case pathname.includes("value"):
                return !params.valueRating;

            case pathname.includes("public"):
                return !data.publicReview;

            default:
                return false;
        }
    };

    const saveAndNavigate = async () => {
        await saveUpdateReview();

        const url = getUrl("private", "submitted");

        router.push(url);
    };

    return (
        <>
            <div className="max-w-xl mx-auto space-y-6">
                <ReviewProvider data={data} setData={setData}>
                    {children}
                </ReviewProvider>
            </div>

            <div className="fixed bottom-0 py-4 space-y-4 w-full">
                <Progress
                    className="rounded-none h-1"
                    value={progress}
                    max={100}
                />

                <div className="max-w-xl mx-auto flex justify-between">
                    <Button
                        className=""
                        variant="outline"
                        onClick={() => router.back()}
                    >
                        <IoIosArrowBack className="mr-2 h-4 w-4" />
                        Back
                    </Button>
                    <Button
                        className="text-primary-foreground"
                        variant={isLastStep ? "default" : "secondary"}
                        onClick={navigate}
                        disabled={getIsDisabled() || loading}
                        loading={loading}
                    >
                        {isLastStep ? "Submit" : "Next"}
                    </Button>
                </div>
            </div>
        </>
    );
};

export default Layout;
