import dynamic from "next/dynamic";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { ListingInfoProps } from "@/components/listings/details/details.props";
import RatingC from "@/util/Rating";
import ListingCategory from "@/components/listings/details/ListingCategory";
import MoreDescription from "@/components/listings/details/dialogs/MoreDescription";
import ListingAmenities from "@/components/listings/details/ListingAmenities";
import { cn } from "@/lib/utils";
import { getCategoryIcon } from "@/util/getCategoryIcon";

const Map = dynamic(() => import("@/util/Map"));

const ListingInfo = ({
    description,
    guests,
    bedrooms,
    baths,
    beds,
    category,
    guestSatisfactionOverall,
    reviewsCount,
    listingLat,
    listingLng,
    propertyType,
    location,
    user,
    amenities,
}: ListingInfoProps) => {
    const descriptionHtml = { __html: description };

    const descriptionHtmlShort = {
        __html: description.substring(0, 300) + "...",
    };

    return (
        <div className="flex flex-col gap-6 col-span-4">
            <div className="flex flex-col gap-1">
                <div className="font-semibold text-xl">
                    {propertyType} in {location}
                </div>
                <div className="flex items-center gap-2 font-light text-muted">
                    <span>{guests} guests</span>
                    <span>·</span>
                    <span>{bedrooms} rooms</span>
                    <span>·</span>
                    <span>{beds} beds</span>
                    <span>·</span>
                    <span>{baths} bathrooms</span>
                </div>

                <div className="flex justify-start items-start text-sm">
                    <div className="flex items-center">
                        <RatingC rating={guestSatisfactionOverall} />

                        <span className="mx-1 text-2xl">·</span>

                        <span
                            className={cn(
                                "font-bold",
                                reviewsCount && "cursor-pointer underline"
                            )}
                        >
                            {reviewsCount ?? "No"} reviews
                        </span>
                    </div>
                </div>
            </div>

            <hr />

            <div className="flex items-center gap-2">
                <Avatar>
                    <AvatarImage
                        src={user?.image || "images/placeholder.jpg"}
                        alt="user"
                    />
                </Avatar>
                <div className="block">
                    <p className="font-normal text-muted text-xs">Shared by</p>
                    <p className="font-semibold text-sm">{user?.name}</p>
                </div>
            </div>

            <hr />

            {category && (
                <>
                    <ListingCategory
                        icon={getCategoryIcon(category.icon)}
                        label={category?.label}
                        description={category?.description}
                    />

                    <hr />
                </>
            )}

            {description && (
                <>
                    <div className="flex flex-col gap-4 text-sm">
                        <p
                            className="font-light text-secondary"
                            dangerouslySetInnerHTML={descriptionHtmlShort}
                        ></p>
                        <MoreDescription description={descriptionHtml} />
                    </div>

                    <hr />
                </>
            )}

            {
                <>
                    {amenities?.length && (
                        <ListingAmenities amenities={amenities} />
                    )}
                    <hr />
                </>
            }

            <div className="space-y-3">
                <p className="font-bold">Where you&apos;ll be</p>
                <p>{location}</p>
                <Map location={[listingLat, listingLng]} />
            </div>
        </div>
    );
};

export default ListingInfo;
