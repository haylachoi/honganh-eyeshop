import React, { Suspense } from "react";
import BlogCreateForm from "./blog-form.create";
import { auth } from "@/features/auth/auth.auth";

const BlogCreatePage = async () => {
  const user = await auth();

  if (!user) return null;

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BlogCreateForm user={user} />
    </Suspense>
  );
};

export default BlogCreatePage;
