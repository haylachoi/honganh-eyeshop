import { toast } from "sonner";
import { TOAST_MESSAGES } from "@/constants/messages.constants";
import { useAction } from "next-safe-action/hooks";
import { ThreeDotsMenu } from "@/components/shared/three-dots-menu/index";
import { useGlobalAlertDialog } from "@/components/shared/alert-dialog-provider";
import { onActionError } from "@/lib/actions/action.helper";
import { ReviewWithFullInfoType } from "@/features/reviews/review.type";
import {
  deleteReviewAction,
  hidenReviewAction,
  restoreReviewAction,
} from "@/features/reviews/review.actions";
import { Button } from "@/components/ui/button";
import { CACHE_CONFIG } from "@/cache/cache.constant";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

const getDialogInfo = (type: "hidden" | "restore" | "delete") => {
  const title = "Thông báo";

  const descriptions: Record<string, string> = {
    hidden: "Đánh giá này đã bị ẩn. Bạn có muốn tiếp tục?",
    restore: "Đánh giá này đã được hoàn tất. Bạn có muốn tiếp tục?",
    delete: "Đánh giá này đã bị xóa. Bạn có muốn tiếp tục?",
  };

  if (descriptions[type]) {
    return {
      title,
      description: descriptions[type],
    };
  }
};

export const ActionButton = ({
  review,
}: {
  review: ReviewWithFullInfoType;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const onClose = () => setIsOpen(false);

  const queryClient = useQueryClient();

  const onSuccess = () => {
    queryClient.invalidateQueries({
      queryKey: [CACHE_CONFIG.REVIEWS.ALL.KEY_PARTS[0]],
      exact: false,
    });
  };

  return (
    <ThreeDotsMenu open={isOpen} onOpenChange={setIsOpen}>
      <div className="flex flex-col gap-0">
        {review.isDeleted ? (
          <ItemButton
            id={review.id}
            label="Hiện"
            action={restoreReviewAction}
            successMessage={TOAST_MESSAGES.REVIEW.RESTORE.SUCCESS}
            onsuccess={onSuccess}
            onClose={onClose}
            dialogInfo={getDialogInfo("restore")}
          />
        ) : (
          <ItemButton
            id={review.id}
            label="Ẩn"
            action={hidenReviewAction}
            successMessage={TOAST_MESSAGES.REVIEW.HIDE.SUCCESS}
            onsuccess={onSuccess}
            onClose={onClose}
            dialogInfo={getDialogInfo("hidden")}
          />
        )}
        <ItemButton
          id={review.id}
          label="Xóa"
          action={deleteReviewAction}
          successMessage={TOAST_MESSAGES.REVIEW.DELETE.SUCCESS}
          onsuccess={onSuccess}
          onClose={onClose}
          dialogInfo={getDialogInfo("delete")}
        />
      </div>
    </ThreeDotsMenu>
  );
};

const ItemButton = ({
  id,
  action,
  successMessage,
  onsuccess,
  onClose,
  dialogInfo,
  label,
}: {
  id: string | string[];
  action: Parameters<typeof useAction>[0];
  successMessage: string;
  onsuccess?: () => void;
  onClose?: () => void;
  dialogInfo?: {
    title: string;
    description: string;
  };
  label: string;
}) => {
  const { execute, isPending } = useAction(action, {
    onSuccess: () => {
      toast.success(successMessage);
      onsuccess?.();
      onClose?.();
    },
    onError: onActionError,
  });

  const { showDialog } = useGlobalAlertDialog();

  return (
    <Button
      className="justify-start px-2 font-normal rounded-sm"
      variant="ghost"
      onClick={() => {
        if (dialogInfo) {
          showDialog({
            title: dialogInfo.title,
            description: dialogInfo.description,
            onConfirm: () => {
              execute({ reviewId: id });
            },
          });
          return;
        }

        execute({ reviewId: id });
      }}
      disabled={isPending}
    >
      {label}
    </Button>
  );
};
