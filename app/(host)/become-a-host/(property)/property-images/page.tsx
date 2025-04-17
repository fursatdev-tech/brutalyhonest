"use client";
import { useCallback, useContext } from "react";
import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import { BsTrash } from "react-icons/bs";

import { AirbnbDataContext } from "@/components/become-a-host/AirbnbContext";
import PropertyHeader from "@/components/become-a-host/PropertyHeader";
import AddImage from "@/components/become-a-host/AddImage";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import BImage from "@/util/Image";

declare global {
  var cloudinary: any;
}

const uploadPreset = "nnpdzena";

const PropertyImages = () => {
  const { propertyDetails, setPropertyDetails } = useContext(AirbnbDataContext);

  const { images } = propertyDetails;

  const handleUpload = useCallback(
    (result: any) => {
      let __images = images;

      __images.unshift(result.info.secure_url);

      setPropertyDetails((prev) => ({ ...prev, images: __images }));
    },
    [images, setPropertyDetails]
  );

  const removeImage = (value: string) => {
    const __images = images.filter((image: string) => image !== value);

    setPropertyDetails((prev) => ({ ...prev, images: __images }));
  };

  return (
    <div className="space-y-8">
      <PropertyHeader
        title="Show off the Space"
        subtitle="Upload images that capture the essence and appeal of the property"
      />

      <div className="max-w-xl mx-auto space-y-8">
        <CldUploadWidget
          onUpload={handleUpload}
          uploadPreset={uploadPreset}
          options={{
            maxFiles: 10,
          }}
        >
          {({ open, isLoading }) => {
            if (isLoading) return <p>Initialzing upload section</p>;

            if (images.length <= 0) return <AddImage open={open} />;

            return (
              <>
                <AddImage open={open} />

                <ScrollArea className="h-[55vh] w-full rounded-xl border p-3">
                  <div className="flex flex-wrap gap-4 mb-40 md:mb-0">
                    {images.map((image) => (
                      <div
                        className="relative h-[300px] w-[calc(100%-16px)] md:w-[calc(50%-8px)]"
                        key={`Image-${image}`}
                      >
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeImage(image)}
                          className="absolute right-2 top-2 z-10 cursor-pointer text-destructive rounded-full"
                        >
                          <BsTrash size={20} />
                        </Button>

                        <BImage
                          className="rounded-xl"
                          src={image}
                          alt="Property Images"
                        />
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </>
            );
          }}
        </CldUploadWidget>
      </div>
    </div>
  );
};

export default PropertyImages;
