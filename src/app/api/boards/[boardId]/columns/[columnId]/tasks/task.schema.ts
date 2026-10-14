import { MAX_TASK_TITLE_LENGTH, MIN_TASK_TITLE_LENGTH } from '@/shared/constants/task';
import { z } from 'zod';

export const createTaskSchema = z.object({
  title: z
    .string()
    .min(MIN_TASK_TITLE_LENGTH, { message: 'Task title is too short' })
    .max(MAX_TASK_TITLE_LENGTH, { message: 'Task title is too long' }),
});
