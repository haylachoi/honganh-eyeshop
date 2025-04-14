import { BlogType } from "@/features/blogs/blog.types";
import { dateFormatter, getLink, truncateText } from "@/lib/utils";
import { CalendarDays } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const BlogPreview = ({ blog }: { blog: BlogType }) => {
  return (
    <>
      <div className="">
        <Link
          href={getLink.blog.view({ blogSlug: blog.slug })}
          className="relative block"
        >
          <Image
            className="w-full aspect-[18/9]"
            src={blog.wallImage}
            alt={blog.title}
            width={200}
            height={100}
          />
          <span className="absolute top-2 left-2 p-2 flex gap-2 items-center text-sm bg-background text-muted-foreground">
            <CalendarDays className="size-4" />
            {dateFormatter.format(new Date(blog.updatedAt))}
          </span>
        </Link>
      </div>
      <div className="p-2">
        <Link
          href={getLink.blog.view({ blogSlug: blog.slug })}
          className="hover:underline"
        >
          <h2 className="text-2xl text-primary">{blog.title}</h2>
        </Link>
      </div>
      <div className="p-2">
        {truncateText({ text: blog.description, maxLength: 80 })}
      </div>
      <Link
        // className="block p-2 w-full text-center"
        className="block p-2 w-full bg-primary text-primary-foreground text-center"
        href={getLink.blog.view({ blogSlug: blog.slug })}
      >
        Đọc thêm
      </Link>
    </>
  );
};

export default BlogPreview;
