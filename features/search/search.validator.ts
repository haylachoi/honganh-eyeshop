import { z } from "zod";

export const searchResultSchema = z.object({
  id: z.string(),
  name: z.string(),
  link: z.string(),
  price: z.number(),
  image: z.string(),
});
