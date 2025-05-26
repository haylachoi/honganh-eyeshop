"use server";

import { authActionClient } from "@/lib/actions";
import filtersRepository from "@/lib/db/repositories/filters";
import { revalidateTag } from "next/cache";
import { CACHE_CONFIG } from "@/cache/cache.constant";

const filterCacheTag = CACHE_CONFIG.FILTER.ALL.TAGS[0];

export const createFilterAction = authActionClient
  .metadata({
    actionName: "createFilter",
  })
  .action(async () => {
    const result = await filtersRepository.createFilter();
    revalidateTag(filterCacheTag);
    return result;
  });
