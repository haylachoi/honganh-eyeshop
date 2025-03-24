import {
  CartItemDisplayType,
  CartItemInputType,
} from "@/features/cart/cart.types";
import { create } from "zustand";

interface Cart {
  items: CartItemDisplayType[];
  addToCart: (input: CartItemDisplayType) => void;
  removeFromCart: (
    item: Pick<CartItemInputType, "productId" | "variantId">,
  ) => void;
}

const useCartStore = create<Cart>()((set, get) => ({
  items: [],
  addToCart: (input) => {
    const cart = get();
    const item = cart.items.find((item) => item.productId === input.productId);
    if (
      item &&
      item.quantity + input.quantity <= item.countInStock &&
      item.quantity + input.quantity >= 0
    ) {
      console.log("add", input.quantity);
      set((state) => {
        return {
          ...state,
          items: state.items.map((item) => {
            if (item.productId === input.productId) {
              return {
                ...item,
                quantity: item.quantity + input.quantity,
              };
            }
            return item;
          }),
        };
      });

      return;
    } else {
      set((state) => {
        return {
          ...state,
          items: [...state.items, input],
        };
      });
    }
  },
  removeFromCart: (item) => {
    set((state) => ({
      items: state.items.filter(
        (cartItem) => cartItem.productId !== item.productId,
      ),
    }));
  },
}));

export default useCartStore;
