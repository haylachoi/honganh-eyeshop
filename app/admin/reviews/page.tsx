import { getAllReviewsWithFullInfo } from "@/features/reviews/review.queries";
import { AdminReviewsHome } from "./_components/admin-reviews-home";

const AdminReviewsHomePage = async () => {
  const result = await getAllReviewsWithFullInfo();
  const reviews = result.success ? result.data : [];
  return (
    <div>
      <AdminReviewsHome reviews={reviews} />
    </div>
  );
};

export default AdminReviewsHomePage;
