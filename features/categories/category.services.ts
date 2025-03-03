import { CategoryPreview } from "@/features/categories/category.types";

export const getCategoryPreviews = async () => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return categoryPreviewsSample;
};

const categoryPreviewsSample: CategoryPreview[] = [
  {
    id: "1",
    name: "Kính mắt",
    description: "Nội dung của kính mắt",
    slug: "kinh-mat",
  },
  {
    id: "2",
    name: "Kính thuốc",
    description: "Nội dung của kính thuốc",
    slug: "kinh-thuoc",
  },
  {
    id: "3",
    name: "Khám phá",
    description: "Nội dung của khám phá",
    slug: "kham-pha",
  },
];
