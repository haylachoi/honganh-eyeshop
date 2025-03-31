import { formatDateTimeLocal } from "@/lib/utils";
import { CouponType } from "./coupon.types";

const COUPON_MESSAGES = {
  VALID: "Coupon is valid",
  INACTIVE: "Coupon is not active",
  LIMIT: "Coupon limit reached",
  NOT_FOUND: "Coupon not found",
  MIN_ORDER_VALUE: "Order value is less than minimum order value",
};

export const calculateDiscount = ({
  total,
  coupon,
}: {
  total: number;
  coupon?: {
    value: number;
    type: "percent" | "fixed";
    maxDiscount: number;
  };
}): number => {
  if (!coupon) return 0;

  const { value, type, maxDiscount } = coupon;

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
    return { valid: false, message: COUPON_MESSAGES.INACTIVE };
  }

  if (coupon.usedCount > coupon.usageLimit) {
    return { valid: false, message: COUPON_MESSAGES.LIMIT };
  }

  if (coupon.minOrderValue > subTotal) {
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
      type: coupon.type,
      value: coupon.value,
      description: coupon.description,
      maxDiscount: coupon.maxDiscount,
      expiryDate: formatDateTimeLocal(coupon.expiryDate),
    },
  };
};
