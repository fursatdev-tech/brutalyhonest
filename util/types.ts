import {
  Host,
  Listing,
  Reservation,
  User,
  Review,
  UserRole,
  MessageActions,
  ActionCategories,
  Category,
  ToursSurveys,
  SurveyDestination,
  SurveyOtherDestination,
  SurveyMonth,
  SurveyDuration,
  SurveyActivity,
  TourReservation,
  TourPackage,
} from "@prisma/client";

export type SafeListing = Omit<Listing, "createdAt"> & {
  createdAt: string;
  host: Pick<Host, "name">;
  category: Pick<Category, "label">;
};

export type SafeReservation = Omit<
  Reservation,
  "createdAt" | "startDate" | "endDate" | "listing"
> & {
  createdAt: string;
  startDate: string;
  endDate: string;
  listing: SafeListing;
  review: Review;
};

export type SafePackage = Pick<
  TourPackage,
  | "name"
  | "accommodationImages"
  | "duration"
  | "subtitle"
  | "id"
  | "natureOfTravel"
  | "citiesTraveling"
  | "costPrice"
  | "sellingPrice"
  | "isLive"
> & {};

export type SafeTourReservation = Omit<
  TourReservation,
  "createdAt" | "startDate" | "endDate" | "listing"
> & {
  createdAt: string;
  startDate: string;
  endDate: string;
  package: SafePackage;
};

export type SafeUser = Omit<
  User,
  "createdAt" | "updatedAt" | "emailVerified"
> & {
  createdAt: string;
  updatedAt: string;
  emailVerified: string | null;
};

export type SafeProperty = Pick<
  Listing,
  | "id"
  | "imageUrl"
  | "title"
  | "propertyType"
  | "createdAt"
  | "location"
  | "country"
  | "guestSatisfactionOverall"
  | "status"
> & {
  host: Pick<Host, "name" | "profilePhotoUrl">;
};

export type Menu = {
  link: string;
  name: string;
};

export interface SafeMessage {
  id: string;
  listing: {
    title: string;
    host: {
      name: string;
      profilePhotoUrl: string | null;
    };
  };
  reservationId: string;
  reservation: {
    startDate: Date;
    endDate: Date;
    totalPrice: number;
    user: {
      image: string | null;
      name: string | null;
    };
    adults?: number;
    children?: number;
    infants?: number;
    pets?: number;
  };
}

export interface SafeThread {
  id: string;
  text: string | null;
  role: UserRole;
  actions: MessageActions[];
  createdAt: Date;
  updatedAt: Date;
  actionCategory: ActionCategories;
  isUnread: boolean;
  guest: {
    name: string | null;
    image: string | null;
  };
  host: {
    name: string;
    profilePhotoUrl: string | null;
  };
}

export enum CacheTagsType {
  GET_THREADS = "threads",
}

export interface SafeToursSurveys extends ToursSurveys {
  destinations: string[] | SurveyDestination[];
  otherDestinations: string[] | SurveyOtherDestination[];
  months: string[] | SurveyMonth[];
  tripDuration: string[] | SurveyDuration[];
  tripActivities: string[] | SurveyActivity[];
}
