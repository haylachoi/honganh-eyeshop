import React from "react";
import { Heading } from "../heading";
import { getRecentBlogs } from "@/features/blogs/blog.queries";
import { RecentBlogsContent } from "./recent-blogs-content";

const RecentBlog = async () => {
  const result = await getRecentBlogs();
  const recentBlogs = result.success ? result.data : [];
  return (
    <div className="container">
      <Heading title="Tin tức" />
      <RecentBlogsContent blogs={recentBlogs} />
    </div>
  );
};

export default RecentBlog;
