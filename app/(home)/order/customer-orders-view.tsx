"use client";

import AnimateLoadingIcon from "@/components/custom-ui/animate-loading-icon";
import { getOrderHistoryAction } from "@/features/orders/order.actions";
import { ORDER_STATUS_DISPLAY_MAPS } from "@/features/orders/order.constants";
import { OrderType } from "@/features/orders/order.types";
import { onActionError } from "@/lib/actions/action.helper";
import { dateFormatter, getLink } from "@/lib/utils";
import { Result } from "@/types";
import { useAction } from "next-safe-action/hooks";
import Image from "next/image";
import { use, useState } from "react";

const CustomerOrdersView = ({
  data,
  total,
  size,
}: {
  data: Promise<Result<OrderType[], object>>;
  total: number;
  size: number;
}) => {
  const ordersResult = use(data);
  const [page, setPage] = useState(0);
  const { execute, isPending } = useAction(getOrderHistoryAction, {
    onSuccess: ({ data }) => {
      if (data) {
        setOrders((prev) => [...prev, ...data]);
        setPage((prev) => prev + 1);
      }
    },
    onError: onActionError,
  });

  const totalPages = Math.ceil(total / size);
  const [orders, setOrders] = useState<OrderType[]>(
    ordersResult.success ? ordersResult.data : [],
  );
  if (orders.length === 0) {
    return <div>Không có đơn hàng nào</div>;
  }

  // todo: add loading to button
  return (
    <div className="">
      <h1 className="text-2xl font-bold mb-6">Lịch sử đơn hàng</h1>
      <OrderHistory orders={orders} />
      <button
        className="mt-6 block mx-auto w-max px-4 py-2 border border-foreground cursor-pointer"
        disabled={isPending || page === totalPages - 1}
        onClick={() =>
          execute({
            page: page + 1,
            size,
          })
        }
      >
        {`Xem tiếp theo (${page + 1}/${totalPages})`}
        {isPending && <AnimateLoadingIcon />}
      </button>
    </div>
  );
};

export default CustomerOrdersView;

export const OrderHistory = ({ orders }: { orders: OrderType[] }) => {
  if (orders.length === 0) {
    return (
      <p className="text-center text-muted-foreground">
        Bạn chưa có đơn hàng nào.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <OrderCard key={order.orderId} order={order} />
      ))}
    </div>
  );
};

const OrderCard = ({ order }: { order: OrderType }) => (
  <div className="border border-foreground p-4 space-y-4">
    <div className="flex justify-between items-center">
      <div className="text-sm text-muted-foreground">
        Ngày đặt: {dateFormatter.format(new Date(order.createdAt))}
      </div>
      <a
        href={getLink.order.customer.view({ orderId: order.orderId })}
        className="text-sm text-primary hover:underline"
      >
        Xem chi tiết
      </a>
    </div>

    <h2 className="text-lg font-semibold">Đơn hàng: {order.orderId}</h2>

    <div className="space-y-1 text-sm">
      <p>
        <span className="font-medium">Trạng thái: </span>
        {ORDER_STATUS_DISPLAY_MAPS[order.orderStatus]}
      </p>
      {order.cancelReason && (
        <p>
          <span className="font-medium">Lý do: </span>
          {order.cancelReason}
        </p>
      )}
      <p>
        <span className="font-medium">Tổng cộng: </span>
        {order.total.toLocaleString()}₫
      </p>
      <p>
        <span className="font-medium">Thanh toán: </span>
        {order.paymentMethod === "cod" ? "Khi nhận hàng" : "Online"}
      </p>
    </div>

    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {order.items.map((item) => (
        <li key={item.variantId} className="py-3 flex gap-4">
          <Image
            src={item.imageUrl}
            alt={item.productName}
            width={100}
            height={50}
            className="w-32 aspect-video object-cover rounded border"
          />
          <div className="text-sm">
            <a href={item.productUrl} className="font-medium hover:underline">
              {item.productName}
            </a>
            <p className="text-muted-foreground text-sm">
              {item.attributes
                .map((attr) => `${attr.name}: ${attr.value}`)
                .join(", ")}
            </p>
            <p>Số lượng: {item.quantity}</p>
            <p>Giá: {item.price.toLocaleString()}₫</p>
          </div>
        </li>
      ))}
    </ul>
  </div>
);
