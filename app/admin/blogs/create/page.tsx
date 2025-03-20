import React from "react";
import BlogCreateForm from "./blog-form.create";
import { auth } from "@/features/auth/auth.query";

const BlogCreatePage = async () => {
  const user = await auth();

  if (!user) return null;

  return <BlogCreateForm user={user} />;
};

export default BlogCreatePage;
