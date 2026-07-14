import { TaskRepository } from '@/domain/task/task.repository';

export class MoveTaskUseCase {
  constructor(private taskRepository: TaskRepository) {}

  async execute({ taskId, newColumnId }: { taskId: string; newColumnId: string }): Promise<void> {
    const task = await this.taskRepository.findById(taskId);

    if (!task) {
      throw new Error(`Task with id ${taskId} not found`);
    }

    task.move(newColumnId);

    await this.taskRepository.save(task);
  }
}
