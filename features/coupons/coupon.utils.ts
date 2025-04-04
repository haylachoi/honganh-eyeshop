import { CouponType } from "./coupon.types";

const COUPON_MESSAGES = {
  VALID: "Mã giảm giá hợp lệ",
  LIMIT: "Mã giảm giá đã đạt giới hạn sử dụng",
  NOT_FOUND: "Mã giảm giá không tồn tại",
  MIN_ORDER_VALUE: "Giá trị đơn hàng chưa đạt mức tối thiểu",
  EXPIRED: "Mã giảm giá đã hết hạn",
};

export const calculateDiscount = ({
  total,
  coupon,
}: {
  total: number;
  coupon?: {
    value: number;
    discountType: "percent" | "fixed";
    maxDiscount: number;
  };
}): number => {
  if (!coupon) return 0;

  const { value, discountType: type, maxDiscount } = coupon;

  const discount =
    type === "fixed"
      ? value
      : Math.min(Math.floor((total * value) / 100), maxDiscount);

  return Math.min(discount, total);
};

export const validateCoupon = ({
  coupon,
  subTotal,
}: {
  coupon: CouponType | null;
  subTotal: number;
}) => {
  if (!coupon) {
    return { valid: false, message: COUPON_MESSAGES.NOT_FOUND };
  }

  if (coupon.status === "inactive") {
    return { valid: false, message: COUPON_MESSAGES.NOT_FOUND };
  }

  if (coupon.expiryDate < new Date()) {
    return { valid: false, message: COUPON_MESSAGES.EXPIRED };
  }

  if (coupon.usedCount > coupon.usageLimit) {
    return { valid: false, message: COUPON_MESSAGES.LIMIT };
  }

  if (subTotal < coupon.minOrderValue) {
    return {
      valid: false,
      message: `${COUPON_MESSAGES.MIN_ORDER_VALUE}: ${coupon.minOrderValue}`,
    };
  }

  return {
    valid: true,
    message: COUPON_MESSAGES.VALID,
    couponInfo: {
      code: coupon.code,
      discountType: coupon.discountType,
      value: coupon.value,
      description: coupon.description,
      maxDiscount: coupon.maxDiscount,
      expiryDate: coupon.expiryDate,
    },
  };
};
