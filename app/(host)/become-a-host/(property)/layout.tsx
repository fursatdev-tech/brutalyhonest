"use client";
import { useEffect, useState } from "react";
import { parseAsBoolean, parseAsString, useQueryStates } from "nuqs";
import { usePathname, useRouter } from "next/navigation";
import qs from "query-string";
import axios from "axios";

import {
    AirbnbData,
    AirbnbDataProvider,
} from "@/components/become-a-host/AirbnbContext";
import { Button } from "@/components/ui/button";
import Container from "@/components/ui/container";
import { Progress } from "@/components/ui/progress";
import { getAirBnbProperty } from "@/lib/actions/getAirBnbProperty";
import { toast } from "@/components/ui/use-toast";
import { getPublishedProperty, saveOrUpdateListing } from "@/util/routes";
import PropertyLoader from "./loading";
import { showError } from "@/util/catchError";
import { getBookingDotComProperty } from "@/lib/actions/getBookingDotComProperty";

interface Props {
    children: React.ReactNode;
}

const CreatePropertyLayout = ({ children }: Props) => {
    const [propertyDetails, setPropertyDetails] = useState({} as AirbnbData);
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);

    const pathname = usePathname();
    const router = useRouter();

    const [params, setParams] = useQueryStates({
        url: parseAsString,
        category: parseAsString.withDefault(""),
        id: parseAsString,
        agreement: parseAsBoolean,
        isBookingUrl: parseAsBoolean.withDefault(false),
    });

    useEffect(() => {
        if (params?.id) getExistingPropertyId(params.id);

        if (!params.url) return;

        getPropertyData(params.url);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params?.url, params?.id]);

    useEffect(() => {
        if (!params.category) return;

        setPropertyDetails((prev) => ({ ...prev, category: params.category }));
    }, [params.category]);

    useEffect(() => {
        switch (true) {
            case pathname.includes("property-type"):
                return setProgress(15);

            case pathname.includes("property-location"):
                return setProgress(30);

            case pathname.includes("property-features"):
                return setProgress(45);

            case pathname.includes("property-images"):
                return setProgress(60);

            case pathname.includes("property-description"):
                return setProgress(75);

            case pathname.includes("pricing"):
                return setProgress(85);

            case pathname.includes("cancellation-policy"):
                return setProgress(90);

            case pathname.includes("host-details"):
                return setProgress(100);

            default:
                break;
        }
    }, [pathname]);

    const getPropertyData = async (propertyId: string) => {
        setLoading(true);

        const data: AirbnbData = params.isBookingUrl
            ? await getBookingDotComProperty(propertyId, params.category)
            : await getAirBnbProperty(propertyId, params.category);

        if (!data) return showError({ message: "Property not found" });

        setPropertyDetails(data);
        setLoading(false);
    };

    const getExistingPropertyId = async (id: string) => {
        try {
            const res = await axios.get(getPublishedProperty(id));

            const { data } = res.data;

            setPropertyDetails((prev) => ({ ...prev, ...data }));

            setParams({ ...params, category: data.categoryId });
        } catch (error) {
            showError(error);
        }
    };

    const navigate = () => {
        if (pathname.includes("host-details")) return saveListing();

        let url = "";

        switch (true) {
            case pathname.includes("property-type"):
                url = getUrl("property-location");
                break;

            case pathname.includes("property-location"):
                url = getUrl("property-features");
                break;

            case pathname.includes("property-features"):
                url = getUrl("property-images");
                break;

            case pathname.includes("property-images"):
                url = getUrl("property-description");
                break;

            case pathname.includes("property-description"):
                url = getUrl("pricing");
                break;

            case pathname.includes("pricing"):
                url = getUrl("cancellation-policy");
                break;

            case pathname.includes("cancellation-policy"):
                url = getUrl("host-details");
                break;

            default:
                break;
        }

        router.push(url);
    };

    const getUrl = (segment: string) => {
        return qs.stringifyUrl(
            {
                url: `/become-a-host/${segment}`,
                query: params,
            },
            { skipNull: true }
        );
    };

    const isNextDisabled = () => {
        switch (true) {
            case pathname.includes("property-type"):
                return !propertyDetails.category;

            case pathname.includes("property-location"):
                return !propertyDetails.location;

            case pathname.includes("property-features"):
                return !propertyDetails.guests;

            case pathname.includes("property-images"):
                return (
                    !propertyDetails.images || propertyDetails.images.length < 1
                );

            case pathname.includes("property-description"):
                return !propertyDetails.title || !propertyDetails.description;

            case pathname.includes("pricing"):
                const originalPrice = parseInt(
                    propertyDetails.originalPrice?.inr || "0"
                );
                const b2bPrice = parseInt(propertyDetails.b2bPrice?.inr || "0");
                const pgOriginalPrice = parseInt(
                    propertyDetails.pgOriginalPrice?.inr || "0"
                );
                const pgB2bPrice = parseInt(
                    propertyDetails.pgB2bPrice?.inr || "0"
                );

                return (
                    !originalPrice ||
                    !propertyDetails.b2bPrice ||
                    (propertyDetails.perGuestPricing &&
                        (!pgOriginalPrice ||
                            !pgB2bPrice ||
                            pgOriginalPrice < pgB2bPrice)) ||
                    originalPrice < b2bPrice
                );

            case pathname.includes("cancellation-policy"):
                return !propertyDetails.cancellationPolicyId;

            case pathname.includes("host-details"):
                return !(
                    propertyDetails.hostName &&
                    propertyDetails.hostEmail &&
                    propertyDetails.hostPhone
                );

            default:
                return false;
        }
    };

    const RenderProgressBar = () => {
        return (
            <Progress className="rounded-none h-1" value={progress} max={100} />
        );
    };

    const saveListing = async () => {
        setLoading(true);

        try {
            const response = await axios.post(
                saveOrUpdateListing,
                propertyDetails
            );

            const { message } = response.data;

            toast({
                description: message,
                duration: 3000,
            });

            router.refresh();

            router.push("/hosting/properties");
        } catch (error: any) {
            toast({
                description: error?.message ?? "Something went wrong",
                duration: 3000,
                variant: "destructive",
            });
            setLoading(false);
        }
    };

    return (
        <div className="pb-28">
            <AirbnbDataProvider
                propertyDetails={propertyDetails}
                setPropertyDetails={setPropertyDetails}
            >
                <Container>{loading ? <PropertyLoader /> : children}</Container>
            </AirbnbDataProvider>

            <div className="text-right bottom-0 fixed space-y-4 bg-background px-4 md:px-8 py-4 w-full">
                <RenderProgressBar />

                <div className="flex justify-between items-center">
                    <Button
                        size="lg"
                        variant="link"
                        className="text-secondary"
                        disabled={loading}
                        onClick={() => router.back()}
                    >
                        Back
                    </Button>
                    <Button
                        size="lg"
                        disabled={loading || isNextDisabled()}
                        loading={loading}
                        onClick={navigate}
                    >
                        {pathname.includes("host-details")
                            ? params.id
                                ? "Update listing"
                                : params.agreement
                                ? "Accept & Publish"
                                : "Submit for Review"
                            : "Next"}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default CreatePropertyLayout;
