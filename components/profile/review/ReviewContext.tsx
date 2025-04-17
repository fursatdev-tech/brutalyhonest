"use client";
import { Dispatch, createContext } from "react";

export interface ReviewData {
  publicReview: string;
  privateNote: string;
  reservationId: string;
}

interface ReviewDataProps {
  data: ReviewData;
  setData: Dispatch<React.SetStateAction<ReviewData>>;
}

export const ReviewContext = createContext<ReviewDataProps>(
  {} as ReviewDataProps
);

interface ReviewProviderProps extends ReviewDataProps {
  children: React.ReactNode;
}

export const ReviewProvider = ({ children, ...props }: ReviewProviderProps) => {
  return (
    <ReviewContext.Provider value={{ ...props }}>
      {children}
    </ReviewContext.Provider>
  );
};
