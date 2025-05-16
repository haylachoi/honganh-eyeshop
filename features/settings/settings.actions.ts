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
import { BannersSettingsDbInputType } from "./settings.types";

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
    const iconLink =
      parsedInput.logo instanceof File
        ? await saveLogo({
            file: parsedInput.logo,
          })
        : parsedInput.logo;

    const newSocialLinks = await Promise.all(
      parsedInput.socialLinks.map(async (link, index) => {
        const icon = link.icon;
        if (icon instanceof File) {
          const path = await writePublicImageToDisk({
            file: icon,
            to: "icons",
            fileName: `site_social_${index}.svg`,
          });
          return { ...link, icon: path };
        }
        const path = icon;
        return { ...link, icon: path };
      }),
    );

    await settingsRepository.updateSiteSettings({
      input: {
        ...parsedInput,
        logo: iconLink,
        socialLinks: newSocialLinks,
      },
    });
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
      homeHero,
    } = parsedInput;

    // Save benefit icons
    const dbBenefits = await Promise.all(
      items.map(async (benefit, index) => {
        if (benefit.icon instanceof File) {
          const path = await writePublicImageToDisk({
            file: benefit.icon,
            to: "icons",
            fileName: `banner_benefit${index}.svg`,
          });

          return { ...benefit, icon: path };
        } else {
          const path = benefit.icon;
          return {
            ...benefit,
            icon: path,
          };
        }
      }),
    );

    // Save homeHero images if exists
    let dbHomeHero: BannersSettingsDbInputType["homeHero"];
    if (homeHero) {
      const responsiveTypes = ["mobile", "tablet", "desktop"] as const;

      dbHomeHero = {
        ...homeHero,
        ...Object.fromEntries(
          await Promise.all(
            responsiveTypes.map(async (type) => {
              const responsive = homeHero[type];
              const imageUrl = responsive.image.url;

              if (imageUrl instanceof File) {
                const extension = imageUrl.name.split(".").pop() ?? "png";
                const fileName = `banner_homeHero_${type}.${extension}`;
                const savedUrl = await writePublicImageToDisk({
                  file: imageUrl,
                  to: "others",
                  fileName,
                });

                return [
                  type,
                  {
                    ...responsive,
                    image: {
                      url: savedUrl,
                    },
                  },
                ];
              }

              return [type, responsive];
            }),
          ),
        ),
      };
    }

    const input: BannersSettingsDbInputType = {
      ...parsedInput,
      benefits: { ...parsedInput.benefits, items: dbBenefits },
      homeHero: dbHomeHero,
    };

    await settingsRepository.updateBannersSettings({ input });

    revalidateTag(cacheTag);
  });
