import { BlogType } from "@/features/blogs/blog.types";
import { dateFormatter, getLink } from "@/lib/utils";
import { CalendarDays } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export const Blogcard = ({ blog }: { blog: BlogType }) => {
  return (
    <>
      <div className="relative">
        <Link
          href={getLink.blog.view({ blogSlug: blog.slug })}
          className="block"
        >
          <Image
            className="w-full aspect-[18/9]"
            src={blog.wallImage}
            alt={blog.title}
            width={200}
            height={100}
          />
        </Link>
        <span className="absolute top-1 right-1 p-1 flex gap-2 items-center text-sm bg-background text-muted-foreground">
          <CalendarDays className="size-4" />
          {dateFormatter.format(new Date(blog.updatedAt))}
        </span>
      </div>
      <div className="p-2 mt-3">
        <Link
          href={getLink.blog.view({ blogSlug: blog.slug })}
          className="hover:underline"
        >
          <h2 className="text-2xl text-primary">{blog.title}</h2>
        </Link>
      </div>
    </>
  );
};

export default Blogcard;
