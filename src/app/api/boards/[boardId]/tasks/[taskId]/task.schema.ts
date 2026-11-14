import { z } from 'zod';

export const renameTaskSchema = z.object({
  title: z.string(),
});
