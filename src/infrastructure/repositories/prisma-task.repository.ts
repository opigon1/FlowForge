import { Task } from '@/domain/task/task.entity';
import { TaskRepository } from '@/domain/task/task.repository';
import { prisma } from '../database/prisma.client';
import { TaskTitle } from '@/domain/task/value-objects/task-title.vo';

export class PrismaTaskRepository implements TaskRepository {
  async findById(id: string): Promise<Task | null> {
    const task = await prisma.task.findUnique({
      where: { id },
    });

    if (!task) {
      return null;
    }
    return new Task(task.id, new TaskTitle(task.title), task.createdAt, task.updatedAt);
  }

  async save(task: Task): Promise<void> {
    await prisma.task.update({
      where: { id: task.id },
      data: {
        title: task.title.toString(),
        updatedAt: task.updatedAt,
      },
    });
  }
}
