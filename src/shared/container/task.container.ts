import { MoveTaskUseCase } from '@/application/task/move-task.usecase';
import { PrismaTaskRepository } from '@/infrastructure/repositories/prisma-task.repository';

const repository = new PrismaTaskRepository();

export const moveTaskUseCase = new MoveTaskUseCase(repository);
