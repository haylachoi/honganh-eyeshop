import { MoveRightIcon } from "lucide-react";
import Link from "next/link";
import React, { Suspense } from "react";
import { getSettings } from "@/features/settings/settings.queries";
import Image from "next/image";
import { getBenefitInfos } from "@/features/others/other.services";

const Hero = async () => {
  return (
    <div className="bg-secondary max-md:px-[2px]">
      <div className="bg-[url('/home/hero-image.jpg')] bg-cover bg-center bg-no-repeat max-h-[700px] aspect-square mx-auto relative">
        <div className="lg:block uppercase text-4xl md:text-6xl text-primary font-bold absolute top-1/3 lg:top-2/3  lg:-right-1/5 xl:-right-1/3">
          Thoải mái
        </div>
        <div className="space-y-6 absolute top-5/11 lg:top-1/4 lg:-left-2/9">
          <div className="text-2xl md:text-4xl max-w-[320px] text-foreground/70">
            Đẹp hơn với kính của Hồng Anh
          </div>
          <Link
            href="/"
            className="p-4 py-2 inline-flex bg-primary text-primary-foreground text-xl md:text-2xl items-center gap-6"
          >
            Mua Ngay
            <MoveRightIcon className="size-8" />
          </Link>
        </div>
      </div>
      <div className="w-full">
        <Suspense fallback={<div></div>}>
          <BenefitProvider />
        </Suspense>
      </div>
    </div>
  );
};

export default Hero;

const BenefitProvider = async () => {
  const result = await getSettings();
  const benefits = result.success ? result.data.banners?.benefits : null;

  if (!benefits || !benefits.isActive) {
    const benefitInfos = await getBenefitInfos();
    return (
      <ul className="container py-6 grid grid-cols-[repeat(auto-fit,minmax(min(330px,100%),1fr))] gap-4">
        {benefitInfos.map((benefitInfo) => (
          <li
            key={benefitInfo.title}
            className="w-full lg:w-auto flex gap-4 items-center lg:justify-center flex-grow lg:not-last:border-r border-foreground/40"
          >
            <benefitInfo.Icon
              className="size-10 text-primary "
              strokeWidth={1}
            />

            <div>
              <p className="font-semibold">{benefitInfo.title}</p>
              <p className="text-foreground/70">{benefitInfo.subTitle}</p>
            </div>
          </li>
        ))}
      </ul>
    );
  }

  const benefitInfos = benefits.items;

  return (
    <ul className="container py-6 grid grid-cols-[repeat(auto-fit,minmax(min(330px,100%),1fr))] gap-4">
      {benefitInfos.map((benefitInfo) => (
        <li
          key={benefitInfo.title}
          className="w-full lg:w-auto flex gap-4 items-center lg:justify-center flex-grow lg:not-last:border-r border-foreground/40"
        >
          <Image
            className="invert-0 sepia saturate-100 hue-rotate-180 brightness-90 contrast-100"
            src={benefitInfo.icon}
            alt={benefitInfo.title}
            width={64}
            height={64}
          />
          <div>
            <p className="font-semibold">{benefitInfo.title}</p>
            <p className="text-foreground/70">{benefitInfo.description}</p>
          </div>
        </li>
      ))}
    </ul>
  );
};
