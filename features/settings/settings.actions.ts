"use server";

import { getAuthActionClient } from "@/lib/actions";
import { Resource } from "../authorization/authorization.constants";
import {
  sellersSettingsUpdateSchema,
  siteSettingsUpdateSchema,
  storesSettingsUpdateSchema,
} from "./settings.validator";
import settingsRepository from "@/lib/db/repositories/settings";
import { CACHE_CONFIG } from "@/cache/cache.constant";
import { revalidateTag } from "next/cache";
import { saveIcon, saveLogo } from "./settings.utils";

const resource: Resource = "settings";
const cacheTag = CACHE_CONFIG.SETTINGS.ALL.TAGS[0];

const modifyQueryClient = getAuthActionClient({
  resource,
  action: "modify",
});

export const createOrUpdateSiteSettingsAction = modifyQueryClient
  .metadata({
    actionName: "createOrUpdateSiteSettings",
  })
  .schema(siteSettingsUpdateSchema)
  .action(async ({ parsedInput }) => {
    if (!parsedInput.logo.startsWith("/")) {
      const logo = await saveLogo({
        content: parsedInput.logo,
      });
      parsedInput.logo = logo;
    }

    await settingsRepository.updateSiteSettings({ input: parsedInput });
    revalidateTag(cacheTag);
  });

export const createOrUpdateSellersSettingsAction = modifyQueryClient
  .metadata({
    actionName: "createOrUpdateSellersSettings",
  })
  .schema(sellersSettingsUpdateSchema)
  .action(async ({ parsedInput }) => {
    const icons = parsedInput.socialIcons;

    for (const key of Object.keys(icons) as (keyof typeof icons)[]) {
      const icon = icons[key];
      if (!icon.url.startsWith("/")) {
        const path = await saveIcon({
          content: icon.url,
          fileName: `seller_${key}.svg`,
        });
        icon.url = path;
      }
    }

    await settingsRepository.updateSellersSettings({ input: parsedInput });
    revalidateTag(cacheTag);
  });

export const createOrUpdateStoresSettingsAction = modifyQueryClient
  .metadata({
    actionName: "createOrUpdateStoresSettings",
  })
  .schema(storesSettingsUpdateSchema)
  .action(async ({ parsedInput }) => {
    await settingsRepository.updateStoresSettings({ input: parsedInput });
    revalidateTag(cacheTag);
  });
