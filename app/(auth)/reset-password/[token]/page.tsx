import { passwordResetTokenRepository } from "@/lib/db/repositories/password-reset-token";
import { ResetPasswordForm } from "./reset-password-form";
import { ResetPasswordFailed } from "@/components/shared/verified-token-result";

type Params = {
  token: string;
};
const ResetPasswordPage = async ({ params }: { params: Promise<Params> }) => {
  const { token } = await params;
  const resetToken =
    await passwordResetTokenRepository.findPasswordResetTokenByToken(token);
  // if (!resetToken || resetToken.expiresAt < new Date()) {
  //   return (
  //     <div className="container">
  //       <ResetPasswordFailed />
  //     </div>
  //   );
  // }
  //
  // return (
  //   <div className="container">
  //     <ResetPasswordForm token={token} />
  //   </div>
  // );
  return (
    <div className="flex justify-center items-center bg-background">
      {!resetToken || resetToken.expiresAt < new Date() ? (
        <div className="max-w-md w-full p-6">
          <ResetPasswordFailed />
        </div>
      ) : (
        <ResetPasswordForm token={token} />
      )}
    </div>
  );
};

export default ResetPasswordPage;
