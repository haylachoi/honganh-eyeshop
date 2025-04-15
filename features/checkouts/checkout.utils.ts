import productRepository from "@/lib/db/repositories/products";
import { CheckoutItemType, ValidatedItemInfo } from "./checkout.types";

export const validateItems = async ({
  items,
}: {
  items: CheckoutItemType[];
}) => {
  const { productIds, variantIds } = items.reduce<{
    productIds: string[];
    variantIds: string[];
  }>(
    (acc, item) => {
      acc.productIds.push(item.productId);
      acc.variantIds.push(item.variantId);
      return acc;
    },
    { productIds: [], variantIds: [] },
  );

  const products = await productRepository.getProductsByQueryAndProjection({
    query: {
      _id: { $in: productIds },
      "variants.uniqueId": { $in: variantIds },
      isAvailable: true,
    },
    projection: {
      _id: 1,
      slug: 1,
      category: 1,
      variants: 1,
    },
  });

  const checkedItems: ValidatedItemInfo[] = items.map((item) => {
    const product = products.find((p) => p._id.toString() === item.productId);
    const info = {
      productId: item.productId,
      variantId: item.variantId,
      quantity: item.quantity,
    };
    if (!product) {
      return {
        product: info,
        available: false,
        message: "Sản phẩm không tồn tại",
      };
    }

    const variant = product.variants.find((v) => v.uniqueId === item.variantId);
    if (!variant) {
      return {
        product: info,
        available: false,
        message: "Biến thể không tồn tại",
      };
    }

    // todo: compare attributes

    if (variant.countInStock >= item.quantity) {
      return { product: info, available: true, message: "Đủ hàng" };
    } else {
      return {
        product: info,
        available: false,
        message: "Không đủ hàng",
        availableStock: variant.countInStock,
      };
    }
  });

  return checkedItems;
};
