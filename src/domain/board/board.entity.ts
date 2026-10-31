import { Column } from '../column/column.entity';
import { InvalidTaskLimitError } from '../column/errors/Invalid-task-limit-error';
import { ColumnTitle } from '../column/value-objects/column-title.vo';
import { CannotRemoveLastColumnError } from './errors/cannot-remove-last-column.error';
import { ColumnNotFoundError } from './errors/column-not-found.error';
import { DuplicateColumnTitleError } from './errors/duplicate-column-title.error';
import { TaskNotFoundError } from './errors/task-not-found.error';
import { BoardTitle } from './value-objects/board-title.vo';

export class Board {
  constructor(
    private readonly id: string,
    private title: BoardTitle,
    private columns: Column[],
    private readonly createdAt: Date,
    private updatedAt: Date,
  ) {}

  getId(): Readonly<string> {
    return this.id;
  }

  getTitle(): BoardTitle {
    return this.title;
  }

  getColumns(): ReadonlyArray<Column> {
    return this.columns;
  }

  getNextColumnPosition(): number {
    return this.columns.length;
  }

  getCreatedAt(): Readonly<Date> {
    return this.createdAt;
  }

  getUpdatedAt(): Readonly<Date> {
    return this.updatedAt;
  }

  static create(title: BoardTitle): Board {
    const now = new Date();
    return new Board(crypto.randomUUID(), title, [], now, now);
  }

  rename(newTitle: BoardTitle) {
    this.title = newTitle;
    this.updatedAt = new Date();
  }

  addColumn(column: Column) {
    if (this.columns.some((c) => c.getTitle().equals(column.getTitle()))) {
      new DuplicateColumnTitleError();
    }
    this.columns.push(column);
    this.updatedAt = new Date();
  }

  renameColumn(columnId: string, newTitle: ColumnTitle) {
    const column = this.findColumn(columnId);

    const titleAlreadyExists = this.columns.some(
      (otherColumn) => otherColumn.getId() !== columnId && otherColumn.getTitle().equals(newTitle),
    );

    if (titleAlreadyExists) {
      throw new DuplicateColumnTitleError();
    }

    column.rename(newTitle);
    this.updatedAt = new Date();
  }

  removeColumn(columnId: string) {
    const index = this.columns.findIndex((c) => c.getId() === columnId);
    if (index === -1) {
      throw new ColumnNotFoundError();
    }
    if (this.columns.length === 1) {
      throw new CannotRemoveLastColumnError();
    }

    this.columns.splice(index, 1);
    this.updatedAt = new Date();
  }

  private findColumn(columnId: string): Column {
    const column = this.columns.find((c) => c.getId() === columnId);

    if (!column) {
      throw new ColumnNotFoundError();
    }

    return column;
  }

  moveTask(taskId: string, targetColumnId: string) {
    const targetColumn = this.findColumn(targetColumnId);

    const sourceColumn = this.columns.find((c) => c.hasTask(taskId));
    if (!sourceColumn) {
      throw new TaskNotFoundError();
    }

    if (!targetColumn.canAcceptTask()) {
      throw new InvalidTaskLimitError('Cannot move task: target column has reached its task limit');
    }

    const task = sourceColumn.removeTask(taskId);
    targetColumn.addTask(task);
    this.updatedAt = new Date();
  }

  static restore(
    id: string,
    title: BoardTitle,
    columns: Column[],
    createdAt: Date,
    updatedAt: Date,
  ): Board {
    return new Board(id, title, columns, createdAt, updatedAt);
  }
}
