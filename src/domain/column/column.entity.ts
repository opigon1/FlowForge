import { TaskNotFoundError } from '../board/errors/task-not-found.error';
import { Task } from '../task/task.entity';
import { InvalidTaskLimitError } from './errors/invalid-task-limit.error';
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

  getCreatedAt(): Readonly<Date> {
    return this.createdAt;
  }

  getUpdatedAt(): Readonly<Date> {
    return this.updatedAt;
  }

  static create(title: ColumnTitle, position: number, taskLimit?: number): Column {
    if (position < 0) {
      throw new InvalidTaskLimitError('Position cannot be negative');
    }

    const now = new Date();
    return new Column(crypto.randomUUID(), title, position, [], now, now, taskLimit);
  }

  addTask(task: Task) {
    if (!this.canAcceptTask()) {
      throw new InvalidTaskLimitError('Cannot add task: column has reached its task limit');
    }

    this.tasks.push(task);
    this.updatedAt = new Date();
  }

  removeTask(taskId: string) {
    const index = this.tasks.findIndex((t) => t.getId() === taskId);
    if (index === -1) {
      throw new TaskNotFoundError();
    }
    const [removedTask] = this.tasks.splice(index, 1);
    this.updatedAt = new Date();
    return removedTask;
  }

  rename(newTitle: ColumnTitle) {
    this.title = newTitle;
    this.updatedAt = new Date();
  }

  canAcceptTask(): boolean {
    if (this.taskLimit === undefined) {
      return true;
    }
    return this.taskLimit > this.tasks.length;
  }

  changePosition(newPosition: number) {
    if (newPosition < 0) {
      throw new InvalidTaskLimitError('Position cannot be negative');
    }
    this.position = newPosition;
    this.updatedAt = new Date();
  }

  static restore(
    id: string,
    title: ColumnTitle,
    position: number,
    tasks: Task[],
    createdAt: Date,
    updatedAt: Date,
    taskLimit?: number,
  ): Column {
    return new Column(id, title, position, tasks, createdAt, updatedAt, taskLimit);
  }
}
