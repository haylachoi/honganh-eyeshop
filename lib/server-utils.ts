import path from "path";
import { writeFile } from "fs/promises";
import { ImageSourceType } from "@/features/blogs/blog.types";
import fs from "fs/promises";

// todo: move others server utils to here
export const writeFileToDisk = async ({
  file,
  to,
}: {
  file: File;
  to: "products" | "blogs";
}) => {
  const data = await file.arrayBuffer();
  const buffer = Buffer.from(data);
  const fileName = `${crypto.randomUUID()}${path.extname(file.name)}`;
  const basePath = path.join("images", to, fileName);
  const fileLink = path.join("/", basePath);
  const filePath = path.join(process.cwd(), "public", basePath);
  // warning : can't use await
  await writeFile(filePath, buffer);
  return fileLink;
};

export const writeMultipleFilesToDisk = async ({
  imageSources,
  to,
}: {
  imageSources: ImageSourceType[];
  to: "products" | "blogs";
}) => {
  const savedFiles: {
    fileLink: string;
    fakeUrl: string;
  }[] = [];

  for (const { file, fakeUrl } of imageSources) {
    const data = await file.arrayBuffer();
    const buffer = Buffer.from(data);
    const fileName = `${crypto.randomUUID()}${path.extname(file.name)}`;
    const basePath = path.join("images", to, fileName);
    const fileLink = path.join("/", basePath);
    const filePath = path.join(process.cwd(), "public", basePath);

    await writeFile(filePath, buffer);

    savedFiles.push({ fileLink, fakeUrl });
  }

  return savedFiles;
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
