import { writeFile } from "fs/promises";
import {
  ProductInputType,
  ProductType,
  ProductUpdateType,
} from "./product.types";
import path from "path";
import crypto from "crypto";

const MAX_FILENAME_LENGTH = 200;

export const generateFileName = ({
  identity,
  uniqueId,
  ext,
}: {
  identity: string;
  uniqueId: string;
  ext: string;
}) => {
  const uuid = crypto.randomUUID(); // 36 ký tự
  const fixedPartsLength = uniqueId.length + uuid.length + 2 + ext.length;

  const maxIdentityLength = MAX_FILENAME_LENGTH - fixedPartsLength;

  const safeIdentity =
    identity.length > maxIdentityLength
      ? identity.slice(0, maxIdentityLength)
      : identity;

  return `${safeIdentity}_${uniqueId}_${uuid}${ext}`;
};

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
      const fileName = generateFileName({
        identity,
        uniqueId: rest.uniqueId,
        ext: path.extname(file.name),
      });
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
        const fileName = generateFileName({
          identity,
          uniqueId: rest.uniqueId,
          ext: path.extname(file.name),
        });
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

export const highestDiscount = ({
  variants,
}: {
  variants: ProductType["variants"];
}) => {
  return variants.reduce((maxDiscount, variant) => {
    const { originPrice, price } = variant;

    if (originPrice > 0 && price < originPrice) {
      const discount = Math.round(((originPrice - price) / originPrice) * 100);
      return Math.max(maxDiscount, discount);
    }

    return maxDiscount;
  }, 0);
};
