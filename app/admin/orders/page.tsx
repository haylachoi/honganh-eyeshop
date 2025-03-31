import { getAllOrders } from "@/features/orders/order.queries";
import OrdersView from "./orders-view";

const OrdersPage = async () => {
  const result = await getAllOrders();
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
