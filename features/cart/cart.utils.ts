import { getFromLocalStorage, saveToLocalStorage } from "@/lib/utils";
import { CartItemDisplayType } from "./cart.types";

export const getCartFromLocalStorage = () => {
  const cart = getFromLocalStorage<CartItemDisplayType[]>("cart", []);
  return cart;
};

export const saveCartToLocalStorage = (cart: CartItemDisplayType[]) => {
  saveToLocalStorage({
    key: "cart",
    value: cart,
  });
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const deepEqual = (a: any, b: any): boolean => {
  if (a === b) return true;
  if (typeof a !== "object" || typeof b !== "object" || a == null || b == null)
    return false;

  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;

  for (const key of keysA) {
    if (!keysB.includes(key)) return false;
    if (!deepEqual(a[key], b[key])) return false;
  }

  return true;
};

async function syncCartRequest(
  cart: {
    productId: string;
    variantId: string;
    quantity: number;
  }[],
): Promise<CartItemDisplayType[]> {
  const res = await fetch("/api/cart/merge", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(cart),
  });

  if (!res.ok) {
    throw new Error("Failed to sync cart");
  }

  const data = await res.json();
  if (data.success) {
    return data.items;
  }

  return [];
}

export const syncLocalCart = async () => {
  const localCart = getCartFromLocalStorage();
  try {
    const items = await syncCartRequest(
      localCart.map((cart) => ({
        productId: cart.productId,
        variantId: cart.variant.uniqueId,
        quantity: cart.quantity,
      })),
    );

    const isEqual = deepEqual(localCart, items);
    if (isEqual) return;

    saveCartToLocalStorage(items);
    return items;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    throw new Error("Failed to sync local cart");
  }
};
