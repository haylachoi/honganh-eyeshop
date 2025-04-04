import { ReviewType } from "@/features/reviews/review.type";
import { Star } from "lucide-react";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/vi";
import dayjs from "dayjs";
import { cn } from "@/lib/utils";

export const ReviewsView = ({ reviews }: { reviews: ReviewType[] }) => {
  dayjs.extend(relativeTime);
  dayjs.locale("vi");
  return (
    <ul className="border border-l-8 border-primary bg-background">
      {!reviews.length && (
        <p className="w-full py-2 text-center">Chưa có bình luận nào</p>
      )}
      {reviews.map((review) => (
        <li
          key={review.id}
          className="px-8 py-4 not-last:border-b border-primary"
        >
          <div className="">
            <div className="flex gap-8 items-baseline">
              <p className="text-lg font-medium max-w-10 overflow-ellipsis">
                {review.name}
              </p>
              <p
                className="text-sm text-muted-foreground"
                suppressHydrationWarning
              >
                {dayjs(review.createdAt).fromNow()}
              </p>
            </div>
            <ul className="flex gap-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <li key={i}>
                  <Star
                    className={cn(
                      "size-4 text-yellow-300 fill-current",
                      i > review.rating && "text-muted-foreground fill-none",
                    )}
                  />
                </li>
              ))}
            </ul>
            <p className="mt-4">{review.comment}</p>
          </div>
        </li>
      ))}
    </ul>
  );
  return;
};
