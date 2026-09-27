import { TaskTitle } from './value-objects/task-title.vo';

export class Task {
  constructor(
    private readonly id: string,
    private title: TaskTitle,
    private readonly createdAt: Date,
    private updatedAt: Date,
  ) {}

  getId(): Readonly<string> {
    return this.id;
  }

  getTitle(): Readonly<TaskTitle> {
    return this.title;
  }

  rename(newTitle: TaskTitle) {
    this.title = newTitle;
    this.updatedAt = new Date();
  }

  static restore(id: string, title: TaskTitle, createdAt: Date, updatedAt: Date): Task {
    return new Task(id, title, createdAt, updatedAt);
  }
}
