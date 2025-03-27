"use server";

import { authActionClient } from "@/lib/actions";
import { blogInputSchema, blogUpdateSchema } from "./blog.validators";
import blogsRepository from "@/lib/db/repositories/blogs";
import userRepository from "@/lib/db/repositories/user";
import { CACHE, ERROR_MESSAGES } from "@/constants";
import { revalidateTag } from "next/cache";
import { z } from "zod";
import { writeFileToDisk } from "@/lib/server-utils";
import { NotFoundError } from "@/lib/error";

export const createBlogAction = authActionClient
  .metadata({
    actionName: "createBlog",
  })
  .schema(blogInputSchema)
  .action(async ({ parsedInput }) => {
    const { authorId, wallImage, ...rest } = parsedInput;
    const user = await userRepository.getUserById(authorId);

    if (!user) {
      throw new NotFoundError({
        resource: "user",
        message: ERROR_MESSAGES.USER.NOT_FOUND,
      });
    }

    const newUserInput = {
      _id: user.id,
      name: user.name,
    };

    const wallImageUrl =
      wallImage instanceof File
        ? await writeFileToDisk({
            file: wallImage,
            to: "blogs",
          })
        : wallImage;

    const result = await blogsRepository.createBlog({
      ...rest,
      wallImage: wallImageUrl,
      author: newUserInput,
    });

    revalidateTag(CACHE.BLOGS.ALL.TAGS);

    return result;
  });

export const updateBlogAction = authActionClient
  .metadata({
    actionName: "updateBlog",
  })
  .schema(blogUpdateSchema)
  .action(async ({ parsedInput }) => {
    const { authorId, ...rest } = parsedInput;
    const user = await userRepository.getUserById(authorId);

    if (!user) {
      throw new NotFoundError({
        message: ERROR_MESSAGES.USER.NOT_FOUND,
        resource: "user",
      });
    }

    const newUserInput = {
      _id: user.id,
      name: user.name,
    };

    const result = await blogsRepository.updateBlog({
      ...rest,
      author: newUserInput,
    });

    revalidateTag(CACHE.BLOGS.ALL.TAGS);
    return result;
  });

export const deleteBlogAction = authActionClient
  .metadata({
    actionName: "deleteBlog",
  })
  .schema(z.union([z.string(), z.array(z.string())]))
  .action(async ({ parsedInput }) => {
    const result = await blogsRepository.deleteBlog(parsedInput);
    revalidateTag(CACHE.BLOGS.ALL.TAGS);
    return result;
  });
