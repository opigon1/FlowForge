import { Column } from '../column/column.entity';
import { BoardTitle } from './value-objects/board-title.vo';

export class Board {
  constructor(
    private readonly id: string,
    private title: BoardTitle,
    private columns: Column[],
    private readonly createdAt: Date,
    private updatedAt: Date,
  ) {}

  getTitle(): BoardTitle {
    return this.title;
  }

  getColumns(): ReadonlyArray<Column> {
    return this.columns;
  }

  rename(newTitle: BoardTitle) {
    this.title = newTitle;
    this.updatedAt = new Date();
  }

  addColumn(column: Column) {
    if (this.columns.some((c) => c.getTitle().equals(column.getTitle()))) {
      throw new Error('A column with this title already exists in the board');
    }
    this.columns.push(column);
    this.updatedAt = new Date();
  }

  removeColumn(columnId: string) {
    if (this.columns.length === 1) {
      throw new Error('Cannot remove the last column from the board');
    }
    const index = this.columns.findIndex((c) => c.getId() === columnId);
    if (index === -1) {
      throw new Error('Column not found');
    }
    this.columns.splice(index, 1);
    this.updatedAt = new Date();
  }

  private findColumn(columnId: string): Column {
    const column = this.columns.find((c) => c.getId() === columnId);

    if (!column) {
      throw new Error('Column not found');
    }

    return column;
  }

  moveTask(taskId: string, targetColumnId: string) {
    const targetColumn = this.findColumn(targetColumnId);
    if (!targetColumn) {
      throw new Error('Target column not found');
    }
    const sourceColumn = this.columns.find((c) => c.hasTask(taskId));
    if (!sourceColumn) {
      throw new Error('Task not found in any column');
    }

    if (targetColumn.canAcceptTask(sourceColumn.getTasks().length)) {
      throw new Error('Target column cannot accept more tasks');
    }

    const task = sourceColumn.removeTask(taskId);
    targetColumn.addTask(task);
    this.updatedAt = new Date();
  }
}
