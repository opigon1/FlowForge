import { Task } from '@/domain/task/task.entity';
import { TaskTitle } from '@/domain/task/value-objects/task-title.vo';
import { prisma } from '@/infrastructure/database/prisma.client';

type PrismaTask = NonNullable<Awaited<ReturnType<typeof prisma.task.findUnique>>>;

export class TaskMapper {
  static toDomain(data: PrismaTask): Task {
    return Task.restore(data.id, new TaskTitle(data.title), data.createdAt, data.updatedAt);
  }
}
