import { Metadata } from "next";
import { cache } from "react";

import getListingById from "@/lib/actions/getListingById";
import ListingHead from "@/components/listings/details/ListingHead";
import ListingInfo from "@/components/listings/details/ListingInfo";
import ListingReservation from "@/components/listings/details/ListingReservation";
import { getAllFavourites } from "@/lib/actions/getAllFavourites";

interface PageProps {
    params: Promise<{
        listingId: string[];
    }>;
}

const getListingCache = cache(async (id: string) => {
    return await getListingById(id);
});

export async function generateMetadata({
    params,
}: PageProps): Promise<Metadata> {
    const id = (await params).listingId[0];

    const { title, imageUrl, description } = await getListingCache(id);

    return {
        title,
        metadataBase: new URL(`${process.env.META_URL}/listings/${id}`),
        openGraph: {
            title,
            description,
            type: "website",
            siteName: "BrutalyHonest",
            url: `${process.env.META_URL}/listings/${id}`,
            images: {
                url: "https://brutalyhonest.ai/images/meta.jpg",
                alt: "BrutalyHonest",
            },
        },
        twitter: {
            card: "summary_large_image",
            images: [imageUrl],
            site: "@brutalyhonest",
            title,
            description,
        },
    };
}

const ListingDetails = async ({ params }: PageProps) => {
    const listing = await getListingCache((await params).listingId[0]);

    const favouriteIds = await getAllFavourites();

    return (
        <section className="flex flex-col gap-6 mb-6">
            <ListingHead {...listing} favouriteIds={favouriteIds} />

            <div className="md:gap-10 grid grid-cols-1 md:grid-cols-7">
                <ListingInfo {...listing} />

                <div className="order-first md:order-last md:col-span-3 mb-10">
                    <ListingReservation {...listing} />
                </div>
            </div>
        </section>
    );
};

export default ListingDetails;
