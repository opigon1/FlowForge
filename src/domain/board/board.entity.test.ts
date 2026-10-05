import { describe, it, expect } from 'vitest';
import { Board } from './board.entity';
import { BoardTitle } from './value-objects/board-title.vo';
import { Column } from '../column/column.entity';
import { ColumnTitle } from '../column/value-objects/column-title.vo';
import { TaskTitle } from '../task/value-objects/task-title.vo';
import { Task } from '../task/task.entity';
import { InvalidTaskLimitError } from '../column/errors/invalid-task-limit.error';

describe('Board', () => {
  it('should add column', () => {
    const board = new Board('1', new BoardTitle('Test Board'), [], new Date(), new Date());
    const column = new Column('1', new ColumnTitle('Test Column'), 1, [], new Date(), new Date());

    board.addColumn(column);

    expect(board.getColumns()).toHaveLength(1);
  });
  it('should not add column with duplicate title', () => {
    const board = new Board('1', new BoardTitle('Test Board'), [], new Date(), new Date());
    const column1 = new Column('1', new ColumnTitle('Test Column'), 1, [], new Date(), new Date());
    const column2 = new Column('2', new ColumnTitle('Test Column'), 2, [], new Date(), new Date());

    board.addColumn(column1);

    expect(() => board.addColumn(column2)).toThrow(
      'A column with this title already exists in the board',
    );
  });
  it('should not remove the last column', () => {
    const board = new Board('1', new BoardTitle('Test Board'), [], new Date(), new Date());
    const column = new Column('1', new ColumnTitle('Test Column'), 1, [], new Date(), new Date());
    board.addColumn(column);

    expect(() => board.removeColumn(column.getId())).toThrow(
      'Cannot remove the last column from the board',
    );
  });
  it('should move task between columns', () => {
    const board = new Board('1', new BoardTitle('Test Board'), [], new Date(), new Date());
    const column1 = new Column('1', new ColumnTitle('Column 1'), 1, [], new Date(), new Date());
    const column2 = new Column('2', new ColumnTitle('Column 2'), 2, [], new Date(), new Date());
    const task = new Task('1', new TaskTitle('Test Task'), new Date(), new Date());
    column1.addTask(task);
    board.addColumn(column1);
    board.addColumn(column2);

    board.moveTask(task.getId(), column2.getId());
    expect(column2.getTasks()).toHaveLength(1);
    expect(column1.getTasks()).toHaveLength(0);
  });
  it('should not add task to a column that has reached its limit', () => {
    const board = new Board('1', new BoardTitle('Test Board'), [], new Date(), new Date());
    const column = new Column(
      '1',
      new ColumnTitle('Test Column'),
      1,
      [],
      new Date(),
      new Date(),
      1,
    );
    const task1 = new Task('1', new TaskTitle('Task 1'), new Date(), new Date());
    const task2 = new Task('2', new TaskTitle('Task 2'), new Date(), new Date());
    board.addColumn(column);
    column.addTask(task1);

    expect(() => column.addTask(task2)).toThrow(InvalidTaskLimitError);
  });
});
