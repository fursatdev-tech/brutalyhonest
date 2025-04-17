import React from "react";
import Script from "next/script";

const BookingsPage = () => {
  return (
    <main className="min-h-[calc(100vh-4.9rem)] flex flex-col items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-4xl">
        <Script
          type="text/javascript"
          src="https://widgets.bokun.io/assets/javascripts/apps/build/BokunWidgetsLoader.js?bookingChannelUUID=6bd7c93e-6039-4ed4-afe9-239689f058e6"
          strategy="lazyOnload"
        />
        <div
          className="bokunWidget w-full h-auto"
          data-src="https://widgets.bokun.io/online-sales/6bd7c93e-6039-4ed4-afe9-239689f058e6/experience/951153"
        ></div>
        <noscript>
          Please enable JavaScript in your browser to book this.
        </noscript>
      </div>
    </main>
  );
};

export default BookingsPage;
