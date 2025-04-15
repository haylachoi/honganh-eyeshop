import { CartInputType, UpdateCartItemMode } from "@/features/cart/cart.types";
import Cart from "../model/cart.model";
import {
  cartItemDisplaySchema,
  cartItemTypeSchema,
  cartTypeSchema,
} from "@/features/cart/cart.validator";
import { CACHE, ERROR_MESSAGES } from "@/constants";
import { connectToDatabase } from "..";
import { unstable_cache } from "next/cache";
import { NotFoundError, ServerError } from "@/lib/error";
import { Id } from "@/types";
import mongoose from "mongoose";
import Product from "../model/product.model";

const getCartByUserId = unstable_cache(
  async (userId: string) => {
    await connectToDatabase();
    const result = await Cart.findOne({ userId }).lean();
    if (!result) return;
    const cart = cartTypeSchema.parse(result);
    return cart;
  },
  CACHE.CART.USER.KEY_PARTS,
  {
    tags: [CACHE.CART.USER.TAGS],
    revalidate: 3600,
  },
);

const getCartItemByProductIdAndVariantId = async (
  items: {
    productId: string;
    variantId: string;
    quantity: number;
  }[],
) => {
  await connectToDatabase();
  const cartItems = await Product.aggregate([
    {
      $match: {
        _id: {
          $in: items.map((item) => new mongoose.Types.ObjectId(item.productId)),
        },
        isAvailable: true,
      },
    },
    {
      $addFields: {
        variant: {
          $filter: {
            input: "$variants",
            as: "variant",
            cond: {
              $in: ["$$variant.uniqueId", items.map((item) => item.variantId)],
            },
          },
        },
      },
    },
    {
      $unwind: "$variant",
    },
    {
      $match: {
        $expr: {
          $in: [
            {
              $concat: [{ $toString: "$_id" }, "_", "$variant.uniqueId"],
            },
            items.map((i) => `${i.productId}_${i.variantId}`),
          ],
        },
      },
    },
    {
      $project: {
        _id: 0,
        productId: "$_id",
        name: 1,
        slug: 1,
        category: 1,
        brand: 1,
        tags: 1,
        variant: {
          uniqueId: "$variant.uniqueId",
          attributes: "$variant.attributes",
          images: "$variant.images",
          price: "$variant.price",
          originPrice: "$variant.originPrice",
          countInStock: "$variant.countInStock",
        },
      },
    },
  ]);

  const result = cartItems.map((item) => {
    const matched = items.find(
      (i) =>
        i.productId === item.productId.toString() &&
        i.variantId === item.variant.uniqueId,
    );

    const quantity = matched?.quantity ?? 1;
    const countInStock = item.variant.countInStock;

    return cartItemDisplaySchema.parse({
      ...item,
      quantity: Math.min(quantity, countInStock),
    });
  });

  return result;
};

const getCartWithProductDetails = async ({ userId }: { userId: string }) => {
  await connectToDatabase();
  const cartItems = await Cart.aggregate([
    {
      $match: { userId: new mongoose.Types.ObjectId(userId) },
    },
    {
      $unwind: "$items",
    },
    {
      $lookup: {
        from: "products",
        localField: "items.productId",
        foreignField: "_id",
        as: "productDetails",
      },
    },
    { $unwind: "$productDetails" },
    { $unwind: "$productDetails.variants" },
    {
      $match: {
        "productDetails.isAvailable": true, // filter available product
        $expr: {
          $eq: ["$items.variantId", "$productDetails.variants.uniqueId"],
        },
      },
    },
    {
      $project: {
        _id: 0,
        userId: 1,
        productId: "$items.productId",
        quantity: "$items.quantity",
        name: "$productDetails.name",
        slug: "$productDetails.slug",
        category: "$productDetails.category",
        brand: "$productDetails.brand",
        tags: "$productDetails.tags",
        variant: {
          uniqueId: "$productDetails.variants.uniqueId",
          attributes: "$productDetails.variants.attributes",
          images: "$productDetails.variants.images",
          stock: "$productDetails.variants.countInStock",
          price: "$productDetails.variants.price",
          originPrice: "$productDetails.variants.originPrice",
          countInStock: "$productDetails.variants.countInStock",
        },
      },
    },
  ]);
  const result = cartItems.map((item) => cartItemDisplaySchema.parse(item));

  return result;
};

const getCartItem = async (input: {
  userId: string;
  productId: string;
  variantId: string;
}) => {
  await connectToDatabase();
  const result = await Cart.findOne(
    {
      userId: input.userId,
      "items.productId": input.productId,
      "items.variantId": input.variantId,
    },
    {
      "items.$": 1,
    },
  ).lean();

  if (!result) {
    return;
  }

  return cartItemTypeSchema.parse(result.items[0]);
};

const createCart = async ({ userId }: { userId: Id }) => {
  await connectToDatabase();
  const result = await Cart.create({ userId });
  return cartTypeSchema.parse(result);
};

const updateItemQuantity = async ({
  userId,
  item,
  mode,
}: CartInputType & { mode: UpdateCartItemMode }) => {
  await connectToDatabase();

  const updateQuery =
    mode === "modify"
      ? { $inc: { "items.$.quantity": item.quantity } }
      : { $set: { "items.$.quantity": item.quantity } };

  const result = await Cart.findOneAndUpdate(
    {
      userId,
      "items.productId": item.productId,
      "items.variantId": item.variantId,
    },
    updateQuery,
    { new: true },
  );

  if (!result) {
    throw new ServerError({});
  }

  return cartTypeSchema.parse(result);
};

const addItemToCart = async ({ userId, item }: CartInputType) => {
  await connectToDatabase();
  const result = await Cart.findOneAndUpdate(
    { userId },
    { $push: { items: item } },
    { new: true, upsert: true, setDefaultsOnInsert: true },
  );

  if (!result) {
    throw new ServerError({});
  }

  return cartTypeSchema.parse(result);
};

const removeCartItem = async ({
  userId,
  productId,
  variantId,
}: {
  userId: string;
  productId: string;
  variantId: string;
}) => {
  await connectToDatabase();

  const updatedCart = await Cart.findOneAndUpdate(
    { userId },
    {
      $pull: { items: { productId, variantId } },
    },
    { new: true },
  );

  if (!updatedCart) {
    throw new NotFoundError({
      resource: "cart",
      message: ERROR_MESSAGES.CART.NOT_FOUND,
    });
  }

  return cartTypeSchema.parse(updatedCart);
};

export const cartRepository = {
  getCartWithProductDetails,
  getCartByUserId,
  getCartItem,
  getCartItemByProductIdAndVariantId,
  createCart,
  addItemToCart,
  updateItemQuantity,
  removeCartItem,
};
