import { BlogType } from "@/features/blogs/blog.types";
import { dateFormatter } from "@/lib/utils";
import { SquarePen, Timer } from "lucide-react";
import Image from "next/image";

const BlogView = ({ blog }: { blog: BlogType }) => {
  return (
    <div className="container">
      <h1 className="text-5xl font-bold">{blog.title}</h1>
      <div className="flex items-center gap-6">
        <p className="flex gap-2 items-center">
          <SquarePen /> {blog.author.name}
        </p>
        <p className="flex gap-2 items-center">
          <Timer />
          {dateFormatter.format(new Date(blog.date))}
        </p>
      </div>
      {blog.wallImage && (
        <Image
          src={blog.wallImage}
          alt="Wall Image"
          width={1000}
          height={500}
        />
      )}
      <div
        className="mt-6"
        dangerouslySetInnerHTML={{ __html: blog.content }}
      ></div>
    </div>
  );
};

export default BlogView;
