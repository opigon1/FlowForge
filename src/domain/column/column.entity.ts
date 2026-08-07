import { Task } from '../task/task.entity';
import { ColumnTitle } from './value-objects/column-title.vo';

export class Column {
  constructor(
    private readonly id: string,
    private title: ColumnTitle,
    private position: number,
    private tasks: Task[],
    private readonly createdAt: Date,
    private updatedAt: Date,
    private taskLimit?: number,
  ) {}

  getTitle(): ColumnTitle {
    return this.title;
  }

  getId(): Readonly<string> {
    return this.id;
  }

  getPosition(): Readonly<number> {
    return this.position;
  }

  getTaskLimit(): Readonly<number | undefined> {
    return this.taskLimit;
  }

  getTasks(): ReadonlyArray<Task> {
    return this.tasks;
  }

  hasTask(taskId: string): boolean {
    return this.tasks.some((t) => t.getId() === taskId);
  }

  addTask(task: Task) {
    if (!this.canAcceptTask(this.tasks.length)) {
      throw new Error('Task limit reached for this column');
    }

    this.tasks.push(task);
    this.updatedAt = new Date();
  }

  removeTask(taskId: string) {
    const index = this.tasks.findIndex((t) => t.getId() === taskId);
    if (index === -1) {
      throw new Error('Task not found in this column');
    }
    const [removedTask] = this.tasks.splice(index, 1);
    this.updatedAt = new Date();
    return removedTask;
  }

  rename(newTitle: ColumnTitle) {
    this.title = newTitle;
    this.updatedAt = new Date();
  }

  canAcceptTask(tasksCount: number): boolean {
    if (this.taskLimit === undefined) {
      return true;
    }
    return this.taskLimit > tasksCount;
  }

  changePosition(newPosition: number) {
    if (newPosition < 0) {
      throw new Error('Position cannot be negative');
    }
    this.position = newPosition;
    this.updatedAt = new Date();
  }
}
