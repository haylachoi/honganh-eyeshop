import Blogcard from "@/components/shared/blog-card";
import { BlogType } from "@/features/blogs/blog.types";

export const BlogsContent = ({ items }: { items: BlogType[] }) => {
  return (
    <div>
      <ul className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 grid-rows-[auto_1fr] gap-x-8 gap-y-10">
        {items.map((blog) => (
          <li
            key={blog.id}
            className="grid grid-rows-subgrid row-span-2 shadow-sm gap-y-0"
          >
            <Blogcard blog={blog} />
          </li>
        ))}
      </ul>
    </div>
  );
};
