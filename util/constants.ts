export const PAGES = {
  HOME: "/",

  USER_PROPERTIES: "/[username]/properties",

  PRIVACY: "/privacy",
  TERMS: "/terms",
  SITEMAP: "/sitemap",
  COMPANY_DETAILS: "/company-details",
};

export const SOCIAL_LINKS = {
  FACEBOOK: "https://www.facebook.com/brutalyhonestai",
  TWITTER: "https://www.twitter.com/brutalyhonestai",
  INSTAGRAM: "https://www.instagram.com/brutalyhonest.fun",
};

export const BASE_URL = process.env.META_URL;

export const MODE_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : process.env.META_URL;

export const calUrl = "https://cal.com/brutalyhonest.fun/help";

export const productVideoUrl =
  "https://www.loom.com/embed/256ba7f8cf2c40a3bb72203c262ad10d?sid=2ac3c48a-c4be-4344-831d-bc8e9d3f32ac";

export const AIRBNB_URLS = [
  "https://www.airbnb.co.in/rooms/",
  "https://www.airbnb.co.uk/rooms/",
  "https://www.airbnb.com.py/rooms/",
  "https://www.airbnb.com.tr/rooms/",
  "https://www.airbnb.mx/rooms/",
  "https://www.airbnb.co.in/luxury/listing/",
];

export const BOOKING_URLS = ["https://www.booking.com/hotel/"];

export const GRAPH_TICK = { fill: "#737373", fontSize: 12 };
