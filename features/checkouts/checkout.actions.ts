"use server";

import { customerActionClient } from "@/lib/actions";
import { checkoutInputSchema } from "./checkout.validator";
import checkoutsRepository from "@/lib/db/repositories/checkouts";
import { z } from "zod";
import { IdSchema } from "@/lib/validator";
import {
  AuthenticationError,
  NotFoundError,
  ValidationError,
} from "@/lib/error";
import { ERROR_MESSAGES } from "@/constants/messages.constants";
import { validateItems } from "./checkout.utils";

export const createCheckoutAction = customerActionClient
  .metadata({
    actionName: "createCheckoutAction",
  })
  .schema(checkoutInputSchema)
  .action(async ({ parsedInput, ctx }) => {
    const checkedItems = await validateItems({ items: parsedInput.items });
    if (!checkedItems.every((item) => item.available)) {
      throw new ValidationError({
        resource: "checkout",
        message: ERROR_MESSAGES.CHECKOUT.ITEM_NOT_AVAILABLE,
        detail: checkedItems.filter((item) => !item.available),
      });
    }

    const result = await checkoutsRepository.createCheckout({
      ...parsedInput,
      userId: ctx.userId,
      total: parsedInput.items.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0,
      ),
      shippingFee: 0,
      isOrderd: false,
    });
    return result;
  });

export const updateCheckoutAction = customerActionClient
  .metadata({
    actionName: "updateCheckoutAction",
  })
  .schema(
    z.object({
      id: IdSchema,
      name: z.string(),
      value: z.string().optional(),
    }),
  )
  .action(async ({ parsedInput, ctx }) => {
    const checkout = await checkoutsRepository.getCheckoutById(parsedInput.id);
    if (!checkout) {
      throw new NotFoundError({
        resource: "checkout",
        message: ERROR_MESSAGES.CHECKOUT.NOT_FOUND,
      });
    }
    if (checkout.userId && checkout.userId !== ctx.userId) {
      throw new AuthenticationError({
        resource: "checkout",
      });
    }

    const result = await checkoutsRepository.updateCheckout({
      filter: { _id: parsedInput.id },
      update: { $set: { [parsedInput.name]: parsedInput.value } },
      options: { new: true },
    });
    return result;
  });
