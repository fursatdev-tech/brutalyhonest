import { ToursSurveys } from "@prisma/client";
import { Dispatch } from "react";

import { SafeToursSurveys } from "@/util/types";

export interface StepProps {
  data: SafeToursSurveys;
  setData: Dispatch<React.SetStateAction<SafeToursSurveys>>;
}

export const fetcher = (url: string) => fetch(url).then((r) => r.json());
