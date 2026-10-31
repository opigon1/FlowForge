import { BoardRepository } from '@/domain/board/board.repository';
import { BoardNotFoundError } from '@/domain/board/errors/board-not-found.error';
import { ColumnNotFoundError } from '@/domain/board/errors/column-not-found.error';
import { Column } from '@/domain/column/column.entity';

export class ChangeColumnTaskLimitUseCase {
  constructor(private readonly boardRepository: BoardRepository) {}

  async execute(
    boardId: string,
    columnId: string,
    newTaskLimit: number | undefined,
  ): Promise<Column> {
    const board = await this.boardRepository.findById(boardId);

    if (!board) {
      throw new BoardNotFoundError();
    }

    const column = board.getColumns().find((column) => column.getId() === columnId);

    if (!column) {
      throw new ColumnNotFoundError();
    }

    column.changeTaskLimit(newTaskLimit);
    await this.boardRepository.save(board);
    return column;
  }
}
