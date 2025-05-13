import { supportPagesRepository } from "@/lib/db/repositories/support-pages";
import { NotFoundError } from "@/lib/error";
import { safeQuery } from "@/lib/query";
import { z } from "zod";

export const getSupportPages = safeQuery
  .schema(
    z.object({
      slug: z.string(),
    }),
  )
  .query(async ({ parsedInput }) => {
    const supportPages =
      await supportPagesRepository.getSupportPages(parsedInput);
    if (!supportPages) {
      throw new NotFoundError({});
    }
    return supportPages;
  });
