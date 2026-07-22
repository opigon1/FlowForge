import { ColumnTitle } from './value-objects/column-title.vo';

export class Column {
  constructor(
    private readonly id: string,
    private title: ColumnTitle,
    private position: number,
    private readonly createdAt: Date,
    private updatedAt: Date,
    private taskLimit?: number,
  ) {}

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
