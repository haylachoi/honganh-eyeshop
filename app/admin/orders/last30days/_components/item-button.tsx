import { toast } from "sonner";
import { useAction } from "next-safe-action/hooks";
import { onActionError } from "@/lib/actions/action.helper";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import React from "react";
import { useGlobalAlertDialog } from "@/components/shared/alert-dialog-provider";

export const ItemButton = ({
  id,
  action,
  successMessage,
  onClose,
  defaultDate,
  dialogInfo,
  label,
  reason,
  withReason = false,
}: {
  id: string | string[];
  action: Parameters<typeof useAction>[0];
  successMessage: string;
  onClose?: () => void;
  defaultDate?: Date;
  dialogInfo?: {
    title: string;
    description: string;
  };
  label: string;
  reason?: string;
  withReason?: boolean;
}) => {
  const { execute, isPending } = useAction(action, {
    onSuccess: () => {
      toast.success(successMessage);
      onClose?.();
    },
    onError: onActionError,
  });
  const date = (defaultDate ? new Date(defaultDate) : new Date())
    .toISOString()
    .split("T")[0];

  const { showDialog } = useGlobalAlertDialog();

  return (
    <form
      action={(formData) => {
        const date = formData.get("date") as string;
        const reason = formData.get("reason") as string;
        const params: {
          id: string | string[];
          date: Date;
          reason?: string;
        } = { id, date: new Date(date) };
        if (reason) {
          params.reason = reason;
        }
        if (dialogInfo) {
          showDialog({
            title: dialogInfo.title,
            description: dialogInfo.description,
            onConfirm: () => {
              execute(params);
            },
          });
          return;
        }

        execute(params);
      }}
      className="grid grid-cols-[auto_1fr] gap-2"
    >
      {withReason && (
        <Input
          type="text"
          className="col-span-2"
          placeholder="Lý do"
          name="reason"
          defaultValue={reason ?? ""}
        />
      )}
      <Input type="date" name="date" defaultValue={date} />
      <Button type="submit" variant="outline" disabled={isPending}>
        {label}
      </Button>
    </form>
  );
};
