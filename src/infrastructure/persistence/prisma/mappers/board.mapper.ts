import { Board } from '@/domain/board/board.entity';
import { Prisma } from '@../prisma/generated/client';
import { Task } from '@/domain/task/task.entity';
import { TaskTitle } from '@/domain/task/value-objects/task-title.vo';
import { ColumnTitle } from '@/domain/column/value-objects/column-title.vo';
import { Column } from '@/domain/column/column.entity';
import { BoardTitle } from '@/domain/board/value-objects/board-title.vo';

type PrismaBoardWithRelations = Prisma.BoardGetPayload<{
  include: {
    columns: {
      include: {
        tasks: true;
      };
    };
  };
}>;

export class BoardMapper {
  static toDomain(data: PrismaBoardWithRelations): Board {
    const columns = data.columns.map((column) => {
      return Column.restore(
        column.id,
        new ColumnTitle(column.title),
        column.position,
        column.tasks.map((task) =>
          Task.restore(task.id, new TaskTitle(task.title), task.createdAt, task.updatedAt),
        ),
        column.createdAt,
        column.updatedAt,
      );
    });
    return Board.restore(
      data.id,
      new BoardTitle(data.title),
      columns,
      data.createdAt,
      data.updatedAt,
    );
  }
}
