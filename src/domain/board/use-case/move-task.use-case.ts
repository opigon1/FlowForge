import { BoardRepository } from '../board.repository';
import { BoardNotFoundError } from '../errors/board-not-found.error';

type MoveTaskInput = {
  boardId: string;
  taskId: string;
  targetColumnId: string;
};

export class MoveTaskUseCase {
  constructor(private readonly boardRepository: BoardRepository) {}

  async execute({ boardId, taskId, targetColumnId }: MoveTaskInput): Promise<void> {
    const board = await this.boardRepository.findById(boardId);
    if (!board) {
      throw new BoardNotFoundError();
    }

    board.moveTask(taskId, targetColumnId);
    await this.boardRepository.save(board);
  }
}
