import {
  CheckoutDbInputType,
  CheckoutType,
} from "@/features/checkouts/checkout.types";
import { connectToDatabase } from "..";
import Checkout from "../model/checkout.model";
import { Id } from "@/types";
import { checkoutTypeSchema } from "@/features/checkouts/checkout.validator";
import mongoose from "mongoose";
import { NotFoundError } from "@/lib/error";
import { ERROR_MESSAGES } from "@/constants";

const getCheckoutById = async (id: Id) => {
  await connectToDatabase();
  const result = await Checkout.findById(id).lean();
  const checkout = result ? checkoutTypeSchema.parse(result) : null;
  return checkout;
};
const createCheckout = async (input: CheckoutDbInputType) => {
  await connectToDatabase();

  const result = await Checkout.create(input);
  return result._id.toString();
};

const updateCheckout = async ({
  filter,
  update,
  options,
}: {
  filter: mongoose.FilterQuery<CheckoutType>;
  update: mongoose.UpdateQuery<CheckoutType>;
  options?: mongoose.QueryOptions;
}) => {
  await connectToDatabase();
  const result = await Checkout.findOneAndUpdate(filter, update, options);
  if (!result) {
    throw new NotFoundError({
      resource: "checkout",
      message: ERROR_MESSAGES.CHECKOUT.NOT_FOUND,
    });
  }
};
const checkoutsRepository = {
  getCheckoutById,
  createCheckout,
  updateCheckout,
};

export default checkoutsRepository;
