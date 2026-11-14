import { z } from 'zod';

export const createBoardSchema = z.object({
  title: z.string(),
});
