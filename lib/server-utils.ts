import path from "path";
import { writeFile } from "fs/promises";
import { ImageSourceType } from "@/features/blogs/blog.types";

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
    console.log("file name", file.name);
    const fileName = `${crypto.randomUUID()}${path.extname(file.name)}`;
    const basePath = path.join("images", to, fileName);
    const fileLink = path.join("/", basePath);
    const filePath = path.join(process.cwd(), "public", basePath);

    console.log("file link", fileLink);

    await writeFile(filePath, buffer);

    savedFiles.push({ fileLink, fakeUrl });
  }

  console.log(savedFiles);

  return savedFiles;
};
