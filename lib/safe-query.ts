/* eslint-disable @typescript-eslint/no-explicit-any */
import { Result } from "@/types";
import { ZodSchema } from "zod";

export type MiddlewareContext<P> = {
  inputParams: P;
  [key: string]: any;
};

export type Middleware<P> = (
  ctx: MiddlewareContext<P>,
  next: (ctx: MiddlewareContext<P>) => Promise<void>,
) => Promise<void>;

class SafeQuery<E> {
  private errorHandler: (error: unknown) => E;
  private middlewares: Middleware<any>[] = [];

  constructor(config: { errorHandler: (error: unknown) => E }) {
    this.errorHandler = config.errorHandler;
  }

  use<P>(middleware: Middleware<P>): this {
    this.middlewares.push(middleware as Middleware<any>);
    return this;
  }

  schema<P>(schema: ZodSchema<P>) {
    return {
      query: <T>(fetcher: (ctx: MiddlewareContext<P>) => Promise<T>) => {
        return async (params: P): Promise<Result<T, E>> => {
          try {
            const ctx: MiddlewareContext<P> = { inputParams: params };

            await this.runMiddlewares(ctx);

            const validation = schema.safeParse(ctx.inputParams);
            if (!validation.success) {
              return {
                success: false,
                error: this.errorHandler(validation.error),
              };
            }

            const data = await fetcher({
              ...ctx,
              inputParams: validation.data,
            });
            return { success: true, data };
          } catch (error) {
            return { success: false, error: this.errorHandler(error) };
          }
        };
      },
    };
  }

  query<T, P = undefined>(fetcher: (ctx: MiddlewareContext<P>) => Promise<T>) {
    return async (params?: P): Promise<Result<T, E>> => {
      try {
        const ctx: MiddlewareContext<P> = { inputParams: params as P };
        await this.runMiddlewares(ctx);
        const data = await fetcher(ctx);
        return { success: true, data };
      } catch (error) {
        return { success: false, error: this.errorHandler(error) };
      }
    };
  }

  private async runMiddlewares<P>(ctx: MiddlewareContext<P>): Promise<void> {
    let index = -1;
    const runner = async (ctx: MiddlewareContext<P>): Promise<void> => {
      index++;
      if (index < this.middlewares.length) {
        await this.middlewares[index](ctx, runner);
      }
    };
    await runner(ctx);
  }
}

export default SafeQuery;
