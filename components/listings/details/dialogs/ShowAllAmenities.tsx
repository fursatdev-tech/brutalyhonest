import { Amenity } from "@prisma/client";
import { IconType } from "react-icons";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { getAmenityIcon } from "@/components/listings/details/getAmenityIcon";
import { cn } from "@/lib/utils";

interface Props {
  amenities: Amenity[];
  length: number;
  variant?: "outline" | "link";
}

const ShowAllAmenities = ({
  amenities,
  length,
  variant = "outline",
}: Props) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant={variant}
          className={cn(variant === "link" && "p-0 text-xs")}
        >
          Show all {length} amenities{" "}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>
            <p className="text-xl mb-5 font-bold text-left">
              What this place offers
            </p>
          </DialogTitle>
          <DialogDescription className="space-y-8 text-secondary">
            {amenities.map((amenity, idx) => (
              <div key={idx} className="space-y-6">
                <p className="font-semibold text-lg text-left">
                  {amenity.title}
                </p>

                <div className="space-y-4">
                  {amenity.amenities.map((amenity, idy) => {
                    const Icon: IconType = getAmenityIcon(amenity.title);

                    return (
                      <div
                        className="flex gap-2 items-center border-b pb-4"
                        key={idx}
                      >
                        <Icon size={28} className="text-secondary-foreground" />
                        <p
                          className={cn(
                            "text-sm",
                            !amenity.available && "line-through"
                          )}
                        >
                          {amenity.title}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default ShowAllAmenities;
