import { getOrderByUserID } from "@/features/orders/order.queries";
import OrdersView from "./orders-view";
import { Suspense } from "react";

const OrderPage = async () => {
  const ordersPromise = getOrderByUserID();
  return (
    <div className="container">
      <Suspense fallback={<div>Loading...</div>}>
        <OrdersView data={ordersPromise} />
      </Suspense>
    </div>
  );
};

export default OrderPage;
