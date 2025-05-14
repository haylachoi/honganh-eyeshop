import next_cache from "@/cache";
import { NotFoundError } from "@/lib/error";
import { safeQuery } from "@/lib/query";
import { Resource } from "../authorization/authorization.constants";

const resource: Resource = "settings";
export const getSettings = safeQuery.query(async () => {
  const result = await next_cache.settings.getSettings();
  if (!result) {
    throw new NotFoundError({
      resource,
    });
  }
  return result;
});
