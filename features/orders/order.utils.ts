import { BASE_IMAGES_FOLDER, IMAGES_FOlDERS } from "@/constants";
import { customAlphabet } from "nanoid";
import path from "path";
import fs from "fs/promises";
import { cwd } from "process";
import { CheckoutItemType } from "../checkouts/checkout.types";
import qs from "qs";
import crypto from "crypto";
import moment from "moment-timezone";

const nanoid = customAlphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", 10);

export const generateOrderId = () => {
  const now = new Date();
  const datePart = now.toISOString().slice(0, 10).replace(/-/g, ""); // YYYYMMDD
  const randomPart = nanoid();
  return `ORD-${datePart}-${randomPart}`;
};
export const createOrderImages = async ({
  items,
}: {
  items: CheckoutItemType[];
}): Promise<CheckoutItemType[]> => {
  const basePath = path.join(cwd(), "public");
  const folder: (typeof IMAGES_FOlDERS)[number] = "orders";

  const updatedItems = await Promise.all(
    items.map(async (item) => {
      const fileName = path.basename(item.imageUrl);
      const source = path.join(basePath, item.imageUrl);
      const destination = path.join(
        basePath,
        BASE_IMAGES_FOLDER,
        folder,
        fileName,
      );
      const newProductUrl = `/${BASE_IMAGES_FOLDER}/${folder}/${fileName}`;

      try {
        // Kiểm tra nếu file chưa tồn tại thì mới copy
        await fs.access(destination).catch(async () => {
          await fs.copyFile(source, destination);
          console.log(`Copied: ${fileName}`);
        });
      } catch (err) {
        console.error(`Lỗi xử lý ảnh ${fileName}:`, err);
      }

      return {
        ...item,
        productUrl: newProductUrl,
      };
    }),
  );

  return updatedItems;
};

export function sortObjectVnPay(
  obj: Record<string, string>,
): Record<string, string> {
  const sorted: Record<string, string> = {};
  const keys = Object.keys(obj).map(encodeURIComponent).sort();

  for (const key of keys) {
    const decodedKey = decodeURIComponent(key);
    const encodedValue = encodeURIComponent(obj[decodedKey]).replace(
      /%20/g,
      "+",
    );
    sorted[decodedKey] = encodedValue;
  }

  return sorted;
}

export const createVnpayUrl = async ({
  orderId,
  amount,
}: {
  orderId: string;
  amount: number;
}) => {
  const clientIp = "127.0.0.1";
  const tmnCode = process.env.VNP_TMNCODE!;
  const secretKey = process.env.VNP_HASH_SECRET!;
  const vnpUrl = process.env.VNP_URL!;
  const returnUrl = `${process.env.BASE_URL}/checkout/vnpay-return`;

  // Định dạng theo Asia/Ho_Chi_Minh chuẩn VNPAY yêu cầu
  const createDate = moment().tz("Asia/Ho_Chi_Minh").format("YYYYMMDDHHmmss");

  const vnp_Params: Record<string, string> = {
    vnp_Version: "2.1.0",
    vnp_Command: "pay",
    vnp_TmnCode: tmnCode,
    vnp_Locale: "vn",
    vnp_CurrCode: "VND",
    vnp_TxnRef: orderId,
    vnp_OrderInfo: `Thanh toan don hang ${orderId}`,
    vnp_OrderType: "other",
    vnp_Amount: (amount * 100).toString(),
    vnp_ReturnUrl: returnUrl,
    vnp_IpAddr: clientIp,
    vnp_CreateDate: createDate,
  };

  // Sắp xếp tham số theo thứ tự alphabet
  const sortedParams = sortObjectVnPay(vnp_Params);

  const signData = qs.stringify(sortedParams, { encode: false });
  const hmac = crypto.createHmac("sha512", secretKey);
  const secureHash = hmac.update(signData).digest("hex");

  // Thêm secureHash vào cuối URL
  const paymentUrl = `${vnpUrl}?${signData}&vnp_SecureHash=${secureHash}`;
  return paymentUrl;
};
