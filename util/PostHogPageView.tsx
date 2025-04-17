"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { usePostHog } from "posthog-js/react";
import { setCurrencyCookie } from "@/lib/actions/setCurrencyCookie";

export default function PostHogPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const posthog = usePostHog();

  useEffect(() => {
    if (pathname && posthog) {
      let url = window.origin + pathname;

      if (searchParams.toString()) url = url + `?${searchParams.toString()}`;

      posthog.capture("$pageview", {
        $current_url: url,
      });

      setCookie();
    }
  }, [pathname, searchParams, posthog]);

  const setCookie = async () => {
    try {
      const response = await fetch("https://geolocation-db.com/json/");

      const { country_name } = await response.json();

      const currency = country_name === "India" ? "INR" : "USD";

      setCurrencyCookie(currency, true);
    } catch (error) {
      setCurrencyCookie("INR", true);
    }
  };

  return null;
}
