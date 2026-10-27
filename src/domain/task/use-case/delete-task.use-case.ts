import { BoardRepository } from '@/domain/board/board.repository';
import { BoardNotFoundError } from '@/domain/board/errors/board-not-found.error';
import { TaskNotFoundError } from '@/domain/board/errors/task-not-found.error';

export class DeleteTaskUseCase {
  constructor(private readonly boardRepository: BoardRepository) {}

  async execute(boardId: string, taskId: string): Promise<void> {
    const board = await this.boardRepository.findById(boardId);
    if (!board) {
      throw new BoardNotFoundError();
    }
    const column = board.getColumns().find((column) => column.hasTask(taskId));

    if (!column) {
      throw new TaskNotFoundError();
    }

    column.removeTask(taskId);
    await this.boardRepository.save(board);
  }
}
