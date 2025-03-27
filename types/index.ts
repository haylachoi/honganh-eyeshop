import { Path, PathValue } from "react-hook-form";

export type Result<T, E> =
  | { success: true; data: T }
  | { success: false; error: E };

export type Id = string;

export type MoneyType = number;

export type QueryFilter<T> = Partial<{
  [K in Path<T>]: PathValue<T, K>;
}>;
