import { getSafeUserInfo } from "@/features/users/user.queries";
import AvatarUpload from "./avatar-uploader";
import { LogoutButton } from "@/components/shared/logout-button";

export const CustomerAvatarProvider = async () => {
  const profileResult = await getSafeUserInfo();
  if (!profileResult.success) return null;

  const { avatar, id, name } = profileResult.data;
  return (
    <div>
      <AvatarUpload defaultUrl={avatar} id={id} name={name} />
      <div className="text-center text-2xl font-bold">{name}</div>
      <div className="flex justify-center font-bold text-muted-foreground">
        <LogoutButton />
      </div>
    </div>
  );
};
