import React from "react";
import { Heading } from "../heading";
import { getRecentBlogs } from "@/features/blogs/blog.queries";
import { RecentBlogsContent } from "./recent-blogs-content";
import Link from "next/link";
import { getLink } from "@/lib/utils";

const RecentBlog = async () => {
  const result = await getRecentBlogs();
  const recentBlogs = result.success ? result.data : [];
  return (
    <div className="container">
      <Link href={getLink.blog.home()}>
        <Heading title="Tin tức" />
      </Link>
      <RecentBlogsContent blogs={recentBlogs} />
    </div>
  );
};

export default RecentBlog;
