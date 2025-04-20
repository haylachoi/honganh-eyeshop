"use client";

import { trackOrderAction } from "@/features/orders/order.actions";
import { onActionError } from "@/lib/actions/action.helper";
import { getLink } from "@/lib/utils";
import { useAction } from "next-safe-action/hooks";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const TrackOrderView = () => {
  const [orderId, setOrderId] = useState("");
  const router = useRouter();
  const { execute, isPending } = useAction(trackOrderAction, {
    onSuccess: ({ input }) => {
      router.push(getLink.order.customer.view({ orderId: input.orderId }));
    },
    onError: onActionError,
  });

  return (
    <div className="flex gap-2">
      <div>
        <input
          className="w-full border px-3 py-2 rounded"
          value={orderId}
          placeholder="Mã đơn hàng"
          onChange={(event) => setOrderId(event.target.value)}
          required
        />
      </div>
      <button
        type="button"
        onClick={() =>
          execute({
            orderId,
          })
        }
        className="bg-primary text-white px-4 py-2 rounded hover:opacity-90"
        disabled={isPending}
      >
        Tra cứu
      </button>
    </div>
  );
};
