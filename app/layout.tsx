import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkLoaded, ClerkLoading, ClerkProvider } from "@clerk/nextjs";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Script from "next/script";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Toaster } from "@/components/ui/toaster";

import "./globals.css";
import { cn } from "@/lib/utils";
import Loader from "@/util/Loader";
import { AppProvider } from "@/util/AppContext";
import { PHProvider } from "@/util/PosthogProvider";
import PostHogPageView from "@/util/PostHogPageView";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: "%s | BrutalyHonest",
    default: "BrutalyHonest - Find Leisure",
  },
  description:
    "BrutalyHonest™ - Find Leisure with travel guides from your favourite travel creators. Plan, explore, and unwind with tailored journeys designed to help you find your own escape.",
  metadataBase: new URL(process.env.META_URL || "https://brutalyhonest.ai"),
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: new URL(process.env.META_URL || "https://brutalyhonest.ai"),
    title: "BrutalyHonest™",
    description:
      "Find Leisure with travel plans from your favourite travel creators",
    images: [
      {
        url: "https://brutalyhonest.ai/images/logo-og.png",
        width: 1200,
        height: 630,
        alt: "BrutalyHonest Logo - Fine Leisure",
      },
    ],
  },
};

type LayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: LayoutProps) {
  return (
    <ClerkProvider
      appearance={{
        signIn: {
          elements: {
            formButtonPrimary: "bg-primary hover:bg-primary",
          },
        },
      }}
    >
      <html lang="en" suppressHydrationWarning>
        <head>
          <Script src="/scripts/translation.js" strategy="beforeInteractive" />
          <Script
            src="//translate.google.com/translate_a/element.js?cb=TranslateInit"
            strategy="afterInteractive"
          />
          <script
          async
          data-noptimize="1"
          data-cfasync="false"
          data-wpfc-render="false"
          dangerouslySetInnerHTML={{
            __html: `(function () {
                var script = document.createElement("script");
                script.async = 1;
                script.src = 'https://tp-em.cc/Mzg0NjYw.js?t=384660';
                document.head.appendChild(script);
            })();`,
          }}
        />
        </head>
        <PHProvider>
          <body className={cn("h-full", inter.className)}>
            <ClerkLoading>
              <Loader />
            </ClerkLoading>

            <ClerkLoaded>
              <AppProvider>
                <NuqsAdapter>{children}</NuqsAdapter>
              </AppProvider>
              <Toaster />

              <Analytics />
              <SpeedInsights />
              <PostHogPageView />

            </ClerkLoaded>
          </body>
        </PHProvider>
      </html>
    </ClerkProvider>
  );
}
