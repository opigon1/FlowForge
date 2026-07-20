import { TaskTitle } from './value-objects/task-title.vo';

export class Task {
  constructor(
    public readonly id: string,
    public title: TaskTitle,
    public columnId: string,
    public readonly createdAt: Date,
    public updatedAt: Date,
  ) {}

  move(columnId: string) {
    this.columnId = columnId;
    this.updatedAt = new Date();
  }
}
