import { settingsTypeSchema } from "@/features/settings/settings.validator";
import { connectToDatabase } from "..";
import Settings from "../model/settings.model";
import {
  BannersSettingsDbInputType,
  SellersSettingsDbInputType,
  SiteSettingsDbInputType,
  StoresSettingsDbInputType,
} from "@/features/settings/settings.types";
import { ServerError } from "@/lib/error";

const getSettings = async () => {
  await connectToDatabase();
  const settings = await Settings.findOne().lean();
  return settings ? settingsTypeSchema.parse(settings) : null;
};

const updateSiteSettings = async ({
  input,
}: {
  input: SiteSettingsDbInputType;
}) => {
  await connectToDatabase();
  const result = await Settings.findOneAndUpdate(
    {},
    {
      $set: {
        site: input,
      },
    },
    {
      upsert: true,
    },
  );

  if (!result) {
    throw new ServerError({});
  }
};

const updateSellersSettings = async ({
  input,
}: {
  input: SellersSettingsDbInputType;
}) => {
  await connectToDatabase();
  const result = await Settings.findOneAndUpdate(
    {},
    {
      $set: {
        sellers: input,
      },
    },
    {
      upsert: true,
    },
  );

  if (!result) {
    throw new ServerError({});
  }
};

const updateStoresSettings = async ({
  input,
}: {
  input: StoresSettingsDbInputType;
}) => {
  await connectToDatabase();
  const result = await Settings.findOneAndUpdate(
    {},
    {
      $set: {
        stores: input,
      },
    },
    {
      upsert: true,
    },
  );

  if (!result) {
    throw new ServerError({});
  }
};

const updateBannersSettings = async ({
  input,
}: {
  input: BannersSettingsDbInputType;
}) => {
  await connectToDatabase();
  const result = await Settings.findOneAndUpdate(
    {},
    {
      $set: {
        banners: input,
      },
    },
    {
      upsert: true,
    },
  );

  if (!result) {
    throw new ServerError({});
  }
};

const settingsRepository = {
  getSettings,
  updateSiteSettings,
  updateSellersSettings,
  updateStoresSettings,
  updateBannersSettings,
};
export default settingsRepository;
