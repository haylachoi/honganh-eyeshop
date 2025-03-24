import path from "path";
import { writeFile } from "fs/promises";

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
