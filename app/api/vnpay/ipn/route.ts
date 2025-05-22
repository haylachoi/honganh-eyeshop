import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import qs from "qs";
import { sortObjectVnPay } from "@/features/orders/order.utils";
import ordersRepository from "@/lib/db/repositories/orders";
import { revalidateTag } from "next/cache";
import { CACHE_CONFIG } from "@/cache/cache.constant";

const cacheTags = CACHE_CONFIG.ORDER.ALL.TAGS[0];

// note: với test mode: url phải dược đăng ký trong tài khoản VNPay. Với production: phải được hỗ trợ từ VNPay
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const queryParams = Object.fromEntries(url.searchParams.entries());

  console.log("ipn call");
  const vnp_SecureHash = queryParams["vnp_SecureHash"];
  delete queryParams["vnp_SecureHash"];
  delete queryParams["vnp_SecureHashType"];

  const sortedParams = sortObjectVnPay(queryParams);
  const signData = qs.stringify(sortedParams, { encode: false });

  const hmac = crypto.createHmac("sha512", process.env.VNP_HASH_SECRET!);
  const signed = hmac.update(signData).digest("hex");

  const orderId = queryParams["vnp_TxnRef"];
  const rspCode = queryParams["vnp_ResponseCode"];
  const amount = Number(queryParams["vnp_Amount"]) / 100;

  const order = await ordersRepository.getOrderByOrderId(orderId);

  if (!order) {
    return NextResponse.json({ RspCode: "01", Message: "Order not found" });
  }

  const checkOrderId = !!order;
  const checkAmount = amount === order.total;
  const paymentStatus = order?.paymentStatus;

  if (signed === vnp_SecureHash) {
    if (checkOrderId) {
      if (checkAmount) {
        if (paymentStatus === "pending") {
          if (rspCode === "00") {
            //  Cập nhật DB: giao dịch thành công
            await ordersRepository.updatePaymentStatusOrder({
              orderId,
              status: "paid",
            });

            revalidateTag(cacheTags);
            return NextResponse.json({ RspCode: "00", Message: "Success" });
          } else {
            //  Cập nhật DB: giao dịch thất bại
            await ordersRepository.updatePaymentStatusOrder({
              orderId,
              status: "failed",
            });

            revalidateTag(cacheTags);
            return NextResponse.json({
              RspCode: "00",
              Message: "Fail - Payment error",
            });
          }
        } else {
          return NextResponse.json({
            RspCode: "02",
            Message: "This order has been updated",
          });
        }
      } else {
        return NextResponse.json({ RspCode: "04", Message: "Amount invalid" });
      }
    } else {
      return NextResponse.json({ RspCode: "01", Message: "Order not found" });
    }
  } else {
    return NextResponse.json({ RspCode: "97", Message: "Checksum failed" });
  }
}
