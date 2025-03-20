import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import crypto from "crypto";
import { cookies } from "next/headers";
import { ADMIN_ENDPOINTS, ENDPOINTS } from "@/constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const currencyFormatter = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
});

export const dateFormatter = new Intl.DateTimeFormat("vi-VN", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const formatError = (error: any) => {
  if (error.name === "ZodError") {
    const fieldErrors = Object.keys(error.errors).map((field) => {
      const errorMessage = error.errors[field].message;
      return `${error.errors[field].path}: ${errorMessage}`; // field: errorMessage
    });
    return fieldErrors.join(". ");
  } else if (error.name === "ValidationError") {
    const fieldErrors = Object.keys(error.errors).map((field) => {
      const errorMessage = error.errors[field].message;
      return errorMessage;
    });
    return fieldErrors.join(". ");
  } else if (error.code === 11000) {
    const duplicateField = Object.keys(error.keyValue)[0];
    return `${duplicateField} already exists`;
  }
};

export function hashPassword(password: string, salt: string): Promise<string> {
  return new Promise((resolve, reject) => {
    crypto.scrypt(password.normalize(), salt, 64, (error, hash) => {
      if (error) reject(error);

      resolve(hash.toString("hex").normalize());
    });
  });
}

export async function comparePasswords({
  password,
  salt,
  hashedPassword,
}: {
  password: string;
  salt: string;
  hashedPassword: string;
}) {
  const inputHashedPassword = await hashPassword(password, salt);

  return crypto.timingSafeEqual(
    Buffer.from(inputHashedPassword, "hex"),
    Buffer.from(hashedPassword, "hex"),
  );
}

export function generateSalt() {
  return crypto.randomBytes(16).toString("hex").normalize();
}

export async function compressImage(
  file: File,
  quality: number = 0.7,
  maxWidth: number = 800,
): Promise<File> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      if (!event.target?.result) {
        reject(new Error("Failed to read file."));
        return;
      }

      const img = new Image();
      img.src = event.target.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Canvas not supported"));
          return;
        }

        // Resize ảnh nếu lớn hơn maxWidth
        let width = img.width;
        let height = img.height;
        if (width > maxWidth) {
          height *= maxWidth / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        // Chuyển sang WebP (tốt hơn JPEG)
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Compression failed"));
              return;
            }
            resolve(
              new File([blob], file.name.replace(/\.\w+$/, ".webp"), {
                type: "image/webp",
              }),
            );
          },
          "image/webp",
          quality,
        );
      };

      img.onerror = () => reject(new Error("Invalid image file"));
    };

    reader.onerror = () => reject(new Error("FileReader error"));
    reader.readAsDataURL(file);
  });
}

export const getLink = {
  product: {
    update({ productSlug }: { productSlug: string }) {
      return `${ADMIN_ENDPOINTS.PRODUCTS}/update/${productSlug}`;
    },
    home({
      categorySlug,
      productSlug,
    }: {
      categorySlug: string;
      productSlug: string;
    }) {
      return `${ENDPOINTS.CATEGORIES}/${categorySlug}/${productSlug}`;
    },
  },
  blog: {
    update({ blogSlug }: { blogSlug: string }) {
      return `${ADMIN_ENDPOINTS.BLOGS}/update/${blogSlug}`;
    },
    home({ blogSlug }: { blogSlug: string }) {
      return `${ENDPOINTS.BLOGS}/${blogSlug}`;
    },
  },
  category: {
    update({ categorySlug }: { categorySlug: string }) {
      return `${ADMIN_ENDPOINTS.CATEGORIES}/update/${categorySlug}`;
    },
    home({ categorySlug }: { categorySlug: string }) {
      return `${ENDPOINTS.CATEGORIES}/${categorySlug}`;
    },
  },
};
