import { Metadata } from "next";

import UserFavourites from "@/components/profile/UserFavourites";

export const metadata: Metadata = {
  title: "My Favourites",
  description: "Favourite listings",
};

const MyFavourites = () => {
  return <UserFavourites />;
};

export default MyFavourites;
