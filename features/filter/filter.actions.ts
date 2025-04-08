"use server";

import { CACHE } from "@/constants";
import { authActionClient } from "@/lib/actions";
import filtersRepository from "@/lib/db/repositories/filters";
import { revalidateTag } from "next/cache";

export const createFilterAction = authActionClient
  .metadata({
    actionName: "createFilter",
  })
  .action(async () => {
    const result = await filtersRepository.createFilter();
    revalidateTag(CACHE.FILTER.ALL.TAGS);
    return result;
  });
