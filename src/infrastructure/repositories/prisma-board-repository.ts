import { BoardRepository } from '@/domain/board/board.repository';
import { BoardMapper } from '@/infrastructure/persistence/prisma/mappers/board.mapper';
import { prisma } from '../database/prisma.client';
import { Board } from '@/domain/board/board.entity';

export class PrismaBoardRepository implements BoardRepository {
  async findById(id: string): Promise<Board | null> {
    const board = await prisma.board.findUnique({
      where: { id },
      include: { columns: { include: { tasks: true } } },
    });

    if (!board) {
      return null;
    }

    return BoardMapper.toDomain(board);
  }

  async create(board: Board): Promise<void> {
    await prisma.board.create({
      data: {
        id: board.getId(),
        title: board.getTitle().toString(),
        createdAt: board.getCreatedAt(),
        updatedAt: board.getUpdatedAt(),
      },
    });
  }

  async save(board: Board): Promise<void> {
    await prisma.$transaction(async (tx) => {
      await tx.board.update({
        where: {
          id: board.getId(),
        },
        data: {
          title: board.getTitle().toString(),
        },
      });

      const columnIds = board.getColumns().map((column) => column.getId());
      const taskIds = board
        .getColumns()
        .flatMap((column) => column.getTasks().map((task) => task.getId()));

      await tx.task.deleteMany({
        where: {
          columnId: { in: columnIds },
          id: { notIn: taskIds },
        },
      });

      await tx.column.deleteMany({
        where: {
          boardId: board.getId(),
          id: { notIn: columnIds },
        },
      });

      for (const column of board.getColumns()) {
        for (const task of column.getTasks()) {
          await tx.task.upsert({
            where: {
              id: task.getId(),
            },
            create: {
              id: task.getId(),
              title: task.getTitle().toString(),
              columnId: column.getId(),
            },
            update: {
              title: task.getTitle().toString(),
              columnId: column.getId(),
            },
          });
        }
      }

      for (const column of board.getColumns()) {
        await tx.column.upsert({
          where: {
            id: column.getId(),
          },
          create: {
            id: column.getId(),
            title: column.getTitle().toString(),
            position: column.getPosition(),
            boardId: board.getId(),
          },
          update: {
            title: column.getTitle().toString(),
            position: column.getPosition(),
          },
        });
      }
    });
  }
}
