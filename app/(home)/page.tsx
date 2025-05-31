import React, { Suspense } from "react";
import { CustomerTestimonials } from "./_components/customer-testimonials";
import Hero from "./_components/hero";
import { APP_NAME, BASE_URL } from "@/constants";
import { getFullLink } from "@/lib/utils";
import { LoadingIndicator } from "@/components/shared/loading-indicator";
import { getSettings } from "@/features/settings/settings.services";
import dynamic from "next/dynamic";

const Trending = dynamic(() => import("./_components/trending"));
const TopProducts = dynamic(() => import("./_components/top-products"));
const NewArrival = dynamic(() => import("./_components/new-arrival"));
const RecentBlog = dynamic(() => import("./_components/recent-blogs"));

const sections = [
  Trending,
  TopProducts,
  NewArrival,
  CustomerTestimonials,
  RecentBlog,
];

export const generateMetadata = async () => {
  const settings = await getSettings();
  const appName = settings?.site?.name || APP_NAME;

  return {
    title: "Hồng Anh – Kính thời trang, kính cận, kính râm chính hãng",
    description:
      "Hồng Anh – Cửa hàng kính mắt uy tín, chuyên cung cấp kính thời trang, kính cận, kính râm và gọng kính chất lượng cao. Miễn phí đo mắt, giao hàng toàn quốc.",
    openGraph: {
      title: "Hồng Anh – Kính thời trang, kính cận, kính râm chính hãng",
      description:
        "Cửa hàng kính mắt chất lượng tại Việt Nam. Hồng Anh chuyên kính thời trang, kính cận, kính râm với nhiều mẫu mã đa dạng.",
      siteName: appName,
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
};

// metadata in layout auto add base url

const HomePage = () => {
  return (
    <div className="space-y-12">
      <Hero />
      {sections.map((Section, index) => (
        <Suspense key={index} fallback={<LoadingIndicator />}>
          <Section />
        </Suspense>
      ))}
    </div>
  );
};

export default HomePage;
