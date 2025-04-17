"use client";
import { parseAsBoolean, useQueryState } from "nuqs";

import Heading from "./Heading";
import BImage from "@/util/Image";
import { cn } from "@/lib/utils";
import SeeAllTrigger from "@/components/listings/details/SeeAllTrigger";

import ShareDialog from "@/util/ShareDialog";
import FavouriteListingBtn from "./FavouriteListingBtn";
import { ListingStatus } from "@prisma/client";

import styles from "./styles.module.css";

interface ListingHeadProps {
    title: string;
    imageUrl: string;
    id: string;
    location: string;
    images: string[];
    favouriteIds: string[];
    status: ListingStatus;
}

const ListingHead = ({
    title,
    id,
    location,
    images,
    imageUrl,
    favouriteIds,
    status,
}: ListingHeadProps) => {
    const [show, setShow] = useQueryState(
        "gallery",
        parseAsBoolean.withDefault(false)
    );

    const getClassNameForImages = () => {
        if (images.length === 1) return "grid grid-cols-1 gap-2 md:grid-cols-1";

        return "grid grid-cols-1 md:grid-cols-2 gap-2";
    };

    const getSecondSectionClassName = (imagesLength: number) => {
        if (imagesLength === 1) {
            return "grid grid-cols-1 gap-2";
        } else if (imagesLength === 2) {
            return "grid grid-cols-1 gap-2";
        } else {
            return "grid grid-cols-2 gap-2 md:grid-cols-2";
        }
    };

    return (
        <>
            {status === ListingStatus.draft && (
                <p className="bg-red-100 px-6 py-3 rounded-xl font-semibold">
                    Property is in draft mode. It will be available for booking
                    once approved by host.
                </p>
            )}

            <div className="flex justify-between items-center">
                <Heading title={title} subtitle={location ?? ""} />

                <div className="flex">
                    <ShareDialog
                        title={title}
                        url={window.location.href}
                        image={imageUrl}
                    />
                    <FavouriteListingBtn
                        listingId={id}
                        favouriteIds={favouriteIds}
                    />
                </div>
            </div>

            <div className="relative">
                <SeeAllTrigger
                    images={images}
                    title={title}
                    setShow={setShow}
                    show={show}
                />

                <div className={`${getClassNameForImages()} h-[60vh]`}>
                    <div
                        className="relative w-full h-auto"
                        onClick={() => setShow(true)}
                    >
                        <BImage
                            src={images[0]}
                            alt="Image"
                            className={cn(
                                "rounded-t-xl md:rounded-tr-none md:rounded-l-xl",
                                styles.img
                            )}
                        />
                    </div>

                    <div
                        className={cn(
                            "group",
                            getSecondSectionClassName(images.slice(1).length)
                        )}
                        onClick={() => setShow(true)}
                    >
                        {images.slice(1, 5).map((image, index) => (
                            <div
                                className="relative w-full min-h-[50%]"
                                key={`${id}-${image}`}
                            >
                                <BImage
                                    src={image}
                                    alt="Image"
                                    className={cn(
                                        styles.img,
                                        index === 1 && "md:rounded-tr-xl",
                                        index === 2 &&
                                            "rounded-bl-xl md:rounded-bl-none",
                                        index === 3 && "rounded-br-xl"
                                    )}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default ListingHead;
