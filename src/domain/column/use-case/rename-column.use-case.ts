import { BoardNotFoundError } from '@/domain/board/errors/board-not-found.error';
import { BoardRepository } from '@/domain/board/board.repository';
import { ColumnTitle } from '../value-objects/column-title.vo';

export class RenameColumnUseCase {
  constructor(private readonly boardRepository: BoardRepository) {}

  async execute(boardId: string, columnId: string, newTitle: string): Promise<void> {
    const board = await this.boardRepository.findById(boardId);
    if (!board) {
      throw new BoardNotFoundError();
    }

    board.renameColumn(columnId, new ColumnTitle(newTitle));
    await this.boardRepository.save(board);
  }
}
