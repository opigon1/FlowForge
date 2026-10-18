import { BoardNotFoundError } from '@/domain/board/errors/board-not-found.error';
import { BoardRepository } from '@/domain/board/board.repository';
import { TaskNotFoundError } from '@/domain/board/errors/task-not-found.error';
import { TaskTitle } from '../value-objects/task-title.vo';
import { ColumnNotFoundError } from '@/domain/board/errors/column-not-found.error';

export class RenameTaskUseCase {
  constructor(private readonly boardRepository: BoardRepository) {}

  async execute(boardId: string, taskId: string, newTitle: string): Promise<void> {
    const board = await this.boardRepository.findById(boardId);
    if (!board) {
      throw new BoardNotFoundError();
    }
    const column = board.getColumns().find((column) => column.hasTask(taskId));

    if (!column) {
      throw new ColumnNotFoundError();
    }
    const task = column.findTask(taskId);
    if (!task) {
      throw new TaskNotFoundError();
    }

    task.rename(new TaskTitle(newTitle));

    await this.boardRepository.save(board);
  }
}
