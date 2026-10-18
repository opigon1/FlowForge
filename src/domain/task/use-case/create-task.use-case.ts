import { Task } from '@/domain/task/task.entity';
import { BoardRepository } from '../../board/board.repository';
import { BoardNotFoundError } from '../../board/errors/board-not-found.error';
import { ColumnNotFoundError } from '../../board/errors/column-not-found.error';
import { TaskTitle } from '@/domain/task/value-objects/task-title.vo';

export class CreateTaskUseCase {
  constructor(private readonly boardRepository: BoardRepository) {}

  async execute(boardId: string, columnId: string, title: string): Promise<Task> {
    const board = await this.boardRepository.findById(boardId);
    if (!board) {
      throw new BoardNotFoundError();
    }
    const column = board.getColumns().find((col) => col.getId() === columnId);
    if (!column) {
      throw new ColumnNotFoundError();
    }
    const task = Task.create(new TaskTitle(title));
    column.addTask(task);
    await this.boardRepository.save(board);
    return task;
  }
}
