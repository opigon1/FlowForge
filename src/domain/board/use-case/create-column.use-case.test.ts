import { expect, it } from 'vitest';
import { Board } from '../board.entity';
import { BoardRepository } from '../board.repository';
import { CreateColumnUseCase } from './create-column.use-case';
import { BoardTitle } from '../value-objects/board-title.vo';

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

  async create(board: Board): Promise<void> {
    this.board = board;
  }
}

it('creates a new column with the given title', async () => {
  const fakeBoardRepository = new FakeBoardRepository();
  const createColumnUseCase = new CreateColumnUseCase(fakeBoardRepository);

  const board = Board.create(new BoardTitle('Test Board'));
  await fakeBoardRepository.create(board);

  const column = await createColumnUseCase.execute(board.getId(), 'Test Column');

  expect(column.getTitle().toString()).toBe('Test Column');
  expect(column.getPosition()).toBe(0);

  expect(fakeBoardRepository.savedBoard).toBe(board);
  expect(fakeBoardRepository.savedBoard?.getColumns()).toHaveLength(1);
});
