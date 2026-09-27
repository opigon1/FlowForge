import { expect, it } from 'vitest';
import { Board } from '../board.entity';
import { BoardRepository } from '../board.repository';
import { MoveTaskUseCase } from './move-task.use-case';
import { BoardTitle } from '../value-objects/board-title.vo';
import { Column } from '@/domain/column/column.entity';
import { ColumnTitle } from '@/domain/column/value-objects/column-title.vo';
import { Task } from '@/domain/task/task.entity';
import { TaskTitle } from '@/domain/task/value-objects/task-title.vo';

class FakeBoardRepository implements BoardRepository {
  board: Board | null = null;
  savedBoard: Board | null = null;

  async findById(boardId: string): Promise<Board | null> {
    if (this.board && this.board.getId() === boardId) {
      return this.board;
    }
    return null;
  }

  async save(board: Board): Promise<void> {
    this.savedBoard = board;
  }
}

it('should move task between columns', async () => {
  const fakeBoardRepository = new FakeBoardRepository();
  const board = new Board('1', new BoardTitle('Test Board'), [], new Date(), new Date());
  const column1 = new Column('1', new ColumnTitle('Column 1'), 1, [], new Date(), new Date());
  const column2 = new Column('2', new ColumnTitle('Column 2'), 2, [], new Date(), new Date());
  const task = new Task('1', new TaskTitle('Test Task'), new Date(), new Date());
  column1.addTask(task);
  board.addColumn(column1);
  board.addColumn(column2);
  fakeBoardRepository.board = board;
  const moveTaskUseCase = new MoveTaskUseCase(fakeBoardRepository);

  await moveTaskUseCase.execute({
    boardId: board.getId(),
    taskId: task.getId(),
    targetColumnId: column2.getId(),
  });

  expect(column2.getTasks()).toHaveLength(1);
  expect(column1.getTasks()).toHaveLength(0);
  expect(fakeBoardRepository.savedBoard).toBe(board);
});
