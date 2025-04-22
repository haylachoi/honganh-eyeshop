import path from "path";
import { writeFile } from "fs/promises";
import { IMAGES_FORDERS } from "@/constants";

export const uploadFile = async ({
  file,
  to,
}: {
  file: File;
  to: (typeof IMAGES_FORDERS)[number];
}) => {
  const data = await file.arrayBuffer();
  const buffer = Buffer.from(data);
  const fileName = `${crypto.randomUUID()}${path.extname(file.name)}`;
  const basePath = path.join("images", to, fileName);
  const fileLink = path.join("/", basePath);
  const filePath = path.join(process.cwd(), "public", basePath);
  await writeFile(filePath, buffer);
  return fileLink;
};
