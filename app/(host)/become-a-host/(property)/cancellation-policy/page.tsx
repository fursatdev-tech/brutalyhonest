"use client";
import { useContext } from "react";
import useSWR from "swr";
import axios from "axios";
import { CancellationPolicy } from "@prisma/client";
import { MdOpenInNew } from "react-icons/md";

import { AirbnbDataContext } from "@/components/become-a-host/AirbnbContext";
import PropertyHeader from "@/components/become-a-host/PropertyHeader";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { getCancellationPolicies } from "@/util/routes";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";

const Pricing = () => {
  const { propertyDetails, setPropertyDetails } = useContext(AirbnbDataContext);

  const fetcher = (url: string) => axios.get(url).then((res) => res.data.data);

  const { data = [], isLoading } = useSWR(getCancellationPolicies, fetcher);

  const policies: CancellationPolicy[] = data;

  const onPolicySelect = (value: string) => {
    setPropertyDetails((prev) => ({ ...prev, cancellationPolicyId: value }));
  };

  return (
    <div className="space-y-8">
      <PropertyHeader
        title="Cancellation Policy"
        subtitle="Choose a cancellation policy for your property."
      />

      <div className="max-w-md mx-auto space-y-8">
        {isLoading && (
          <>
            {Array.from({ length: 6 }).map((_, idx) => (
              <Skeleton className="h-6 w-full" key={idx} />
            ))}
          </>
        )}

        <RadioGroup
          className="gap-6"
          onValueChange={onPolicySelect}
          defaultValue={propertyDetails.cancellationPolicyId}
        >
          {policies.map((policy, idx) => (
            <div className="flex items-center gap-4 justify-between" key={idx}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value={policy.id} id={policy.id} />
                <Label htmlFor={policy.id}>{policy.title}</Label>
              </div>

              <AlertDialog>
                <AlertDialogTrigger>
                  <MdOpenInNew />
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>{policy.title}</AlertDialogTitle>
                    <AlertDialogDescription>
                      <ul className="space-y-3">
                        {policy.subtitlesHost.map((list, idx) => (
                          <li
                            className="text-sm text-muted-foreground"
                            key={idx}
                          >
                            &#x2022; {list}
                          </li>
                        ))}
                      </ul>
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Close</AlertDialogCancel>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          ))}
        </RadioGroup>
      </div>
    </div>
  );
};

export default Pricing;
