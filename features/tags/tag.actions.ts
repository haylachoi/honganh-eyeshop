"use server";

import { authActionClient } from "@/lib/actions";
import tagsRepository from "@/lib/db/repositories/tags";
import { tagInputSchema, tagUpdateSchema } from "./tag.validator";
import { revalidateTag } from "next/cache";
import { CACHE } from "@/constants";
import { z } from "zod";

// export const getAllTagsAction = actionClient
//   .metadata({
//     actionName: "getAllTags",
//   })
//   .action(async () => {
//     const tags = await tagsRepository.getAllTags();
//     return tags;
//   });

export const createTagAction = authActionClient
  .metadata({
    actionName: "createTag",
  })
  .schema(tagInputSchema)
  .action(async ({ parsedInput: { name } }) => {
    const result = await tagsRepository.createTag({ name });
    revalidateTag(CACHE.TAGS.ALL.TAGS);
    return result;
  });

export const updateTagAction = authActionClient
  .metadata({
    actionName: "updateTag",
  })
  .schema(tagUpdateSchema)
  .action(async ({ parsedInput }) => {
    const result = await tagsRepository.updateTag(parsedInput);
    revalidateTag(CACHE.TAGS.ALL.TAGS);
    revalidateTag(CACHE.PRODUCTS.ALL.TAGS);
    return result;
  });

export const deleteTagAction = authActionClient
  .metadata({
    actionName: "deleteTag",
  })
  .schema(z.union([z.string(), z.array(z.string())]))
  .action(async ({ parsedInput }) => {
    const result = await tagsRepository.deleteTag(parsedInput);
    revalidateTag(CACHE.TAGS.ALL.TAGS);
    revalidateTag(CACHE.PRODUCTS.ALL.TAGS);
    return result;
  });
