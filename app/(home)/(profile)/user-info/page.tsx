import { getSafeUserInfo } from "@/features/users/user.queries";
import { UserInfoForm } from "./user-info-form";

export const dynamic = "force-dynamic";

const ProfilePage = async () => {
  const result = await getSafeUserInfo();
  if (!result.success) return null;

  const initValues = {
    id: result.data.id,
    name: result.data.name,
    phone: result.data.phone ?? "",
  };

  return (
    <div>
      <UserInfoForm initValues={initValues} />
    </div>
  );
};

export default ProfilePage;
