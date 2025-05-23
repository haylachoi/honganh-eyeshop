import next_cache from "@/cache";
import { NotFoundError } from "@/lib/error";
import { safeQuery } from "@/lib/query";
import { z } from "zod";

export const getSupportPages = safeQuery
  .schema(
    z.object({
      slug: z.string(),
      includesPrivate: z.boolean().optional().default(false),
    }),
  )
  .query(async ({ parsedInput }) => {
    const supportPages = await next_cache.supportPages.getSupportPages({
      ...parsedInput,
    });
    if (!supportPages) {
      throw new NotFoundError({});
    }
    return supportPages;
  });
