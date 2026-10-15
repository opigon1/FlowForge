import { Board } from '../board.entity';
import { BoardRepository } from '../board.repository';
import { BoardNotFoundError } from '../errors/board-not-found.error';

export class GetBoardUseCase {
  constructor(private readonly boardRepository: BoardRepository) {}

  async execute(boardId: string): Promise<Board> {
    const board = await this.boardRepository.findById(boardId);
    if (!board) {
      throw new BoardNotFoundError();
    }
    return board;
  }
}
