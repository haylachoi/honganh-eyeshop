import { auth } from "@/features/auth/auth.auth";
import { ORDER_STATUS_DISPLAY_MAPS } from "@/features/orders/order.constants";
import { getOrderByOrderId } from "@/features/orders/order.queries";
import { OrderType } from "@/features/orders/order.types";
import {
  dateFormatter,
  getFullAdress,
  maskEmail,
  maskPhone,
} from "@/lib/utils";
import Image from "next/image";

type Params = { orderId: string };
const CustomerOrderPage = async ({ params }: { params: Promise<Params> }) => {
  const { orderId } = await params;
  const result = await getOrderByOrderId(orderId);
  if (!result.success) {
    return <div>Not found</div>;
  }
  const user = await auth();
  const order = result.data;

  const isUserMatch = order.userId === user?.id;
  if (!isUserMatch) {
    order.customer.phone = maskPhone(order.customer.phone);
    order.customer.email = maskEmail(order.customer.email);
    order.shippingAddress.address = "***";
  }
  return (
    <div className="container">
      <CustomerOrderView order={order} />
    </div>
  );
};

export default CustomerOrderPage;

const CustomerOrderView = async ({ order }: { order: OrderType }) => {
  return (
    <div className="max-w-3xl mx-auto p-6 border border-foreground">
      <OrderHeader order={order} />
      <ShippingInfo order={order} />
      <OrderStatus order={order} />
      <OrderItems order={order} />
      <OrderSummary order={order} />
    </div>
  );
};
const OrderHeader = ({ order }: { order: OrderType }) => (
  <div className="mb-6">
    <h1 className="text-2xl font-bold">Chi tiết đơn hàng: {order.orderId}</h1>
    <span className="text-sm text-muted-foreground">
      Ngày lập: {dateFormatter.format(new Date(order.createdAt))}
    </span>
  </div>
);

const ShippingInfo = ({ order }: { order: OrderType }) => (
  <section className="mb-6">
    <h2 className="text-xl font-semibold mb-4 border-b pb-2">
      🧾 Thông tin giao hàng
    </h2>
    <div className="mb-1">
      <span className="font-medium">Họ tên: </span>
      {order.customer.name}
    </div>
    <div className="mb-1">
      <span className="font-medium">Số điện thoại: </span>
      {order.customer.phone}
    </div>
    <div className="mb-1">
      <span className="font-medium">Email: </span>
      {order.customer.email}
    </div>
    <div className="mb-1">
      <span className="font-medium">Địa chỉ: </span>
      {getFullAdress(order.shippingAddress)}
    </div>
  </section>
);

const OrderStatus = ({ order }: { order: OrderType }) => (
  <section className="mb-6">
    <h2 className="text-xl font-semibold mb-4 border-b pb-2">
      🚚 Trạng thái đơn hàng
    </h2>
    <p>
      <span className="font-medium">Trạng thái đơn hàng: </span>
      {ORDER_STATUS_DISPLAY_MAPS[order.orderStatus]}
    </p>
    <p>
      <span className="font-medium">Hình thức thanh toán: </span>
      {order.paymentMethod === "cod" ? "Khi nhận hàng" : "Online"}
    </p>
  </section>
);

const OrderItems = ({ order }: { order: OrderType }) => (
  <section className="mb-6">
    <h2 className="text-xl font-semibold mb-4 border-b pb-2">🛒 Sản phẩm</h2>
    <ul className="divide-y">
      {order.items.map((item) => (
        <li key={item.variantId} className="py-3 flex gap-4">
          <Image
            src={item.imageUrl}
            alt={item.productName}
            width={200}
            height={100}
            className="w-48 aspect-video object-cover"
          />
          <div>
            <a href={item.productUrl} className="font-medium hover:underline">
              {item.productName}
            </a>
            <p className="text-sm text-muted-foreground">
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
  </section>
);

const OrderSummary = ({ order }: { order: OrderType }) => (
  <section className="text-right text-sm">
    <p>Tạm tính: {order.subTotal.toLocaleString()}₫</p>
    <p>Phí giao hàng: {order.shippingFee.toLocaleString()}₫</p>
    {order.discount > 0 && <p>Giảm giá: -{order.discount.toLocaleString()}₫</p>}
    <p className="font-bold text-lg">
      Tổng cộng: {order.total.toLocaleString()}₫
    </p>
  </section>
);
