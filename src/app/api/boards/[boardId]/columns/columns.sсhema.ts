import { z } from 'zod';

export const createColumnSchema = z.object({
  title: z.string(),
});

export const renameColumnSchema = z.object({
  title: z.string(),
});

export const changeColumnTaskLimitSchema = z.object({
  taskLimit: z.number().int().nonnegative().nullable(),
});
