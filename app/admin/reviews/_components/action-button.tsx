import { toast } from "sonner";
import { TOAST_MESSAGES } from "@/constants/messages.constants";
import { useAction } from "next-safe-action/hooks";
import { ThreeDotsMenu } from "@/components/shared/three-dots-menu/index";
import { ThreeDotsMenuButtonItem } from "@/components/shared/three-dots-menu/three-dots-menu-button-item";
import { useGlobalAlertDialog } from "@/components/shared/alert-dialog-provider";
import { onActionError } from "@/lib/actions/action.helper";
import { ReviewWithFullInfoType } from "@/features/reviews/review.type";
import {
  deleteReviewAction,
  hidenReviewAction,
  restoreReviewAction,
} from "@/features/reviews/review.actions";

export const ActionButton = ({
  review,
}: {
  review: ReviewWithFullInfoType;
}) => {
  const { execute: hideReview, isPending: hideReviewPending } = useAction(
    hidenReviewAction,
    {
      onSuccess: () => {
        toast.success(TOAST_MESSAGES.REVIEW.HIDE.SUCCESS);
      },
      onError: onActionError,
    },
  );
  const { execute: restoreReview, isPending: restoreReviewPending } = useAction(
    restoreReviewAction,
    {
      onSuccess: () => {
        toast.success(TOAST_MESSAGES.REVIEW.RESTORE.SUCCESS);
      },
      onError: onActionError,
    },
  );

  const { execute: deleteReview, isPending: deleteReviewPending } = useAction(
    deleteReviewAction,
    {
      onSuccess: () => {
        toast.success(TOAST_MESSAGES.REVIEW.DELETE.SUCCESS);
      },
      onError: onActionError,
    },
  );

  const { showDialog } = useGlobalAlertDialog();

  return (
    <ThreeDotsMenu>
      {review.isDeleted ? (
        <ThreeDotsMenuButtonItem
          action={() =>
            showDialog({
              description: "Bạn có chắc chắn muốn ẩn đánh giá này không?",
              onConfirm: () => restoreReview({ reviewId: review.id }),
            })
          }
          isPending={restoreReviewPending}
        >
          Hiện
        </ThreeDotsMenuButtonItem>
      ) : (
        <ThreeDotsMenuButtonItem
          action={() =>
            showDialog({
              description: "Bạn có chắc chắn muốn ẩn đánh giá này không?",
              onConfirm: () => hideReview({ reviewId: review.id }),
            })
          }
          isPending={hideReviewPending}
        >
          Ẩn
        </ThreeDotsMenuButtonItem>
      )}
      <ThreeDotsMenuButtonItem
        action={() =>
          showDialog({
            description: "Bạn có chắc chắn muốn xóa đánh giá này không?",
            onConfirm: () => deleteReview({ reviewId: review.id }),
          })
        }
        isPending={deleteReviewPending}
      >
        Xóa
      </ThreeDotsMenuButtonItem>
    </ThreeDotsMenu>
  );
};
