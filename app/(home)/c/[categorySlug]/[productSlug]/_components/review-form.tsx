import { TOAST_MESSAGES } from "@/constants";
import { ProductType } from "@/features/products/product.types";
import {
  createReviewAction,
  getUserReviewStatusAction,
} from "@/features/reviews/review.actions";
import { ReviewType } from "@/features/reviews/review.type";
import { ReviewInputSchema } from "@/features/reviews/review.validator";
import { onActionError } from "@/lib/actions/action.helper";
import { Star } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import React from "react";
import { toast } from "sonner";

export const ReviewForm = ({ product }: { product: ProductType }) => {
  const [value, setValue] = React.useState(5);
  const [reviewStatus, setReviewStatus] = React.useState<{
    review: ReviewType | null;
    canReview: boolean;
  }>();
  const { execute: getReviewStatus } = useAction(getUserReviewStatusAction, {
    onSuccess: (result) => {
      if (result.data) {
        setReviewStatus(result.data);
      }
    },
    onError: onActionError,
  });

  const { execute } = useAction(createReviewAction, {
    onSuccess: () => {
      toast.success(TOAST_MESSAGES.REVIEW.CREATE.SUCCESS);
    },
    onError: onActionError,
  });

  React.useEffect(() => {
    getReviewStatus({ productId: product.id });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { review, canReview } = reviewStatus || {};

  const onSubmit = (formData: FormData) => {
    const data = Object.fromEntries(formData.entries());
    data.productId = product.id;
    const parsedData = ReviewInputSchema.parse(data);
    execute(parsedData);
  };

  return (
    <>
      {canReview && !review && (
        <form className="flex flex-col gap-4" action={onSubmit}>
          <h4>Hãy để để lại đánh giá và bình luận về sản phẩm này</h4>
          <ul className="flex gap-2">
            {[1, 2, 3, 4, 5].map((rating) => (
              <li key={rating}>
                <label className="text-gray-600 cursor-pointer">
                  <input
                    className="hidden"
                    type="radio"
                    name="rating"
                    value={rating}
                    onClick={() => setValue(rating)}
                  />
                  <Star
                    className={
                      rating <= value ? "text-yellow-200" : "text-gray-300"
                    }
                    fill={rating <= value ? "currentColor" : "none"}
                  />
                </label>
              </li>
            ))}
          </ul>
          <div>
            <input
              className="px-4 py-2 w-full border border-input"
              type="text"
              name="comment"
              placeholder="Bình luận"
              defaultValue="Rất tốt"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 border border-foreground cursor-pointer hover:bg-primary hover:text-primary-foreground"
          >
            Đánh giá
          </button>
        </form>
      )}
    </>
  );
};
