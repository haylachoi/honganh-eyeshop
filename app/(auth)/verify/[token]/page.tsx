import {
  VerifyFailed,
  VerifySuccess,
} from "@/components/shared/verified-token-result";
import { verifyUserByToken } from "@/features/auth/auth.verify-utils";

type Params = {
  token: string;
};

const VerifyPage = async ({ params }: { params: Promise<Params> }) => {
  const { token } = await params;
  const result = await verifyUserByToken({ token });

  return (
    <div className="flex justify-center items-center bg-background">
      <div className="max-w-md w-full p-6">
        {result.success ? <VerifySuccess /> : <VerifyFailed />}
      </div>
    </div>
  );
};

export default VerifyPage;
