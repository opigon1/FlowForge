import { BoardRepository } from '@/domain/board/board.repository';
import { BoardNotFoundError } from '@/domain/board/errors/board-not-found.error';

export class DeleteColumnUseCase {
  constructor(private readonly boardRepository: BoardRepository) {}

  async execute(boardId: string, columnId: string): Promise<void> {
    const board = await this.boardRepository.findById(boardId);

    if (!board) {
      throw new BoardNotFoundError();
    }

    board.removeColumn(columnId);
    await this.boardRepository.save(board);
  }
}
