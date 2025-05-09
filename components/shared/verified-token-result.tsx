import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import clsx from "clsx";
import { ENDPOINTS } from "@/constants/endpoints.constants";

type VerifyResultProps = {
  success: boolean;
  title: string;
  message: string;
  actionLabel: string;
  actionHref: string;
};

const VerifyResult = ({
  success,
  title,
  message,
  actionLabel,
  actionHref,
}: VerifyResultProps) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="text-center">
        <h1 className="text-3xl font-semibold text-foreground">{title}</h1>
        <p className="text-lg text-foreground mt-4">{message}</p>
      </div>
      <div className="flex justify-center">
        {success ? (
          <FaCheckCircle className="h-12 w-12 text-green-500" />
        ) : (
          <FaTimesCircle className="h-12 w-12 text-red-500" />
        )}
      </div>

      <div className="mt-6 text-center">
        <a
          href={actionHref}
          className={clsx(
            "px-6 py-2 text-primary-foreground transition",
            success
              ? "bg-primary hover:bg-secondary-dark"
              : "bg-destructive hover:bg-destructive-dark",
          )}
        >
          {actionLabel}
        </a>
      </div>
    </div>
  );
};

export const VerifySuccess = () => (
  <VerifyResult
    success={true}
    title="Xác minh thành công"
    message="Cảm ơn bạn đã xác minh email. Bây giờ bạn có thể đăng nhập vào tài khoản của mình."
    actionLabel="Đăng nhập ngay"
    actionHref={ENDPOINTS.AUTH.LOGIN}
  />
);

export const VerifyFailed = () => (
  <VerifyResult
    success={false}
    title="Xác minh thất bại"
    message="Token không hợp lệ hoặc đã hết hạn. Vui lòng thử lại hoặc liên hệ hỗ trợ."
    actionLabel="Gửi lại email xác minh"
    actionHref={ENDPOINTS.AUTH.ACTIVE_ACCOUNT}
  />
);

export const ResetPasswordSuccess = () => (
  <VerifyResult
    success={true}
    title="Đặt lại mật khẩu thành công"
    message="Bạn đã cập nhật mật khẩu thành công. Bây giờ bạn có thể đăng nhập lại."
    actionLabel="Đăng nhập"
    actionHref={ENDPOINTS.AUTH.LOGIN}
  />
);

export const ResetPasswordFailed = () => (
  <VerifyResult
    success={false}
    title="Đặt lại mật khẩu thất bại"
    message="Link đặt lại mật khẩu không hợp lệ hoặc đã hết hạn."
    actionLabel="Gửi lại link"
    actionHref={ENDPOINTS.AUTH.FORGOT_PASSWORD}
  />
);
