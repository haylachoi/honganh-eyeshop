export type Result<T, E> =
  | { success: true; data: T }
  | { success: false; error: E };

export type Id = string;

export type MoneyType = number;

export class DatabaseError extends Error {
  constructor({ message }: { message: string }) {
    super(message);
    this.name = "DatabaseError";
    Error.captureStackTrace(this, this.constructor);
  }
}

export class AppError extends Error {
  constructor({ message }: { message: string }) {
    super(message);
    Error.captureStackTrace(this, this.constructor);
  }
}
