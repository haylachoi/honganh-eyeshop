"use client";

import { createFilterAction } from "@/features/filter/filter.actions";
import {
  deleteFakeProducts,
  generateFakeProducts,
} from "@/features/products/product.actions";
import { onActionError } from "@/lib/actions/action.helper";
import { useAction } from "next-safe-action/hooks";

export const OthersContent = () => {
  const { execute: executeCreateFilter } = useAction(createFilterAction, {
    onSuccess: (result) => {
      console.log(result);
    },
    onError: onActionError,
  });

  const { execute: executeGenerateFakeProducts } =
    useAction(generateFakeProducts);
  const { execute: executeDeleteFakeProducts } = useAction(deleteFakeProducts);

  return (
    <div>
      <button
        className="px-2 py-1 cursor-pointer border border-foreground"
        onClick={() => executeCreateFilter()}
      >
        Create Filter
      </button>
      <button
        className="px-2 py-1 cursor-pointer border border-foreground"
        onClick={() => executeGenerateFakeProducts()}
      >
        generate fake products
      </button>
      <button
        className="px-2 py-1 cursor-pointer border border-foreground"
        onClick={() => executeDeleteFakeProducts()}
      >
        delete fake products
      </button>
    </div>
  );
};
