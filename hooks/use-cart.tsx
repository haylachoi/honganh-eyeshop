import { CartItemDisplayType } from "@/features/cart/cart.types";
import { getFromLocalStorage, saveToLocalStorage } from "@/lib/utils";
import { create } from "zustand";

interface Cart {
  items: CartItemDisplayType[];
  type: "local" | "server";
  selectedItems: CartItemDisplayType[];
  addToSelectedItems: (input: CartItemDisplayType) => void;
  removeFromSelectedItems: (input: CartItemDisplayType) => void;
  fetch: () => Promise<void>;
  setItems: (items: CartItemDisplayType[]) => void;
  addToCart: (input: CartItemDisplayType, mode?: "replace" | "modify") => void;
  removeFromCart: (item: CartItemDisplayType) => void;
}

const useCartStore = create<Cart>()((set, get) => ({
  items: [],
  type: "local",
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
    let type: "local" | "server" = "local";
    let items: CartItemDisplayType[] = [];
    try {
      const res = await fetch("/api/cart");
      if (!res.ok) {
        throw new Error(`Fetch failed with status: ${res.status}`);
      }

      const result = await res.json();
      if (!result.success) {
        items = getFromLocalStorage<CartItemDisplayType[]>("cart", []);
      } else {
        type = "server";
        items = result.cart;
      }
    } catch (e) {
      console.error("Error fetching cart:", e);
      items = getFromLocalStorage<CartItemDisplayType[]>("cart", []);
    }

    if (!items) return;

    set((state) => ({
      ...state,
      type,
      items,
    }));
  },
  setItems: (items) => {
    set((state) => ({
      ...state,
      items,
    }));
  },
  addToCart: (input, mode = "modify") => {
    const cart = get();
    const item = cart.items.find(
      (item) =>
        item.productId === input.productId &&
        item.variant.uniqueId === input.variant.uniqueId,
    );

    if (item) {
      set((state) => {
        const newState = {
          ...state,
          items: state.items.map((cartItem) => {
            if (
              cartItem.productId === item.productId &&
              item.variant.uniqueId === cartItem.variant.uniqueId
            ) {
              return {
                ...cartItem,
                quantity:
                  mode === "replace"
                    ? input.quantity
                    : cartItem.quantity + input.quantity,
              };
            }
            return cartItem;
          }),
        };

        saveToLocalStorage({
          key: "cart",
          value: newState.items,
        });

        return newState;
      });
    } else {
      set((state) => {
        const newState = {
          ...state,
          items: [...state.items, { ...input, quantity: input.quantity }],
        };

        saveToLocalStorage({
          key: "cart",
          value: newState.items,
        });

        return newState;
      });
    }
  },
  removeFromCart: (item) => {
    set((state) => {
      const newState = {
        ...state,
        items: state.items.filter(
          (cartItem) =>
            cartItem.productId !== item.productId &&
            cartItem.variant.uniqueId !== item.variant.uniqueId,
        ),
      };
      saveToLocalStorage({
        key: "cart",
        value: newState.items,
      });
      return newState;
    });
  },
}));

export default useCartStore;
