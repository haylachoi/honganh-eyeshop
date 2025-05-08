import next_cache from "@/cache";
import { AuthenticationError } from "@/lib/error";
import { authCustomerQueryClient } from "@/lib/query";

export const getSafeUserInfo = authCustomerQueryClient.query(
  async ({ ctx }) => {
    const user = await next_cache.users.getSafeUserInfo({
      id: ctx.userId,
    });

    if (!user) {
      throw new AuthenticationError({ resource: "user" });
    }

    return user;
  },
);

export const getSafeAdminUserInfo = authCustomerQueryClient.query(async () => {
  const users = await next_cache.users.getSafeAdminUserInfo();

  return users;
});
