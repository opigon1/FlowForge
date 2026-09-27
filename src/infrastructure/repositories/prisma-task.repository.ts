import { Task } from '@/domain/task/task.entity';
import { TaskRepository } from '@/domain/task/task.repository';
import { prisma } from '../database/prisma.client';
import { TaskMapper } from '../persistence/prisma/mappers/task.mapper';

export class PrismaTaskRepository implements TaskRepository {
  async findById(id: string): Promise<Task | null> {
    const task = await prisma.task.findUnique({
      where: { id },
    });

    if (!task) {
      return null;
    }
    return TaskMapper.toDomain(task);
  }

  async save(task: Task): Promise<void> {
    await prisma.task.update({
      where: { id: task.getId() },
      data: {
        title: task.getTitle().toString(),
      },
    });
  }
}
