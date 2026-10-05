import { z } from 'zod';
import { MAX_COLUMN_TITLE_LENGTH, MIN_COLUMN_TITLE_LENGTH } from '@/shared/constants/columns';

export const createColumnSchema = z.object({
  title: z
    .string()
    .min(MIN_COLUMN_TITLE_LENGTH, { message: 'Column title is too short' })
    .max(MAX_COLUMN_TITLE_LENGTH, { message: 'Column title is too long' }),
});
