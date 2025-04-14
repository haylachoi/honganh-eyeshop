import { Result } from "@/types";

export type QueryError = {
  message: string;
  type?: string;
};

export type QueryResult<T> = Result<T, QueryError>;
