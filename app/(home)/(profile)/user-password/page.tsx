import { PasswordChangeForm } from "./user-password-form";
import { getSafeUserInfo } from "@/features/users/user.queries";

export const dynamic = "force-dynamic";

const UserPasswordPage = async () => {
  const userResult = await getSafeUserInfo();

  if (!userResult.success) {
    return null;
  }
  const user = userResult.data;

  if (user.provider !== "credentials") {
    return (
      <div>
        Tài khoản này không được đăng ký bằng mật khẩu nên không thể đổi mật
        khẩu
      </div>
    );
  }
  return (
    <div>
      <PasswordChangeForm id={user.id} />
    </div>
  );
};

export default UserPasswordPage;
