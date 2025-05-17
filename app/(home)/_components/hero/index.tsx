import { MoveRightIcon } from "lucide-react";
import Link from "next/link";
import React, { Suspense } from "react";
import { getSettings } from "@/features/settings/settings.queries";
import Image from "next/image";
import { getBenefitInfos } from "@/features/others/other.services";

const Hero = async () => {
  return (
    <div className="bg-secondary max-md:px-[2px]">
      <Suspense fallback={<div></div>}>
        <HeroProvider />
      </Suspense>
      <div className="w-full">
        <Suspense fallback={<div></div>}>
          <BenefitProvider />
        </Suspense>
      </div>
    </div>
  );
};

export default Hero;

const getPositionStyle = (position: {
  anchor: string;
  xValue: string;
  yValue: string;
}): React.CSSProperties => {
  const { anchor, xValue, yValue } = position;

  const anchorMap: Record<string, React.CSSProperties> = {
    "top-left": {
      top: yValue,
      left: xValue,
    },
    "top-right": {
      top: yValue,
      right: xValue,
    },

    "bottom-left": {
      bottom: yValue,
      left: xValue,
    },
    "bottom-right": {
      bottom: yValue,
      right: xValue,
    },
  };

  return {
    position: "absolute",
    ...(anchorMap[anchor] || {}),
  };
};

const HeroProvider = async () => {
  const result = await getSettings();
  const homeHero = result.success ? result.data.banners?.homeHero : null;
  if (!homeHero || !homeHero.isActive) {
    return <HeroDefault />;
  }

  const renderContent = (data: typeof homeHero.desktop) => (
    <>
      {data.mainTitle.isActive && (
        <h1
          style={{
            ...getPositionStyle(data.mainTitle.position),
            fontSize: data.mainTitle.size,
            color: data.mainTitle.color,
          }}
          className="text-white text-4xl font-bold"
        >
          {data.mainTitle.value}
        </h1>
      )}
      {data.subTitle.isActive && (
        <p
          style={getPositionStyle(data.subTitle.position)}
          className="text-white text-lg"
        >
          {data.subTitle.value}
        </p>
      )}
      {data.callToAction.isActive ? (
        <Link
          href={data.callToAction.url || "#"}
          style={{
            ...getPositionStyle(data.callToAction.position),
            fontSize: data.callToAction.size,
            backgroundColor: data.callToAction.bgColor,
            color: data.callToAction.color,
          }}
          className="text-white bg-primary px-4 py-2 flex gap-4 items-center"
        >
          {data.callToAction.value}
          <MoveRightIcon className="size-8" />
        </Link>
      ) : (
        <Link
          href={data.callToAction.url || "#"}
          className="absolute bg-transparent inset-0 cursor-pointer"
        ></Link>
      )}
    </>
  );

  return (
    <div
      style={
        {
          "--home-hero-image__desktop": `url(${homeHero.desktop.image.url})`,
          "--home-hero-image__tablet": `url(${homeHero.tablet.image.url})`,
          "--home-hero-image__mobile": `url(${homeHero.mobile.image.url})`,
          width: homeHero.desktop.image.width,
          aspectRatio: homeHero.desktop.image.ratio,
        } as React.CSSProperties
      }
      className="home_hero bg-cover bg-center bg-no-repeat mx-auto relative"
    >
      {/* Desktop */}
      <div className="hidden lg:block">{renderContent(homeHero.desktop)}</div>

      {/* Tablet */}
      <div className="hidden md:block lg:hidden">
        {renderContent(homeHero.tablet)}
      </div>

      {/* Mobile */}
      <div className="block md:hidden">{renderContent(homeHero.mobile)}</div>
    </div>
  );
};
const HeroDefault = async () => {
  return (
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
  );
};
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
