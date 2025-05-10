import { getLast30DaysOrders } from "@/features/orders/order.queries";
import OrdersView from "./_components/orders-view";

export const dynamic = "force-dynamic";

const OrdersPage = async () => {
  const result = await getLast30DaysOrders();
  if (!result.success) return <div>Error</div>;

  const orders = result.data;
  if (orders.length === 0) return <div>No orders</div>;
  return (
    <div>
      <OrdersView orders={orders} />
    </div>
  );
};

export default OrdersPage;
