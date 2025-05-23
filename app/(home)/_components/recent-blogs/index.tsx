import React from "react";
import { Heading } from "../heading";
import { getRecentPublishedBlogs } from "@/features/blogs/blog.queries";
import { RecentBlogsContent } from "./recent-blogs-content";
import Link from "next/link";
import { getLink } from "@/lib/utils";
import { PAGE_SIZE } from "@/constants";

const RecentBlog = async () => {
  const result = await getRecentPublishedBlogs({
    limit: PAGE_SIZE.BLOGS.SM,
    skip: 0,
  });
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
