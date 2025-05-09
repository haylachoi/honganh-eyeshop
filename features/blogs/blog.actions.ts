"use server";

import { getAuthActionClient } from "@/lib/actions";
import { blogInputSchema, blogUpdateSchema } from "./blog.validators";
import blogsRepository from "@/lib/db/repositories/blogs";
import userRepository from "@/lib/db/repositories/user";
import { ERROR_MESSAGES } from "@/constants/messages.constants";
import { revalidateTag } from "next/cache";
import { z } from "zod";
import {
  deleteFile,
  writeFileToDisk,
  writeImageSourcesToDisk,
} from "@/lib/server-utils";
import { NotFoundError } from "@/lib/error";
import { removeDiacritics } from "@/lib/utils";
import { CACHE_CONFIG } from "@/cache/cache.constant";
import next_cache from "@/cache";
import { validateAction } from "./blog.utils";

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
    const user = await next_cache.users.getSafeUserInfo({ id: authorId });

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
            identity: rest.slug,
          })
        : wallImage;

    const imageSourcesMapping = await writeImageSourcesToDisk({
      imageSources: imageSources,
      to: "blogs",
      identity: rest.slug,
    });

    let newContent = content;

    imageSourcesMapping.forEach(({ fileLink, fakeUrl }) => {
      newContent = newContent.replace(fakeUrl, fileLink);
      images.push(fileLink);
    });

    await blogsRepository.createBlog({
      ...rest,
      titleNoAccent: removeDiacritics(rest.title),
      wallImage: wallImageUrl,
      author: newUserInput,
      content: newContent,
      images,
    });

    revalidateTag(blogCacheTags);
  });

export const setPublishedBlogStatusAction = modifyBlogActionClient
  .metadata({
    actionName: "setPublishedBlog",
  })
  .schema(
    z.object({
      ids: z.union([z.string(), z.array(z.string())]),
      isPublished: z.boolean(),
    }),
  )
  .action(async ({ parsedInput, ctx }) => {
    const ids = Array.isArray(parsedInput.ids)
      ? parsedInput.ids
      : [parsedInput.ids];

    const blogs = await Promise.all(ids.map((id) => next_cache.blogs.byId(id)));
    validateAction({ blogs, userId: ctx.userId, scopes: ctx.scopes });

    const result = await blogsRepository.setPublishedStatus(parsedInput);

    revalidateTag(blogCacheTags);
    return result;
  });

export const updateBlogAction = modifyBlogActionClient
  .metadata({
    actionName: "updateBlog",
  })
  .schema(blogUpdateSchema)
  .action(async ({ parsedInput, ctx }) => {
    const {
      authorId,
      wallImage,
      content,
      images,
      imageSources,
      deletedImages,
      ...rest
    } = parsedInput;
    const { userId, scopes } = ctx;

    const blog = await next_cache.blogs.byId(rest.id);
    validateAction({ blogs: [blog], userId, scopes });

    const user = await userRepository.getUserById(authorId);

    if (!user) {
      throw new NotFoundError({
        message: ERROR_MESSAGES.USER.NOT_FOUND,
        resource: "user",
      });
    }

    const wallImageUrl =
      wallImage instanceof File
        ? await writeFileToDisk({
            file: wallImage,
            to: "blogs",
            identity: rest.slug,
          })
        : wallImage;

    const imageSourcesMapping = await writeImageSourcesToDisk({
      imageSources: imageSources,
      to: "blogs",
      identity: rest.slug,
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
      filterQuery: { _id: rest.id },
      updateQuery: {
        $set: {
          ...rest,
          titleNoAccent: removeDiacritics(rest.title),
          author: newUserInput,
          wallImage: wallImageUrl,
          content: newContent,
          images,
        },
      },
    });

    await deleteFile(deletedImages);

    revalidateTag(blogCacheTags);
    return result;
  });

export const deleteBlogAction = deleteBlogActionClient
  .metadata({
    actionName: "deleteBlog",
  })
  .schema(z.union([z.string(), z.array(z.string())]))
  .action(async ({ parsedInput, ctx }) => {
    const ids = Array.isArray(parsedInput) ? parsedInput : [parsedInput];
    const blogs = await Promise.all(ids.map((id) => next_cache.blogs.byId(id)));
    const { userId, scopes } = ctx;

    validateAction({ blogs, userId, scopes });

    const result = await blogsRepository.deleteBlog(parsedInput);
    const deletedImages = blogs.flatMap((blog) => blog.images);
    deletedImages.push(...blogs.map((blog) => blog.wallImage));

    deleteFile(deletedImages);
    revalidateTag(blogCacheTags);
    return result;
  });
