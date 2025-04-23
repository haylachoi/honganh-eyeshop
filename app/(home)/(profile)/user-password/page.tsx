import { auth } from "@/features/auth/auth.auth";
import { PasswordChangeForm } from "./user-password-form";

const UserPasswordPage = async () => {
  const user = await auth();
  if (!user) {
    return null;
  }
  return (
    <div>
      <PasswordChangeForm id={user.id} />
    </div>
  );
};

export default UserPasswordPage;
