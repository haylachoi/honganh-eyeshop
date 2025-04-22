import { auth } from "@/features/auth/auth.auth";

const ProfilePage = async () => {
  const user = await auth();
  return <div>{JSON.stringify(user)}</div>;
};

export default ProfilePage;
