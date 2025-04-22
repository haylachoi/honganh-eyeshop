import { getSafeUserInfo } from "@/features/users/user.queries";
import { UserInfoForm } from "./user-info-form";
import { customerInfoUpdateSchema } from "@/features/users/user.validator";

const ProfilePage = async () => {
  const result = await getSafeUserInfo();
  if (!result.success) return null;

  const initValues = customerInfoUpdateSchema.parse(result.data);
  return (
    <div>
      <UserInfoForm initValues={initValues} />
    </div>
  );
};

export default ProfilePage;
