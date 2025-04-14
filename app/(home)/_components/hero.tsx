import { getBenefitInfos } from "@/features/others/other.services";
import { MoveRightIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

const Hero = async () => {
  const benefitInfos = await getBenefitInfos();
  return (
    <div className="bg-secondary max-md:px-[2px]">
      <div className="bg-[url('/home/hero-image.jpg')] bg-cover bg-center bg-no-repeat max-h-[700px] aspect-square mx-auto relative">
        <div className="lg:block uppercase text-6xl text-primary font-bold absolute top-1/3 lg:top-2/3  lg:-right-1/5 xl:-right-1/3">
          Thoải mái
        </div>
        <div className="space-y-6 absolute top-5/11 lg:top-1/4 lg:-left-2/9">
          <div className="text-4xl max-w-[320px] text-foreground/70">
            Đẹp hơn với kính của Hồng Anh
          </div>
          <Link
            href="/"
            className="p-4 py-2 inline-flex bg-primary text-primary-foreground text-2xl items-center gap-6"
          >
            Mua Ngay
            <MoveRightIcon className="size-8" />
          </Link>
        </div>
      </div>
      <div className="w-full">
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
      </div>
    </div>
  );
};

export default Hero;
