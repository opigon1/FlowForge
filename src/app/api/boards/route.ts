import { getCreateBoardUseCase } from '@/shared/container/board.container';
import { createBoardSchema } from './board.schema';
import { NextResponse } from 'next/server';
import { handleApiError } from '@/shared/http/handle-api-error';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = createBoardSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ message: 'Invalid request body' }, { status: 400 });
    }

    const { title } = result.data;
    const createBoardUseCase = getCreateBoardUseCase();
    const board = await createBoardUseCase.execute(title);
    const response = {
      id: board.getId(),
      title: board.getTitle().toString(),
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
      createdAt: board.getCreatedAt(),
      updatedAt: board.getUpdatedAt(),
    };

    return NextResponse.json(
      { message: 'Board created successfully', board: response },
      { status: 201 },
    );
  } catch (error) {
    return handleApiError(error);
  }
}
