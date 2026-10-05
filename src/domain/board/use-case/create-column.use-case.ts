import { Column } from '@/domain/column/column.entity';
import { BoardRepository } from '../board.repository';
import { ColumnTitle } from '@/domain/column/value-objects/column-title.vo';
import { BoardNotFoundError } from '../errors/board-not-found.error';

export class CreateColumnUseCase {
  constructor(private readonly boardRepository: BoardRepository) {}

  async execute(boardId: string, title: string): Promise<Column> {
    const board = await this.boardRepository.findById(boardId);
    if (!board) {
      throw new BoardNotFoundError();
    }
    const position = board.getNextColumnPosition();
    const column = Column.create(new ColumnTitle(title), position);
    board.addColumn(column);
    await this.boardRepository.save(board);
    return column;
  }
}
