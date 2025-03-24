/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-object-type */
import { Result } from "@/types";
import { ZodSchema } from "zod";

export type MiddlewareResult<Extra extends object> = Extra;

export type Middleware<
  P,
  Extra extends object,
  NewExtra extends object,
> = (opt: {
  clientInput?: P;
  ctx: MiddlewareResult<Extra>;
  next: <NC extends object = {}>(
    ctx: MiddlewareResult<NC>,
  ) => Promise<MiddlewareResult<NC>>;
}) => Promise<MiddlewareResult<Extra & NewExtra>>;

// Lớp SafeQuery
class SafeQuery<E, Extra extends object = {}> {
  private errorHandler: (error: unknown) => E;
  private middlewares: Middleware<any, any, any>[] = [];

  constructor(config: { errorHandler: (error: unknown) => E }) {
    this.errorHandler = config.errorHandler;
  }

  // Phương thức use mở rộng Extra
  use<NewExtra extends object>(
    middleware: Middleware<any, Extra, NewExtra>,
  ): SafeQuery<E, Extra & NewExtra> {
    const newInstance = new SafeQuery<E, Extra & NewExtra>({
      errorHandler: this.errorHandler,
    });

    newInstance.middlewares = [...this.middlewares, middleware];

    return newInstance;
  }

  schema<P>(schema: ZodSchema<P>) {
    return {
      query: <T>(
        fetcher: (opt: { parsedInput: P; ctx: Extra }) => Promise<T>,
      ) => {
        return async (clientInput: P): Promise<Result<T, E>> => {
          try {
            let ctx: MiddlewareResult<Extra> = {} as Extra;

            ctx = await this.runMiddlewares({ clientInput, ctx });

            const validation = schema.safeParse(clientInput);
            if (!validation.success) {
              return {
                success: false,
                error: this.errorHandler(validation.error),
              };
            }

            const data = await fetcher({ parsedInput: validation.data, ctx });
            return { success: true, data };
          } catch (error) {
            return { success: false, error: this.errorHandler(error) };
          }
        };
      },
    };
  }

  query<T>(fetcher: (opt: { ctx: MiddlewareResult<Extra> }) => Promise<T>) {
    return async (): Promise<Result<T, E>> => {
      try {
        let ctx: MiddlewareResult<Extra> = {} as Extra;

        ctx = await this.runMiddlewares({ ctx });

        const data = await fetcher({ ctx });
        return { success: true, data };
      } catch (error) {
        return { success: false, error: this.errorHandler(error) };
      }
    };
  }

  private async runMiddlewares<P>({
    clientInput,
    ctx,
  }: {
    ctx: MiddlewareResult<Extra>;
    clientInput?: P | undefined;
  }): Promise<MiddlewareResult<Extra>> {
    let index = -1;

    const runner = async <NC extends object = {}>(
      newCtx: MiddlewareResult<NC>,
    ): Promise<MiddlewareResult<NC>> => {
      index++;
      if (index < this.middlewares.length) {
        return this.middlewares[index]({
          clientInput,
          ctx: newCtx,
          next: runner,
        });
      }
      return newCtx;
    };

    return runner(ctx);
  }
}

export default SafeQuery;
