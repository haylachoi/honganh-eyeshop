import path from "path";
import { writeFile } from "fs/promises";
import { ImageSourceType } from "@/features/blogs/blog.types";
import fs from "fs/promises";
import { BASE_IMAGES_FOLDER } from "@/constants";

// todo: move others server utils to here

export const getPublicDir = () => path.join(process.cwd(), "public");
export const getFullPublicAssetPath = (fileName: string) => {
  return path.join(getPublicDir(), fileName);
};

// warning: identity is slug is not recommend, because it can be changed
export const writeFileWithRandomNameToDisk = async ({
  file,
  to,
  identity,
}: {
  file: File;
  to: "products" | "blogs" | "icons";
  identity?: string;
}) => {
  const data = await file.arrayBuffer();
  const buffer = Buffer.from(data);
  const fileName = `${identity}_${crypto.randomUUID()}${path.extname(file.name)}`;
  const basePath = path.join(BASE_IMAGES_FOLDER, to, fileName);
  const fileLink = path.join("/", basePath);
  const filePath = path.join(process.cwd(), "public", basePath);

  await writeFile(filePath, buffer);
  return fileLink;
};

// identity is slug is not recommend, because it can be changed
export const writeImageSourcesToDisk = async ({
  imageSources,
  to,
  identity,
}: {
  imageSources: ImageSourceType[];
  to: "products" | "blogs" | "supportPages";
  identity?: string;
}) => {
  const savedFiles: {
    fileLink: string;
    fakeUrl: string;
  }[] = [];

  for (const { file, fakeUrl } of imageSources) {
    const data = await file.arrayBuffer();
    const buffer = Buffer.from(data);
    const fileName = `${identity}_${crypto.randomUUID()}${path.extname(file.name)}`;
    const basePath = path.join("images", to, fileName);
    const fileLink = path.join("/", basePath);
    const filePath = path.join(process.cwd(), "public", basePath);

    await writeFile(filePath, buffer);

    savedFiles.push({ fileLink, fakeUrl });
  }

  return savedFiles;
};

export const writeStringToFile = async ({
  content,
  fileName,
  to,
}: {
  content: string;
  fileName: string;
  to?: string;
}) => {
  const baseDir = path.join(process.cwd(), "public");
  const uploadDir = to ? path.join(baseDir, to) : baseDir;
  const filePath = path.join(uploadDir, fileName);

  await writeFile(filePath, content, "utf-8");

  const relativePath = to ? path.posix.join("/", to, fileName) : `/${fileName}`;
  return relativePath;
};

export const deleteFile = async (
  fileLinks: string | string[],
): Promise<void> => {
  const links = Array.isArray(fileLinks) ? fileLinks : [fileLinks];

  if (links.length === 0) {
    console.warn("Không có file nào để xóa.");
    return;
  }

  const deletePromises = links.map(async (fileLink) => {
    const filePath = path.join(process.cwd(), "public", fileLink);

    return fs
      .access(filePath)
      .then(() => fs.unlink(filePath))
      .then(() => console.log(`Đã xóa: ${filePath}`))
      .catch((err) => {
        if (err.code === "ENOENT") {
          console.warn(`Không tìm thấy: ${fileLink}`);
        } else {
          console.error(`Lỗi khi xóa ${fileLink}:`, err);
        }
      });
  });

  await Promise.all(deletePromises);
};
