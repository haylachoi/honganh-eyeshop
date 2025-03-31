import { getCouponByIdQuery } from "@/features/coupons/coupon.queries";
import { CouponUpdateForm } from "./coupon-form.update";
import { formatDateTimeLocal } from "@/lib/utils";

const CouponUpdatePage = async ({
  params,
}: {
  params: Promise<{ couponId: string }>;
}) => {
  const { couponId } = await params;
  const result = await getCouponByIdQuery(couponId);
  if (!result.success) {
    return <div>Error</div>;
  }
  const coupon = {
    ...result.data,
    startDate: formatDateTimeLocal(result.data.startDate),
    expiryDate: formatDateTimeLocal(result.data.expiryDate),
  };
  return (
    <div>
      <CouponUpdateForm defaultValues={coupon} />
    </div>
  );
};

export default CouponUpdatePage;
