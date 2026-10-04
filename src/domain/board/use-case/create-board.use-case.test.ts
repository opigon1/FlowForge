import { expect, it } from 'vitest';
import { Board } from '../board.entity';
import { BoardRepository } from '../board.repository';

import { CreateBoardUseCase } from './create-board.use-case';

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

it('creates a new board with the given title', async () => {
  const fakeBoardRepository = new FakeBoardRepository();
  const createBoardUseCase = new CreateBoardUseCase(fakeBoardRepository);
  await createBoardUseCase.execute('Test Board');
  expect(fakeBoardRepository.board).not.toBeNull();
  expect(fakeBoardRepository.board?.getTitle().toString()).toBe('Test Board');
});
