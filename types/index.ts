import { Path, PathValue } from "react-hook-form";

export type Result<T, E> =
  | { success: true; data: T }
  | { success: false; error: E };

export type Id = string;

export type MoneyType = number;

export type QueryFilter<T> = Partial<{
  [K in Path<T>]: PathValue<T, K>;
}>;

export type SearchFilter<T> = Partial<{
  [K in Path<T>]: unknown;
}>;

export type SearchParams = { [key: string]: string | string[] | undefined };

export type SimplePaginationInfo<T> = {
  total: number;
  items: T[];
};

export type PaginationInfo<T> = {
  total: number;
  page: number;
  size: number;
  items: T[];
};
