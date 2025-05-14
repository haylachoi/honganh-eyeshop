"use server";

import { getAuthActionClient } from "@/lib/actions";
import { Resource } from "../authorization/authorization.constants";
import {
  bannersSettingsUpdateSchema,
  sellersSettingsUpdateSchema,
  siteSettingsUpdateSchema,
  storesSettingsUpdateSchema,
} from "./settings.validator";
import settingsRepository from "@/lib/db/repositories/settings";
import { CACHE_CONFIG } from "@/cache/cache.constant";
import { revalidateTag } from "next/cache";
import { saveIcon, saveLogo } from "./settings.utils";
import { writePublicImageToDisk } from "@/lib/server-utils";

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

export const createOrUpdateBannersSettingsAction = modifyQueryClient
  .metadata({
    actionName: "createOrUpdateBannersSettings",
  })
  .schema(bannersSettingsUpdateSchema)
  .action(async ({ parsedInput }) => {
    const {
      benefits: { items },
    } = parsedInput;
    const dbBenefits = await Promise.all(
      items.map(async (benefit, index) => {
        if (benefit.icon instanceof File) {
          const path = await writePublicImageToDisk({
            file: benefit.icon,
            to: "icons",
            fileName: `benefit${index}.svg`,
          });

          return { ...benefit, icon: path };
        } else {
          const path = benefit.icon;
          return { ...benefit, icon: path };
        }
      }),
    );

    await settingsRepository.updateBannersSettings({
      input: {
        benefits: { ...parsedInput.benefits, items: dbBenefits },
      },
    });

    revalidateTag(cacheTag);
  });
