import { ENDPOINTS } from "@/constants";
import { syncLocalCart } from "@/features/cart/cart.utils";
import useCartStore from "@/hooks/use-cart";
import { usePathname } from "next/navigation";
import React from "react";

export const useLoadCart = () => {
  const fetch = useCartStore((state) => state.fetch);
  const syncWithLocalStorage = useCartStore((state) => state.setIsSynced);
  const isSynced = useCartStore((state) => state.isSynced);
  const cartFrom = useCartStore((state) => state.type);
  const setWithLocalStorage = useCartStore(
    (state) => state.setWithLocalStorage,
  );
  const pathname = usePathname();

  React.useEffect(() => {
    const sync = async () => {
      const syncedItems = await syncLocalCart();
      if (syncedItems && syncedItems.length > 0) {
        syncWithLocalStorage(true);
      }
    };
    sync();

    // route /cart fetching itself
    if (pathname === ENDPOINTS.CART) return;

    fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    if (cartFrom === "local" && isSynced) {
      setWithLocalStorage();
    }
  }, [isSynced, cartFrom, setWithLocalStorage]);
};
