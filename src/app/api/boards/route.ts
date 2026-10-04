import { getCreateBoardUseCase } from '@/shared/container/board.container';
import { createBoardSchema } from './board.schema';
import { NextResponse } from 'next/server';
import { InvalidBoardTitleError } from '@/domain/board/errors/invalid-board-title.error';

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
      columns: board.getColumns(),
      createdAt: board.getCreatedAt(),
      updatedAt: board.getUpdatedAt(),
    };

    return NextResponse.json(
      { message: 'Board created successfully', board: response },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof SyntaxError) {
      return NextResponse.json({ message: 'Invalid JSON' }, { status: 400 });
    }

    if (error instanceof InvalidBoardTitleError) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }
    console.error(error);
    return NextResponse.json({ message: 'An unexpected error occurred' }, { status: 500 });
  }
}
