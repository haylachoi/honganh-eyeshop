import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";

const VALIDATION_ERROR_MESSAGE = "Your input is invalid";
const DEFAULT_ERROR_MESSAGE = "Something went wrong";

export const onActionError: NonNullable<
  Parameters<typeof useAction>[1]
>["onError"] = ({ error }) => {
  if (error.validationErrors) {
    toast.error(VALIDATION_ERROR_MESSAGE);
    return;
  }

  if (error.serverError && typeof error.serverError === "string") {
    toast.error(error.serverError);
    return;
  }

  toast.error(DEFAULT_ERROR_MESSAGE);
};
