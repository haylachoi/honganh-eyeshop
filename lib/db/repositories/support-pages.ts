import { SupportPageType } from "@/features/support-pages/support-pages.types";
import { connectToDatabase } from "..";
import SupportPages from "../model/support-pages.model";
import { supportPageTypeSchema } from "@/features/support-pages/support-pages.validator";

const getSupportPages = async ({ slug }: { slug: string }) => {
  await connectToDatabase();
  const supportPages = await SupportPages.findOne({ slug });
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
