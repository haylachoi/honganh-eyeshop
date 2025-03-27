import {
  CartItemDisplayType,
  CartItemInputType,
} from "@/features/cart/cart.types";
import { create } from "zustand";

interface Cart {
  items: CartItemDisplayType[];
  fetch: () => Promise<void>;
  addToCart: (input: CartItemDisplayType) => void;
  removeFromCart: (
    item: Pick<CartItemInputType, "productId" | "variantId">,
  ) => void;
}

const useCartStore = create<Cart>()((set, get) => ({
  items: [],
  fetch: async () => {
    const data = await fetch("/api/cart").then((result) => result.json());
    const cart = data.cart as CartItemDisplayType[] | undefined;
    if (!cart) return;
    set((state) => ({
      ...state,
      items: cart,
    }));
  },
  addToCart: (input) => {
    const cart = get();
    const item = cart.items.find(
      (item) =>
        item.productId === input.productId &&
        item.variant.uniqueId === input.variant.uniqueId,
    );
    if (item) {
      set((state) => ({
        ...state,
        items: state.items.map((cartItem) => {
          if (
            cartItem.productId === item.productId &&
            item.variant.uniqueId === cartItem.variant.uniqueId
          ) {
            return {
              ...cartItem,
              quantity: cartItem.quantity + input.quantity,
            };
          }
          return cartItem;
        }),
      }));
    } else {
      set((state) => ({
        ...state,
        items: [...state.items, { ...input, quantity: input.quantity }],
      }));
    }
  },
  removeFromCart: (item) => {
    set((state) => ({
      ...state,
      items: state.items.filter(
        (cartItem) =>
          cartItem.productId !== item.productId &&
          cartItem.variant.uniqueId !== item.variantId,
      ),
    }));
  },
}));

export default useCartStore;
