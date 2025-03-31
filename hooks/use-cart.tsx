import {
  CartItemDisplayType,
  CartItemInputType,
} from "@/features/cart/cart.types";
import { create } from "zustand";

interface Cart {
  items: CartItemDisplayType[];
  selectedItems: CartItemDisplayType[];
  addToSelectedItems: (input: CartItemDisplayType) => void;
  removeFromSelectedItems: (input: CartItemDisplayType) => void;
  fetch: () => Promise<void>;
  setItems: (items: CartItemDisplayType[]) => void;
  addToCart: (input: CartItemDisplayType) => void;
  removeFromCart: (
    item: Pick<CartItemInputType, "productId" | "variantId">,
  ) => void;
}

const useCartStore = create<Cart>()((set, get) => ({
  items: [],
  selectedItems: [],
  addToSelectedItems: (input) => {
    set((state) => ({
      ...state,
      selectedItems: [...state.selectedItems, input],
    }));
  },

  removeFromSelectedItems: (input) => {
    set((state) => ({
      ...state,
      selectedItems: state.selectedItems.filter(
        (item) => item.productId !== input.productId,
      ),
    }));
  },
  fetch: async () => {
    const data = await fetch("/api/cart").then((result) => result.json());
    const cart = data.cart as CartItemDisplayType[] | undefined;
    if (!cart) return;
    set((state) => ({
      ...state,
      items: cart,
    }));
  },
  setItems: (items) => {
    set((state) => ({
      ...state,
      items,
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
