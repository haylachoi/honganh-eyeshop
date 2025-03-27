import { auth } from "@/features/auth/auth.query";

const ProfilePage = async () => {
  const user = await auth();
  return <div>{JSON.stringify(user)}</div>;
};

export default ProfilePage;
