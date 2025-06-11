import { z } from 'zod/v4';

export const entrySchema = z.object({
  text: z.string().max(150),
  done: z.boolean(),
  url: z.url().optional(),
});
