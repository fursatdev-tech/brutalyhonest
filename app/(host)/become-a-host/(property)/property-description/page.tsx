"use client";
import { ChangeEvent, useContext } from "react";

import { AirbnbDataContext } from "@/components/become-a-host/AirbnbContext";
import PropertyHeader from "@/components/become-a-host/PropertyHeader";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const PropertyDescription = () => {
  const { propertyDetails, setPropertyDetails } = useContext(AirbnbDataContext);

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = event.target;
    setPropertyDetails((prev) => ({ ...prev, [id]: value }));
  };

  return (
    <div className="space-y-8">
      <PropertyHeader
        title="Write a Captivating Description"
        subtitle="Create an engaging title and description to showcase the property's unique qualities"
      />

      <div className="max-w-md mx-auto space-y-8">
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="email">Title</Label>
          <Input
            value={propertyDetails.title}
            id="title"
            placeholder="Enter title here"
            onChange={handleInputChange}
          />
        </div>

        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="description">Description</Label>
          <Textarea
            value={propertyDetails.description}
            placeholder="Type your description here."
            id="description"
            rows={10}
            onChange={handleInputChange}
          />
        </div>
      </div>
    </div>
  );
};

export default PropertyDescription;
