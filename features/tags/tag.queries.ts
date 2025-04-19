import "server-only";

import tagsRepository from "@/lib/db/repositories/tags";
import { safeQuery } from "@/lib/query";
import { z } from "zod";
import next_cache from "@/cache";

export const getTagById = safeQuery
  .schema(z.string().min(3))
  .query(async ({ parsedInput: id }) => {
    const tag = await tagsRepository.getTagById(id);
    return tag;
  });

export const getAllTags = safeQuery.query(async () => {
  const tags = await next_cache.tags.getAll();
  return tags;
});
