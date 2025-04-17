import { Metadata } from "next";

import MyTripsComponent from "@/components/profile/MyTrips";

export const metadata: Metadata = {
  title: "Trips",
  description: "My booked trips",
};

const MyTrips = () => {
  return <MyTripsComponent />;
};

export default MyTrips;
