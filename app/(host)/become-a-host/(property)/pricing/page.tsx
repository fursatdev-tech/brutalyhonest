"use client";
import { ChangeEvent, useContext } from "react";
import { BiRupee } from "react-icons/bi";

import { AirbnbDataContext } from "@/components/become-a-host/AirbnbContext";
import PropertyHeader from "@/components/become-a-host/PropertyHeader";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

const Pricing = () => {
  const { propertyDetails, setPropertyDetails } = useContext(AirbnbDataContext);

  const handleInputChange = async (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = event.target;

    const [parentKey, childKey] = id.split(".");

    setPropertyDetails((prev) => ({
      ...prev,
      [parentKey]: {
        [childKey]: value,
      },
    }));
  };

  const brutalyhonestServiceFeePer =
    parseInt(process.env.NEXT_PUBLIC_brutalyhonest_SERVICE_FEE_PER || "5") / 100;

  const originalPriceInt = parseInt(propertyDetails?.originalPrice?.inr || "0");
  const b2bPriceInt = parseInt(propertyDetails?.b2bPrice?.inr || "0");
  const brutalyhonestFee = originalPriceInt * brutalyhonestServiceFeePer;

  const earnings = Math.max(
    propertyDetails.postedByOwner
      ? Math.max(
          originalPriceInt - b2bPriceInt > brutalyhonestFee
            ? b2bPriceInt
            : b2bPriceInt - brutalyhonestFee,
          b2bPriceInt - brutalyhonestFee
        )
      : originalPriceInt - b2bPriceInt - brutalyhonestFee,
    0
  );

  const isB2bPriceHigher = originalPriceInt < b2bPriceInt;

  const ispgB2bPriceHigher =
    parseInt(propertyDetails?.pgOriginalPrice?.inr || "0") <
    parseInt(propertyDetails?.pgB2bPrice?.inr || "0");

  return (
    <div className="space-y-8">
      <PropertyHeader
        title="Price the Stay"
        subtitle="Set a nightly rate for the property."
      />

      <div className="max-w-md mx-auto space-y-8">
        <div className="flex justify-between items-center gap-4">
          <div>
            <p className="font-semibold">Nightly Price</p>
            <p className="text-muted-foreground text-sm">
              Price guests will see and pay
            </p>
          </div>

          <div className="relative w-40">
            <BiRupee size={20} className="text-muted absolute top-2.5 left-2" />
            <Input
              type="number"
              value={propertyDetails.originalPrice?.inr || ""}
              id="originalPrice.inr"
              placeholder="Enter per night price"
              onChange={handleInputChange}
              className="pl-8"
            />
          </div>
        </div>

        <div className="flex justify-between items-center gap-4">
          <div>
            <p className="font-semibold">Your B2B Price</p>
            <p className="text-muted-foreground text-sm">
              Nightly price from the property
            </p>
          </div>

          <div className="relative w-40">
            <BiRupee size={20} className="text-muted absolute top-2.5 left-2" />
            <Input
              type="number"
              value={propertyDetails.b2bPrice?.inr || ""}
              id="b2bPrice.inr"
              placeholder="Enter B2B price"
              onChange={handleInputChange}
              className="pl-8"
            />
          </div>
        </div>

        <div className="space-y-3">
          <div className="items-top flex space-x-2">
            <Checkbox
              id="byOwner"
              checked={propertyDetails.postedByOwner}
              onCheckedChange={(val) =>
                setPropertyDetails((prev) => ({
                  ...prev,
                  postedByOwner: !!val,
                }))
              }
            />
            <div className="grid gap-1.5 leading-none">
              <label
                htmlFor="byOwner"
                className="text-sm font-medium leading-none cursor-pointer"
              >
                I am owner of the property
              </label>
            </div>
          </div>

          <div className="rounded-lg bg-gray-100 px-5 py-3 text-sm">
            <p>
              Your earning will be{" "}
              <HoverCard openDelay={100}>
                <HoverCardTrigger>
                  <span className="underline text-primary cursor-pointer">
                    ₹{earnings.toLocaleString()}
                  </span>
                </HoverCardTrigger>
                <HoverCardContent className="text-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <p>Nightly price</p>
                    <p className="font-bold">
                      ₹
                      {parseInt(
                        propertyDetails.originalPrice?.inr || "0"
                      ).toLocaleString()}
                    </p>
                  </div>

                  {!propertyDetails.postedByOwner && (
                    <div className="flex items-center justify-between">
                      <p>B2B price</p>
                      <p className="font-bold">
                        - ₹
                        {parseInt(
                          propertyDetails.b2bPrice?.inr || "0"
                        ).toLocaleString()}
                      </p>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <p>BrutalyHonest service fee ({brutalyhonestServiceFeePer * 100}%)</p>
                    <p className="font-bold">
                      - ₹
                      {(
                        parseInt(propertyDetails.originalPrice?.inr || "0") *
                        0.05
                      ).toLocaleString()}
                    </p>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <p>Your earning</p>
                    <p className="font-bold">₹{earnings.toLocaleString()}</p>
                  </div>
                </HoverCardContent>
              </HoverCard>{" "}
              per booking.
            </p>
          </div>

          {isB2bPriceHigher && (
            <p className="rounded-lg bg-primary-lightest px-5 py-3 text-sm text-primary font-bold">
              B2B price should be less than Nightly price
            </p>
          )}
        </div>

        <Separator />

        <div className="items-top flex space-x-2">
          <Checkbox
            id="terms1"
            checked={propertyDetails.perGuestPricing}
            onCheckedChange={(val) =>
              setPropertyDetails((prev) => ({
                ...prev,
                perGuestPricing: !!val,
              }))
            }
          />
          <div className="grid gap-1.5 leading-none">
            <label
              htmlFor="terms1"
              className="text-sm font-medium leading-none cursor-pointer"
            >
              Allow extra guests
            </label>
            <p className="text-sm text-muted-foreground">
              You guests will pay price based on number of guests.
            </p>
          </div>
        </div>

        {propertyDetails.perGuestPricing && (
          <>
            <div className="flex justify-between items-center gap-4">
              <div>
                <p className="font-semibold">
                  Nightly Price{" "}
                  {propertyDetails.perGuestPricing && (
                    <span className="text-sm text-muted-foreground">
                      / guest
                    </span>
                  )}
                </p>
                <p className="text-muted-foreground text-sm">
                  Price guests will see and pay
                </p>
              </div>

              <div className="relative w-40">
                <BiRupee
                  size={20}
                  className="text-muted absolute top-2.5 left-2"
                />
                <Input
                  type="number"
                  value={propertyDetails.pgOriginalPrice?.inr || ""}
                  id="pgOriginalPrice.inr"
                  placeholder="Enter price"
                  onChange={handleInputChange}
                  className="pl-8"
                />
              </div>
            </div>

            <div className="flex justify-between items-center gap-4">
              <div>
                <p className="font-semibold">
                  Your B2B Price{" "}
                  {propertyDetails.perGuestPricing && (
                    <span className="text-sm text-muted-foreground">
                      / guest
                    </span>
                  )}
                </p>
                <p className="text-muted-foreground text-sm">
                  Nightly price from the property
                </p>
              </div>

              <div className="relative w-40">
                <BiRupee
                  size={20}
                  className="text-muted absolute top-2.5 left-2"
                />
                <Input
                  type="number"
                  value={propertyDetails.pgB2bPrice?.inr || ""}
                  id="pgB2bPrice.inr"
                  placeholder="Enter B2B price"
                  onChange={handleInputChange}
                  className="pl-8"
                />
              </div>
            </div>

            {ispgB2bPriceHigher && (
              <p className="rounded-lg bg-red-100 px-5 py-3 text-sm text-primary font-bold">
                Per guest B2B price should be less than per guest Nightly price
              </p>
            )}
          </>
        )}

        <Separator />

        <div className="items-top flex space-x-2">
          <Checkbox
            id="terms1"
            checked={propertyDetails.allowFreeStay}
            onCheckedChange={(val) =>
              setPropertyDetails((prev) => ({
                ...prev,
                allowFreeStay: !!val,
              }))
            }
          />
          <div className="grid gap-1.5 leading-none">
            <label
              htmlFor="terms1"
              className="text-sm font-medium leading-none cursor-pointer"
            >
              Allow free stay for influencers
            </label>
            <p className="text-sm text-muted-foreground">
              Influencers can stay free of cost and create content. You will see
              their social network(s) before accepting booking.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
