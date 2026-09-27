import { BoardRepository } from '../board.repository';

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
      throw new Error('Board not found');
    }

    board.moveTask(taskId, targetColumnId);
    await this.boardRepository.save(board);
  }
}
