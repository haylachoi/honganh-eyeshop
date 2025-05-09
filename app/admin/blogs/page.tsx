import { getAllBlogs } from "@/features/blogs/blog.queries";
import BlogsView from "./_components/blogs-view";
import { ADMIN_ENDPOINTS } from "@/constants/endpoints.constants";
import AdminMainTopSection from "@/components/shared/admin/main-top-section";

const BlogPage = async () => {
  const result = await getAllBlogs();

  if (!result.success) {
    return <div>Error</div>;
  }
  const blogs = result.data;

  return (
    <div>
      <AdminMainTopSection
        title="Danh sách bài viết"
        addNewLink={`${ADMIN_ENDPOINTS.BLOGS}/create`}
      />
      <BlogsView blogs={blogs} />
    </div>
  );
};

export default BlogPage;
