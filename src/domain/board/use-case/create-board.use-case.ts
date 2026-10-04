import { Board } from '../board.entity';
import { BoardRepository } from '../board.repository';
import { BoardTitle } from '../value-objects/board-title.vo';

export class CreateBoardUseCase {
  constructor(private readonly boardRepository: BoardRepository) {}

  async execute(title: string): Promise<Board> {
    const board = Board.create(new BoardTitle(title));
    await this.boardRepository.create(board);
    return board;
  }
}
