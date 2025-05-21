import {
  countOrdersByUserId,
  getOrderByUserId,
} from "@/features/orders/order.queries";
import OrdersView from "./customer-orders-view";
import { Suspense } from "react";
import { LoadingIndicator } from "@/components/shared/loading-indicator";

export const dynamic = "force-dynamic";

const size = 3;
const CustomerOrderPage = async () => {
  const ordersPromise = getOrderByUserId({
    page: 0,
    size,
  });
  const countResult = await countOrdersByUserId();
  if (!countResult.success) {
    return <div>Error</div>;
  }
  const total = countResult.data;

  return (
    <div className="container">
      <Suspense fallback={<LoadingIndicator />}>
        <OrdersView data={ordersPromise} total={total} size={size} />
      </Suspense>
    </div>
  );
};

export default CustomerOrderPage;
