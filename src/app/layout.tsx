import "@/styles/globals.css";
import Script from "next/script";
import type { Metadata } from "next";
import localFont from "next/font/local";
import { incognito, gitlabmono } from "@/assets/font/font";
import Navbar from "@/components/global/Navbar";
import Footer from "@/components/global/Footer";
import Loader from "@/components/global/Loader";
import ExitIntentPopup from "@/components/global/ExitIntentPopup";
import { Providers } from "./providers";
import { umamiSiteId } from "@/sanity/lib/env.api";
const inter = localFont({
  src: "../assets/font/inter.woff2",
  variable: "--inter",
  display: "swap",
});

const options = {
  title: "Deekshith Goud | Software Developer",
  description:
    "Deekshith Goud is a Software Developer and Technical Writer who is passionate about building solutions and contributing to open source communities",
  url: "https://deekshith-goud.vercel.app",
  ogImage:
    "/images/og-image.png",
};

export const metadata: Metadata = {
  title: options.title,
  metadataBase: new URL(options.url),
  description: options.description,
  openGraph: {
    title: options.title,
    url: options.url,
    siteName: "deekshith-goud.vercel.app",
    locale: "en-US",
    type: "website",
    description: options.description,
    images: options.ogImage,
  },
  alternates: {
    canonical: options.url,
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-icon.png",
  },
  other: {
    "google-site-verification": "IzcWMgn5Qjf-LCtA337KTGjivsf9bmod_1pZ-jxYQh8",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${incognito.variable} ${inter.className} ${gitlabmono.variable} dark:bg-zinc-900 bg-[#FCFBF8] dark:text-white text-zinc-700 overflow-x-hidden`}
      >
        <Providers>
          <div className="fixed inset-0 z-[-1] pointer-events-none bg-[url('/images/noise.png')] dark:bg-[url('/images/noise-dark.png')] opacity-100 dark:opacity-[0.10]" />
          <Loader />
          <Navbar />
          <ExitIntentPopup />
          {children}
          <Footer />
        </Providers>
        <Script
          strategy="lazyOnload"
          src="https://cloud.umami.is/script.js"
          data-website-id={umamiSiteId}
        />
      </body>
    </html>
  );
}
