"use server";

import { getAuthActionClient } from "@/lib/actions";
import tagsRepository from "@/lib/db/repositories/tags";
import { tagInputSchema, tagUpdateSchema } from "./tag.validator";
import { revalidateTag } from "next/cache";
import { CACHE } from "@/constants";
import { z } from "zod";

const resource = "tag";
const createTagActionClient = getAuthActionClient({
  resource,
  action: "create",
});

const modifyTagActionClient = getAuthActionClient({
  resource,
  action: "modify",
});

const deleteTagActionClient = getAuthActionClient({
  resource,
  action: "delete",
});

export const createTagAction = createTagActionClient
  .metadata({
    actionName: "createTag",
  })
  .schema(tagInputSchema)
  .action(async ({ parsedInput: { name } }) => {
    const result = await tagsRepository.createTag({ name });
    revalidateTag(CACHE.TAGS.ALL.TAGS);
    return result;
  });

export const updateTagAction = modifyTagActionClient
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

export const deleteTagAction = deleteTagActionClient
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
