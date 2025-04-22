import { getSafeUserInfo } from "@/features/users/user.queries";
import AvatarUpload from "./avatar-uploader";

export const CustomerAvatarProvider = async () => {
  const profileResult = await getSafeUserInfo();
  if (!profileResult.success) return null;

  const { avatar, id, name } = profileResult.data;
  return (
    <div>
      <AvatarUpload defaultUrl={avatar} id={id} />
      <div className="text-center text-2xl font-bold">{name}</div>
    </div>
  );
};
