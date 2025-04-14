import { CartItemDisplayType } from "@/features/cart/cart.types";
import {
  getCartFromLocalStorage,
  saveCartToLocalStorage,
} from "@/features/cart/cart.utils";
import { create } from "zustand";

interface Cart {
  items: CartItemDisplayType[];
  type: "local" | "server";
  isSynced: boolean;
  setIsSynced: (isSynced: boolean) => void;
  selectedItems: CartItemDisplayType[];
  toggleSelectedItems: (input: CartItemDisplayType) => void;
  fetch: () => Promise<void>;
  setItems: ({
    items,
    type,
  }: {
    items: CartItemDisplayType[];
    type: "local" | "server";
  }) => void;
  setWithLocalStorage: () => void;
  addToCart: (input: CartItemDisplayType, mode?: "replace" | "modify") => void;
  removeFromCart: (item: CartItemDisplayType) => void;
}

const useCartStore = create<Cart>()((set, get) => ({
  items: [],
  isSynced: false,
  setIsSynced: (isSynced) => {
    set((state) => ({
      ...state,
      isSynced,
    }));
  },
  type: "local",
  selectedItems: [],
  toggleSelectedItems: (input) => {
    set((state) => {
      const isSelected = state.selectedItems.some(
        (item) =>
          item.productId === input.productId &&
          item.variant.uniqueId === input.variant.uniqueId,
      );

      return {
        ...state,
        selectedItems: isSelected
          ? state.selectedItems.filter(
              (item) =>
                item.productId !== input.productId ||
                item.variant.uniqueId !== input.variant.uniqueId,
            )
          : [...state.selectedItems, input],
      };
    });
  },

  setWithLocalStorage: () => {
    set((state) => ({
      ...state,
      type: "local",
      items: getCartFromLocalStorage(),
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
        items = getCartFromLocalStorage();
      } else {
        type = "server";
        items = result.cart;
      }
    } catch (e) {
      console.error("Error fetching cart:", e);
      items = getCartFromLocalStorage();
    }

    if (!items) return;

    set((state) => ({
      ...state,
      type,
      items,
    }));
  },
  setItems: ({ items, type }) => {
    set((state) => ({
      ...state,
      type,
      items,
    }));
  },
  addToCart: (input, mode = "modify") => {
    const { items, type } = get();
    const existingIndex = items.findIndex(
      (item) =>
        item.productId === input.productId &&
        item.variant.uniqueId === input.variant.uniqueId,
    );

    const updatedItems = [...items];

    if (existingIndex !== -1) {
      const existingItem = updatedItems[existingIndex];
      updatedItems[existingIndex] = {
        ...existingItem,
        quantity:
          mode === "replace"
            ? input.quantity
            : existingItem.quantity + input.quantity,
      };
    } else {
      updatedItems.push({ ...input, quantity: input.quantity });
    }

    if (type === "local") {
      saveCartToLocalStorage(updatedItems);
    }
    set({ items: updatedItems });
  },
  removeFromCart: (item) => {
    const { type } = get();
    set((state) => {
      const newState = {
        ...state,
        items: state.items.filter(
          (cartItem) =>
            cartItem.productId !== item.productId &&
            cartItem.variant.uniqueId !== item.variant.uniqueId,
        ),
      };
      if (type === "local") {
        saveCartToLocalStorage(newState.items);
      }
      return newState;
    });
  },
}));

export default useCartStore;
