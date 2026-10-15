import { BoardNotFoundError } from '@/domain/board/errors/board-not-found.error';
import { getBoardUseCase } from '@/shared/container/board.container';
import { NextResponse } from 'next/server';

export async function GET(_: Request, context: { params: Promise<{ boardId: string }> }) {
  try {
    const { boardId } = await context.params;
    const getBoard = getBoardUseCase();
    const board = await getBoard.execute(boardId);

    const response = {
      id: board.getId(),
      title: board.getTitle().toString(),
      createdAt: board.getCreatedAt(),
      updatedAt: board.getUpdatedAt(),
      columns: board.getColumns().map((column) => ({
        id: column.getId(),
        title: column.getTitle().toString(),
        position: column.getPosition(),
        taskLimit: column.getTaskLimit() ?? null,
        createdAt: column.getCreatedAt(),
        updatedAt: column.getUpdatedAt(),
        tasks: column.getTasks().map((task) => ({
          id: task.getId(),
          title: task.getTitle().toString(),
          createdAt: task.getCreatedAt(),
          updatedAt: task.getUpdatedAt(),
        })),
      })),
    };

    return NextResponse.json({ message: 'Board retrieved successfully', board: response });
  } catch (error) {
    if (error instanceof BoardNotFoundError) {
      return NextResponse.json({ message: error.message }, { status: 404 });
    }
    console.error(error);
    return NextResponse.json({ message: 'An unexpected error occurred' }, { status: 500 });
  }
}
