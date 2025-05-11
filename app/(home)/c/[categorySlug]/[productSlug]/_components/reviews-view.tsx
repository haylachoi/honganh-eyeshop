import { ReviewType } from "@/features/reviews/review.type";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/vi";
import dayjs from "dayjs";
import { StarRatingDisplay } from "@/components/shared/star-rating-display";

export const ReviewsView = ({ reviews }: { reviews: ReviewType[] }) => {
  dayjs.extend(relativeTime);
  dayjs.locale("vi");
  return (
    <ul className="border border-l-8 border-primary bg-background">
      {!reviews.length && (
        <p className="w-full py-2 text-center">Chưa có bình luận nào</p>
      )}
      {reviews
        .filter((review) => !!review.comment)
        .map((review) => (
          <li
            key={review.id}
            className="px-8 py-4 not-last:border-b border-primary"
          >
            <div className="">
              <div className="flex gap-8 items-baseline">
                <p className="text-lg font-medium w-40 overflow-hidden whitespace-nowrap text-ellipsis">
                  {review.name}
                </p>
                <p
                  className="text-sm text-muted-foreground"
                  suppressHydrationWarning
                >
                  {dayjs(review.createdAt).fromNow()}
                </p>
              </div>
              <StarRatingDisplay rating={review.rating} />
              <p className="mt-4">{review.comment}</p>
            </div>
          </li>
        ))}
    </ul>
  );
};
