import { auth } from "@/features/auth/auth.queries";

const ProfilePage = async () => {
  const user = await auth();
  return <div>{JSON.stringify(user)}</div>;
};

export default ProfilePage;
