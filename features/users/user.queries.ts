import userRepository from "@/lib/db/repositories/user";
import { AuthenticationError } from "@/lib/error";
import { authCustomerQueryClient } from "@/lib/query";

export const getSafeUserInfo = authCustomerQueryClient.query(
  async ({ ctx }) => {
    console.log(ctx.userId);
    const user = await userRepository.getSafeUserById({
      id: ctx.userId,
    });

    if (!user) {
      throw new AuthenticationError({ resource: "user" });
    }

    return user;
  },
);
