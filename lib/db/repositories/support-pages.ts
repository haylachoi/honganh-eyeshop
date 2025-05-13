import { SupportPageType } from "@/features/support-pages/support-pages.types";
import { connectToDatabase } from "..";
import SupportPages from "../model/support-pages.model";
import { supportPageTypeSchema } from "@/features/support-pages/support-pages.validator";
import { FilterQuery } from "mongoose";

const getSupportPages = async ({
  slug,
  includePrivate = false,
}: {
  slug: string;
  includePrivate?: boolean;
}) => {
  await connectToDatabase();
  const query: FilterQuery<SupportPageType> = {
    slug,
  };
  if (!includePrivate) {
    query.isPublished = true;
  }

  const supportPages = await SupportPages.findOne(query);
  return supportPages ? supportPageTypeSchema.parse(supportPages) : null;
};
const createOrUpdateSupportPages = async ({
  input,
}: {
  input: SupportPageType;
}) => {
  await connectToDatabase();
  await SupportPages.findOneAndUpdate(
    {
      slug: input.slug,
    },
    {
      $set: input,
    },
    {
      upsert: true,
    },
  );
};

export const supportPagesRepository = {
  getSupportPages,
  createOrUpdateSupportPages,
};
