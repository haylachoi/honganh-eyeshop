import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import crypto from "crypto";
import { ADMIN_ENDPOINTS, ENDPOINTS } from "@/constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const removeDiacritics = (str: string) =>
  str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[đĐ]/g, "d")
    .replace(/([^0-9a-z-\s])/g, "");

// todo: use env
export const currencyFormatter = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
});

// todo: use env
export const dateFormatter = new Intl.DateTimeFormat("vi-VN", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

export const formatDateTimeLocal = (date: Date) => {
  return date.toISOString().slice(0, 16); // Lấy YYYY-MM-DDTHH:MM
};

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
    update({ id }: { id: string }) {
      return `${ADMIN_ENDPOINTS.PRODUCTS}/update/${id}`;
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
    update({ id }: { id: string }) {
      return `${ADMIN_ENDPOINTS.BLOGS}/update/${id}`;
    },
    home({ blogSlug }: { blogSlug: string }) {
      return `${ENDPOINTS.BLOGS}/${blogSlug}`;
    },
  },
  category: {
    update({ id }: { id: string }) {
      return `${ADMIN_ENDPOINTS.CATEGORIES}/update/${id}`;
    },
    home({ categorySlug }: { categorySlug: string }) {
      return `${ENDPOINTS.CATEGORIES}/${categorySlug}`;
    },
  },
  coupon: {
    update({ id }: { id: string }) {
      return `${ADMIN_ENDPOINTS.COUPONS}/update/${id}`;
    },
  },
  checkout: {
    home({ checkoutId }: { checkoutId: string }) {
      return `${ENDPOINTS.CHECKOUT}/${checkoutId}`;
    },
  },
};
