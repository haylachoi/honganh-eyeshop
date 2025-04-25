import { BASE_IMAGES_FOLDER, IMAGES_FOlDERS } from "@/constants";
import { customAlphabet } from "nanoid";
import path from "path";
import fs from "fs/promises";
import { cwd } from "process";
import { CheckoutItemType } from "../checkouts/checkout.types";
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
