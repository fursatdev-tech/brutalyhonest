"use client";
import { useContext } from "react";
import useSWR from "swr";
import axios from "axios";
import { Category } from "@prisma/client";

import { AirbnbDataContext } from "@/components/become-a-host/AirbnbContext";
import CategoryBox from "@/components/categories/CategoryBox";
import { cn } from "@/lib/utils";
import PropertyHeader from "@/components/become-a-host/PropertyHeader";
import { getCategories } from "@/util/routes";
import { getCategoryIcon } from "@/util/getCategoryIcon";

const PropertyType = () => {
  const { propertyDetails, setPropertyDetails } = useContext(AirbnbDataContext);

  const fetcher = (url: string) =>
    axios.get(url).then((res) => res.data.categories);

  const { data: categories = [] as Category[] } = useSWR(
    getCategories("all"),
    fetcher
  );

  const category = propertyDetails.category;

  const onCategorySelect = (category: string) => {
    setPropertyDetails((prev) => ({ ...prev, category }));
  };

  return (
    <div className="space-y-8">
      <PropertyHeader
        title="Which category defines the property type?"
        subtitle="Choose a category that best fits the property you're listing"
      />

      <div className="flex gap-6 max-w-md mx-auto flex-wrap text-center justify-center">
        {categories.map((item: Category) => {
          const current = item.id;
          const icon = getCategoryIcon(item.icon);

          return (
            <div
              key={item.label}
              className={cn(
                "border-2 rounded-xl w-28 transition",
                category === current && "border-secondary"
              )}
              onClick={() => onCategorySelect(current)}
            >
              <CategoryBox
                label={item.label}
                icon={icon}
                id={current}
                selected={category === current}
                className="border-b-0"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PropertyType;
