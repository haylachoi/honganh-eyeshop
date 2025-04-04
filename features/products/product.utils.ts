import { writeFile } from "fs/promises";
import { ProductInputType, ProductUpdateType } from "./product.types";
import path from "path";
import crypto from "crypto";

export const transformCreateInputVariantToDbVariant = async ({
  identity,
  variants,
}: {
  identity: string;
  variants: ProductInputType["variants"];
}) => {
  const progress: Promise<void>[] = [];

  const newVariants = variants.map(({ images, ...rest }) => {
    const imageUrls: string[] = [];
    const localProgress = images.map(async (file) => {
      const data = await file.arrayBuffer();
      const buffer = Buffer.from(data);
      const fileName = `${identity}_${crypto.randomUUID()}${path.extname(file.name)}`;
      const basePath = path.join("images", "products", fileName);
      const fileLink = path.join("/", basePath);
      const filePath = path.join(process.cwd(), "public", basePath);
      imageUrls.push(fileLink);
      return writeFile(filePath, buffer);
    });
    progress.push(...localProgress);

    return {
      ...rest,
      images: imageUrls,
    };
  });

  await Promise.all(progress);
  return newVariants;
};

export const transformUpdateInputVariantToDbVariant = async ({
  identity,
  variants,
}: {
  identity: string;
  variants: ProductUpdateType["variants"];
}) => {
  const progress: Promise<void>[] = [];

  const newVariants = variants.map(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ({ images, oldImages, deletedImages, ...rest }) => {
      const imageUrls: string[] = [...oldImages];
      const localProgress = images.map(async (file) => {
        const data = await file.arrayBuffer();
        const buffer = Buffer.from(data);
        const fileName = `${identity}_${crypto.randomUUID()}${path.extname(file.name)}`;
        const basePath = path.join("images", "products", fileName);
        const fileLink = path.join("/", basePath);
        const filePath = path.join(process.cwd(), "public", basePath);
        imageUrls.push(fileLink);
        return writeFile(filePath, buffer);
      });
      progress.push(...localProgress);

      return {
        ...rest,
        images: imageUrls,
      };
    },
  );

  await Promise.all(progress);
  return newVariants;
};
