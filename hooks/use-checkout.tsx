import { CheckoutType } from "@/features/checkouts/checkout.types";
import { OrderCouponType } from "@/features/orders/order.types";
import { create } from "zustand";

type ItemType = Pick<CheckoutType, "items">["items"][0];

interface CheckoutStoreProps {
  items: ItemType[];
  setItems: (items: ItemType[]) => void;
  coupon?: OrderCouponType;
  setCoupon: (coupon: OrderCouponType | undefined) => void;
}
export const useCheckoutStore = create<CheckoutStoreProps>((set) => ({
  items: [],
  setItems: (items) => set((state) => ({ ...state, items })),
  setCoupon: (coupon) => set((state) => ({ ...state, coupon })),
}));
