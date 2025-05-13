"use server";

import { getAuthActionClient } from "@/lib/actions";
import { ResourceType } from "@/lib/error";
import { supportPageUpdateSchema } from "./support-pages.validator";
import { supportPagesRepository } from "@/lib/db/repositories/support-pages";
import { writeImageSourcesToDisk } from "@/lib/server-utils";
import { CACHE_CONFIG } from "@/cache/cache.constant";
import { revalidateTag } from "next/cache";

const resource: ResourceType = "supportPage";
const cacheTag = CACHE_CONFIG.SUPPORT_PAGES.SINGLE.TAGS[0];

export const createOrUpdateSupportPagesAction = getAuthActionClient({
  resource,
  action: "modify",
})
  .metadata({
    actionName: "createOrUpdateSupportPages",
  })
  .schema(supportPageUpdateSchema)
  .action(async ({ parsedInput }) => {
    const { slug, imageSources, content, images } = parsedInput;
    const imageSourcesMapping = await writeImageSourcesToDisk({
      imageSources: imageSources,
      to: "blogs",
      identity: slug,
    });

    let newContent = content;

    imageSourcesMapping.forEach(({ fileLink, fakeUrl }) => {
      newContent = newContent.replace(fakeUrl, fileLink);
      images.push(fileLink);
    });

    await supportPagesRepository.createOrUpdateSupportPages({
      input: {
        ...parsedInput,
        content: newContent,
        images,
      },
    });

    revalidateTag(cacheTag);
  });
