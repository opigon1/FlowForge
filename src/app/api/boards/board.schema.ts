import { MAX_BOARD_TITLE_LENGTH, MIN_BOARD_TITLE_LENGTH } from '@/shared/constants/board';
import { z } from 'zod';

export const createBoardSchema = z.object({
  title: z
    .string()
    .min(MIN_BOARD_TITLE_LENGTH, { message: 'Title is too short' })
    .max(MAX_BOARD_TITLE_LENGTH, { message: 'Title is too long' }),
});
