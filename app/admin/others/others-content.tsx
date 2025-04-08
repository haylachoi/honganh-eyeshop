"use client";

import { createFilterAction } from "@/features/filter/filter.actions";
import { onActionError } from "@/lib/actions/action.helper";
import { useAction } from "next-safe-action/hooks";

export const OthersContent = () => {
  const { execute } = useAction(createFilterAction, {
    onSuccess: (result) => {
      console.log(result);
    },
    onError: onActionError,
  });
  return (
    <div>
      <button
        className="px-2 py-1 cursor-pointer border border-foreground"
        onClick={() => execute()}
      >
        Create Filter
      </button>
    </div>
  );
};
