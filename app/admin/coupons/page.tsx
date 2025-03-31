import AdminMainTopSection from "@/components/shared/admin/main-top-section";
import { ADMIN_ENDPOINTS } from "@/constants";
import CouponsView from "./_components/coupons-view";
import { getAllCouponsQuery } from "@/features/coupons/coupon.queries";

const CouponPage = async () => {
  const result = await getAllCouponsQuery();
  if (!result.success) {
    return <div>Error</div>;
  }
  const coupons = result.data;

  return (
    <div>
      <AdminMainTopSection
        title="Danh sách mã giảm giá"
        addNewLink={`${ADMIN_ENDPOINTS.COUPONS}/create`}
      />
      <CouponsView coupons={coupons} />
    </div>
  );
};
export default CouponPage;
