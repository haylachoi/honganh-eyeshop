import React, { Suspense } from "react";
import Trending from "./_components/trending";
import TopProducts from "./_components/top-products";
import NewArrival from "./_components/new-arrival";
import RecentBlog from "./_components/recent-blogs";
import { APP_NAME, BASE_URL } from "@/constants";
import { getFullLink } from "@/lib/utils";
import { CustomerTestimonials } from "./_components/customer-testimonials";
import Hero from "./_components/hero";

const sections = [
  Hero,
  Trending,
  TopProducts,
  NewArrival,
  CustomerTestimonials,
  RecentBlog,
];

// metadata in layout auto add base url
export const metadata = {
  title: "Hồng Anh – Kính thời trang, kính cận, kính râm chính hãng",
  description:
    "Hồng Anh – Cửa hàng kính mắt uy tín, chuyên cung cấp kính thời trang, kính cận, kính râm và gọng kính chất lượng cao. Miễn phí đo mắt, giao hàng toàn quốc.",
  openGraph: {
    title: "Hồng Anh – Kính thời trang, kính cận, kính râm chính hãng",
    description:
      "Cửa hàng kính mắt chất lượng tại Việt Nam. Hồng Anh chuyên kính thời trang, kính cận, kính râm với nhiều mẫu mã đa dạng.",
    siteName: APP_NAME,
    type: "website",
    locale: "vi_VN",
    images: [
      {
        url: `/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Hồng Anh - Kính mắt thời trang",
      },
    ],
    url: getFullLink(),
  },
  twitter: {
    card: "summary_large_image",
    title: "Hồng Anh – Kính thời trang, kính cận, kính râm chính hãng",
    description:
      "Chuyên kính mắt thời trang, đo mắt miễn phí, giao hàng toàn quốc.",
    images: [`/og-image.png`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  alternates: {
    canonical: BASE_URL,
  },
};

const HomePage = () => {
  return (
    <div className="space-y-12">
      {sections.map((Section, index) => (
        <Suspense key={index} fallback={<div>Loading...</div>}>
          <Section />
        </Suspense>
      ))}
    </div>
  );
};

export default HomePage;
