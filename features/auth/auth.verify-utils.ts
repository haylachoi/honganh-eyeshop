import { connectToDatabase } from "@/lib/db";
import PasswordResetToken from "@/lib/db/model/password-reset-token.model";

export const validatePasswordResetToken = async ({
  token,
}: {
  token: string;
}) => {
  await connectToDatabase();
  const sesetToken = await PasswordResetToken.findOne({
    token,
    expiresAt: { $gt: new Date() },
  });
  if (!sesetToken) {
    return {
      success: false,
      message: "Token không hợp lệ",
    };
  }

  return {
    success: true,
    data: {
      id: sesetToken._id.toString(),
      email: sesetToken.email,
    },
  };
};
