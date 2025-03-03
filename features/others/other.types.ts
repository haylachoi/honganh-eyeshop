import { IconType } from "react-icons";

export type BenefitInfo = {
  title: string;
  subTitle: string;
  description: string;
  Icon: IconType;
};

export type PolicyPreview = {
  title: string;
  description?: string;
  slug: string;
};
