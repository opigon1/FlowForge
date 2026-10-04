import { z } from 'zod';

export const moveTaskSchema = z.object({
  targetColumnId: z.string().min(1, 'Target column ID is required'),
});
