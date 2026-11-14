import { z } from 'zod';

export const moveTaskSchema = z.object({
  targetColumnId: z.string(),
});
