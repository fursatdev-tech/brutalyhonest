"use client";
import { parseAsBoolean, useQueryState } from "nuqs";
import BImage from "@/util/Image";
import { cn } from "@/lib/utils";
import SeeAllTrigger from "@/components/listings/details/SeeAllTrigger";
import { PackageImages } from "@prisma/client";
import { useState } from "react";
import styles from "./styles.module.css";
import Heading from "../listings/details/Heading";

interface PackageHeadProps {
  name: string;
  accommodationImages: PackageImages[];
  id: string;
  subtitle: string;
  duration: string;
  videoUrl: string;
}

const PackageHead = ({
  name,
  id,
  accommodationImages,
  subtitle,
  duration,
  videoUrl,
}: PackageHeadProps) => {
  const [show, setShow] = useQueryState(
    "gallery",
    parseAsBoolean.withDefault(false)
  );

  const images = accommodationImages.flatMap((group) =>
    group.urls.map((url) => {
      return url;
    })
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

  const title = `${name} - ${duration}`;

  return (
    <>
      <div className="flex justify-between items-center px-4">
        <Heading title={title} subtitle={subtitle ?? ""} />

        {/* <div className="flex">
            <ShareDialog
              title={title}
              url={window.location.href}
              image={imageUrl}
            />
            <FavouriteListingBtn listingId={id} favouriteIds={favouriteIds} />
          </div> */}
      </div>

        {/* {videoUrl?.length > 0 && (
          <div className="sticky top-0 left-0 w-full md:hidden mx-auto h-[30vh] px-24 p-2 backdrop-blur-md bg-white/50 aspect-video z-20">
            <iframe
              className="relative w-full h-full"
              src={`${videoUrl}?autoplay=1&mute=1`}
              allow="autoplay; fullscreen"
              allowFullScreen
            />
          </div>
        )} */}
      <div className="relative px-4">
        <SeeAllTrigger
          images={images}
          title={title}
          setShow={setShow}
          show={show}
        />

        <div className={`${getClassNameForImages()} h-[60vh]`}>
          {videoUrl?.length > 0 ? (
            <div className="relative w-full h-full">
              <iframe
                className="relative w-full h-full rounded-lg"
                src={`${videoUrl}?autoplay=1&mute=1`}
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
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
          )}

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
                    index === 2 && "rounded-bl-xl md:rounded-bl-none",
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

export default PackageHead;
