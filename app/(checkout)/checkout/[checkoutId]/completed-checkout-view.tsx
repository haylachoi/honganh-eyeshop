import { CheckoutType } from "@/features/checkouts/checkout.types";
import { cn, getLink } from "@/lib/utils";
import { CheckCircle } from "lucide-react";
import Link from "next/link";

export const CompletedCheckoutView = ({
  checkout,
  className,
}: {
  checkout: CheckoutType;
  className?: string;
}) => {
  if (!checkout.isOrderd) {
    return <div>Đang chờ thanh toán</div>;
  }

  return (
    <div className={cn("", className)}>
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white p-8 text-center space-y-6 border border-foreground">
          <div className="flex justify-center">
            <div className="bg-green-100 p-4 rounded-full">
              <CheckCircle className="text-green-600 size-10" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">
            Đặt hàng thành công!
          </h2>
          <div className="text-gray-600 text-left flex flex-col gap-4">
            <p>
              Cảm ơn bạn đã mua hàng. Chúng tôi sẽ sớm gọi cho bạn để xác nhận
              đơn hàng.
            </p>
            <div>
              Thông tin chi tiết sẽ được gửi vào email của bạn theo địa chỉ:
              <span className="mx-1 font-semibold">
                {checkout?.customer?.email}
              </span>
            </div>
          </div>

          <div className="text-sm text-gray-500">
            Mã đơn hàng:{" "}
            <span className="font-medium text-gray-700">
              {checkout.orderId}
            </span>
          </div>

          <div className="flex flex-col gap-3">
            <Link
              href="/"
              className="bg-primary text-white px-4 py-2 hover:bg-primary/90 transition"
            >
              Tiếp tục mua sắm
            </Link>
            {/* todo : redirect to order page */}
            <Link
              href={getLink.order.customer.view({
                orderId: checkout.orderId as string,
              })}
              className="text-primary hover:underline text-sm"
            >
              Xem đơn hàng của bạn
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
