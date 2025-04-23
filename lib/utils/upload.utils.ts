import path from "path";
import { writeFile } from "fs/promises";
import { IMAGES_FORDERS } from "@/constants";

export const uploadFile = async ({
  file,
  to,
  fileName,
}: {
  file: File;
  fileName?: string;
  to: (typeof IMAGES_FORDERS)[number];
}) => {
  const data = await file.arrayBuffer();
  const buffer = Buffer.from(data);
  if (!fileName) {
    fileName = crypto.randomUUID();
  }
  const fileNameWithExt = `${fileName}${path.extname(file.name)}`;
  const basePath = path.join("images", to, fileNameWithExt);
  const fileLink = path.join("/", basePath);
  const filePath = path.join(process.cwd(), "public", basePath);
  await writeFile(filePath, buffer);
  return fileLink;
};
