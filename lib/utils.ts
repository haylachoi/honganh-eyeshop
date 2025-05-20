import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import crypto from "crypto";
import { BASE_URL, SORTING_OPTIONS } from "@/constants";
import slugify from "slugify";
import { AddressType, SearchParams } from "@/types";
import { ENDPOINTS, ADMIN_ENDPOINTS } from "@/constants/endpoints.constants";
import { FILTER_NAME } from "@/features/filter/filter.constants";
import { parsePhoneNumberFromString } from "libphonenumber-js";

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

// use env
export const currencyFormatter = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
});

// use env
export const dateFormatter = new Intl.DateTimeFormat("vi-VN", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

export const formatDateTimeLocal = (date: Date) => {
  return date.toISOString().slice(0, 16); // Lấy YYYY-MM-DDTHH:MM
};

export const slugifyVn = (text: string) => {
  return slugify(text.replace(/[đĐ]/g, "d"), {
    lower: true,
    strict: true,
  });
};

export const getQueryOption = ({
  sortBy,
  orderBy,
}: {
  sortBy: string;
  orderBy: string;
}): Record<string, 1 | -1> | undefined => {
  if (
    ![SORTING_OPTIONS.NAME, SORTING_OPTIONS.PRICE].includes(sortBy) ||
    ![SORTING_OPTIONS.ASC, SORTING_OPTIONS.DESC].includes(orderBy)
  ) {
    return { [SORTING_OPTIONS.NAME]: 1 };
  }

  return {
    [sortBy]: orderBy === SORTING_OPTIONS.ASC ? 1 : -1,
  };
};

export const truncateText = ({
  text,
  maxLength = 40,
  hasEllipsis = true,
}: {
  text: string;
  maxLength: number;
  hasEllipsis?: boolean;
}) => {
  if (text.length <= maxLength) return text;

  const truncated = text.slice(0, maxLength);

  const lastSpace = truncated.lastIndexOf(" ");

  const postfix = hasEllipsis ? "..." : "";

  const newText = truncated.slice(0, lastSpace);
  if (newText.length <= 3) return truncated + postfix;

  return newText + postfix;
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

export function getDirtyValues<
  DirtyFields extends Record<string, unknown>,
  Values extends Record<keyof DirtyFields, unknown>,
>(dirtyFields: DirtyFields, values: Values): Partial<typeof values> {
  const dirtyValues = Object.keys(dirtyFields).reduce((prev, key) => {
    // Unsure when RFH sets this to `false`, but omit the field if so.
    if (!dirtyFields[key]) return prev;

    return {
      ...prev,
      [key]:
        typeof dirtyFields[key] === "object"
          ? getDirtyValues(
              dirtyFields[key] as DirtyFields,
              values[key] as Values,
            )
          : values[key],
    };
  }, {});

  return dirtyValues;
}

export function hashPassword({
  password,
  salt,
}: {
  password: string;
  salt: string;
}): Promise<string> {
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
  const inputHashedPassword = await hashPassword({ password, salt });

  return crypto.timingSafeEqual(
    Buffer.from(inputHashedPassword, "hex"),
    Buffer.from(hashedPassword, "hex"),
  );
}

export function generateSalt() {
  return crypto.randomBytes(16).toString("hex").normalize();
}

export const compressImage = async (
  file: File,
  quality: number = 0.7,
  maxWidth: number = 800,
): Promise<File> => {
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
        const originalWidth = img.width;
        const originalHeight = img.height;

        const isWebP = file.type === "image/webp";
        const needsResize = originalWidth > maxWidth;

        // Nếu ảnh đã là .webp và không cần resize → giữ nguyên
        if (isWebP && !needsResize) {
          resolve(file);
          return;
        }

        // Resize nếu cần
        let width = originalWidth;
        let height = originalHeight;
        if (needsResize) {
          height *= maxWidth / width;
          width = maxWidth;
        }

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Canvas not supported"));
          return;
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

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
};

export const getLink = {
  user: {
    verify({ token }: { token: string }) {
      return `${ENDPOINTS.AUTH.VERIFY_TOKEN}/${token}`;
    },
    resetPassword({ token }: { token: string }) {
      return `${ENDPOINTS.AUTH.RESET_PASSWORD}/${token}`;
    },
  },
  product: {
    update({ id }: { id: string }) {
      return `${ADMIN_ENDPOINTS.PRODUCTS}/update/${id}`;
    },
    home({
      categorySlug,
      productSlug,
      attributes = [],
    }: {
      categorySlug: string;
      productSlug: string;
      attributes?: {
        name: string;
        value: string;
      }[];
    }) {
      return attributes?.length > 0
        ? `${ENDPOINTS.CATEGORIES}/${categorySlug}/${productSlug}?${attributes.map((attr) => `${attr.name}=${attr.value}`).join("&")}`
        : `${ENDPOINTS.CATEGORIES}/${categorySlug}/${productSlug}`;
    },
  },
  blog: {
    update({ id }: { id: string }) {
      return `${ADMIN_ENDPOINTS.BLOGS}/update/${id}`;
    },
    view({ blogSlug }: { blogSlug: string }) {
      return `${ENDPOINTS.BLOGS.view}/${blogSlug}`;
    },
    home(props?: { page: number; tag?: string }) {
      if (props && props.tag) {
        const { page, tag } = props;
        if (!page) return `${ENDPOINTS.BLOGS.home}/tags/${tag}`;
        if (page === 1) return `${ENDPOINTS.BLOGS.home}/tags/${tag}`;
        return `${ENDPOINTS.BLOGS.home}/tags/${tag}/${getPageNumber(page)}`;
      }

      if (!props) return `${ENDPOINTS.BLOGS.home}`;
      const { page } = props;
      if (page === 1) return `${ENDPOINTS.BLOGS.home}`;
      return `${ENDPOINTS.BLOGS.home}/${getPageNumber(page)}`;
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
  order: {
    customer: {
      view({ orderId }: { orderId: string }) {
        return `${ENDPOINTS.ORDER}/${orderId}`;
      },
      home() {
        return `${ENDPOINTS.ORDER}`;
      },
    },
  },
  tag: {
    trending() {
      return `${ENDPOINTS.SEARCH}?${FILTER_NAME.TAG}=trending`;
    },
    newArrival() {
      return `${ENDPOINTS.SEARCH}?${FILTER_NAME.TAG}=new-arrival`;
    },
  },
  search({ queries }: { queries: { key: string; value: string }[] }) {
    const params = new URLSearchParams();
    for (const query of queries) {
      params.append(query.key, query.value);
    }
    return `${ENDPOINTS.SEARCH}?${params.toString()}`;
  },
  support: {
    home({ supportSlug }: { supportSlug: string }) {
      return `${ENDPOINTS.SUPPORT.HOME}/${supportSlug}`;
    },
  },
};

export const getFromLocalStorage = <T>(key: string, defaultValue: T) => {
  try {
    const item = window.localStorage.getItem(key);
    return item ? (JSON.parse(item) as T) : defaultValue;
  } catch (error) {
    console.warn("Failed to read localStorage", error);
    return defaultValue;
  }
};

export const getFullLink = (url?: string) => {
  const normalizedBase = BASE_URL.replace(/\/+$/, "");

  if (!url || url === "/") return `${normalizedBase}/`;

  const normalizedUrl = url.startsWith("/") ? url : `/${url}`;
  return `${normalizedBase}${normalizedUrl}`;
};

export const saveToLocalStorage = ({
  key,
  value,
}: {
  key: string;
  value: unknown;
}) => {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn("Failed to write to localStorage", error);
  }
};

export function createUppercaseMap<T extends readonly string[]>(
  values: T,
): Record<Uppercase<T[number]>, T[number]> {
  return values.reduce(
    (acc, key) => {
      acc[key.toUpperCase() as Uppercase<T[number]>] = key;
      return acc;
    },
    {} as Record<Uppercase<T[number]>, T[number]>,
  );
}

export function isValidEnumValue<T extends readonly string[]>(
  value: string,
  values: T,
): value is T[number] {
  return values.includes(value as T[number]);
}

export const normalizeSearchParams = (
  params: SearchParams,
): Record<string, string[]> => {
  const result: Record<string, string[]> = {};

  for (const key in params) {
    const value = params[key];

    if (typeof value === "string") {
      result[key] = decodeURIComponent(value).split(",");
    } else if (Array.isArray(value)) {
      result[key] = value;
    }
  }

  return result;
};

export const normalizeSearchParamsToString = (
  params: SearchParams,
): Record<string, string | undefined> => {
  const result: Record<string, string | undefined> = {};

  for (const key in params) {
    const value = params[key];

    if (typeof value === "string") {
      result[key] = value;
    } else if (Array.isArray(value)) {
      result[key] = value.map(decodeURIComponent).join(",");
    }
  }

  return result;
};

export const maskEmail = (email?: string) => {
  if (!email) return "";

  const [local, domain] = email.split("@");
  const preview = local.length <= 3 ? local : local.slice(0, 3);
  return `${preview}***@${domain}`;
};

export const maskPhone = (phone?: string) => {
  if (!phone) return "";
  return "****" + phone.slice(-4);
};

export const formatPhone = ({
  phone,
  type = "national",
}: {
  phone: string;
  type?: "national" | "international" | "tel";
}) => {
  const parsed = parsePhoneNumberFromString(phone, "VN");
  if (!parsed || !parsed.isValid()) return phone;

  switch (type) {
    case "international":
      return parsed.formatInternational();
    case "tel":
      return `tel:${parsed.format("E.164")}`;
    case "national":
    default:
      return parsed.formatNational();
  }
};
export const getFullAdress = (addressInfo: AddressType) => {
  const { address, ward, district, city } = addressInfo;
  return [address, ward, district, city].filter(Boolean).join(", ");
};

export const getPageNumber = (page: number) => `page-${page}`;
export const getTotalPages = (total: number, size: number) =>
  Math.ceil(total / size);

export const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  else if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
  else return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

export const updateSearchParam = (key: string, value: string) => {
  const url = new URL(window.location.href);
  url.searchParams.set(key, value);
  window.history.replaceState({}, "", url.toString());
};

export const removeSearchParam = (key: string) => {
  const url = new URL(window.location.href);
  url.searchParams.delete(key);
  window.history.replaceState({}, "", url.toString());
};
