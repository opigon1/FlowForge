import { TaskTitle } from './value-objects/task-title.vo';

export class Task {
  constructor(
    public readonly id: string,
    public title: TaskTitle,
    public readonly createdAt: Date,
    public updatedAt: Date,
  ) {}

  getId(): Readonly<string> {
    return this.id;
  }
}
