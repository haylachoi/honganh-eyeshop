"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function VnpReturnPage() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState("Đang xử lý...");

  useEffect(() => {
    const vnp_ResponseCode = searchParams.get("vnp_ResponseCode");
    const orderId = searchParams.get("vnp_TxnRef");

    if (vnp_ResponseCode === "00") {
      setStatus("Thanh toán thành công đơn hàng #" + orderId);
      // Gửi thêm request lên server để xác thực / cập nhật đơn hàng
    } else {
      setStatus("Thanh toán thất bại hoặc bị huỷ.");
    }
  }, [searchParams]);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">{status}</h1>
    </div>
  );
}
