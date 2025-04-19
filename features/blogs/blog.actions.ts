"use server";

import { getAuthActionClient } from "@/lib/actions";
import { blogInputSchema, blogUpdateSchema } from "./blog.validators";
import blogsRepository from "@/lib/db/repositories/blogs";
import userRepository from "@/lib/db/repositories/user";
import { ERROR_MESSAGES } from "@/constants";
import { revalidateTag } from "next/cache";
import { z } from "zod";
import { writeFileToDisk, writeMultipleFilesToDisk } from "@/lib/server-utils";
import { NotFoundError } from "@/lib/error";
import { removeDiacritics } from "@/lib/utils";
import { CACHE_CONFIG } from "@/cache/cache.constant";

const resource = "blog";
const blogCacheTags = CACHE_CONFIG.BLOGS.ALL.TAGS[0];

const createBlogActionClient = getAuthActionClient({
  resource,
  action: "create",
});

const modifyBlogActionClient = getAuthActionClient({
  resource,
  action: "modify",
});

const deleteBlogActionClient = getAuthActionClient({
  resource,
  action: "delete",
});

export const createBlogAction = createBlogActionClient
  .metadata({
    actionName: "createBlog",
  })
  .schema(blogInputSchema)
  .action(async ({ parsedInput }) => {
    const { authorId, wallImage, content, images, imageSources, ...rest } =
      parsedInput;
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

    const imageSourcesMapping = await writeMultipleFilesToDisk({
      imageSources: imageSources,
      to: "blogs",
    });

    let newContent = content;

    imageSourcesMapping.forEach(({ fileLink, fakeUrl }) => {
      newContent = newContent.replace(fakeUrl, fileLink);
      images.push(fileLink);
    });

    const result = await blogsRepository.createBlog({
      ...rest,
      titleNoAccent: removeDiacritics(rest.title),
      wallImage: wallImageUrl,
      author: newUserInput,
      content: newContent,
      images,
    });

    revalidateTag(blogCacheTags);

    return result;
  });

export const updateBlogAction = modifyBlogActionClient
  .metadata({
    actionName: "updateBlog",
  })
  .schema(blogUpdateSchema)
  .action(async ({ parsedInput }) => {
    const { authorId, wallImage, content, images, imageSources, ...rest } =
      parsedInput;
    const user = await userRepository.getUserById(authorId);

    if (!user) {
      throw new NotFoundError({
        message: ERROR_MESSAGES.USER.NOT_FOUND,
        resource: "user",
      });
    }

    // todo: delete old image
    const wallImageUrl =
      wallImage instanceof File
        ? await writeFileToDisk({
            file: wallImage,
            to: "blogs",
          })
        : wallImage;

    // todo: delete unused image
    const imageSourcesMapping = await writeMultipleFilesToDisk({
      imageSources: imageSources,
      to: "blogs",
    });

    let newContent = content;

    imageSourcesMapping.forEach(({ fileLink, fakeUrl }) => {
      newContent = newContent.replace(fakeUrl, fileLink);
      images.push(fileLink);
    });

    const newUserInput = {
      _id: user.id,
      name: user.name,
    };

    const result = await blogsRepository.updateBlog({
      ...rest,
      titleNoAccent: removeDiacritics(rest.title),
      author: newUserInput,
      wallImage: wallImageUrl,
      content: newContent,
      images,
    });

    revalidateTag(blogCacheTags);
    return result;
  });

export const deleteBlogAction = deleteBlogActionClient
  .metadata({
    actionName: "deleteBlog",
  })
  .schema(z.union([z.string(), z.array(z.string())]))
  .action(async ({ parsedInput }) => {
    const result = await blogsRepository.deleteBlog(parsedInput);
    revalidateTag(blogCacheTags);
    return result;
  });
