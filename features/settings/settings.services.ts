import next_cache from "@/cache";

export const getSettings = async () => {
  const settings = await next_cache.settings.getSettings();

  return settings;
};
