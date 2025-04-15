import { OrderType } from "@/features/orders/order.types";
import { Result } from "@/types";
import Image from "next/image";
import { use } from "react";

const CustomerOrdersView = ({
  data,
}: {
  data: Promise<Result<OrderType[], object>>;
}) => {
  const ordersResult = use(data);
  if (!ordersResult.success) {
    return <div>Error</div>;
  }
  const orders = ordersResult.data;
  return (
    <div>
      <ul className="flex flex-col gap-4">
        {orders.map((order) => (
          <li key={order.id}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p>{order.createdAt.toLocaleDateString()}</p>
                <p>{order.total}</p>
                <p>{order.orderStatus}</p>
              </div>
              <div>
                <ul>
                  {order.items.map((item) => (
                    <li key={item.variantId}>
                      <div className="grid grid-cols-[auto_1fr] gap-4">
                        <Image
                          src={item.imageUrl}
                          alt={item.productName}
                          width={160}
                          height={80}
                        />
                        <div>
                          <p>{item.productName}</p>
                          <p>{item.quantity}</p>
                          <p>{item.price}</p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CustomerOrdersView;
