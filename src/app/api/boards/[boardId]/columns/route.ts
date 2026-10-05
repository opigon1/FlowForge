import { NextResponse } from 'next/server';
import { createColumnSchema } from './columns.sсhema';
import { getCreateColumnUseCase } from '@/shared/container/board.container';
import { BoardNotFoundError } from '@/domain/board/errors/board-not-found.error';
import { InvalidColumnTitleError } from '@/domain/column/errors/invalid-column-title-error.error';

export async function POST(request: Request, context: { params: Promise<{ boardId: string }> }) {
  try {
    const { boardId } = await context.params;
    const body = await request.json();
    const result = createColumnSchema.safeParse(body);

    if (!result.success) {
      return new Response(JSON.stringify({ message: 'Invalid request body' }), { status: 400 });
    }

    const { title } = result.data;
    const createColumnUseCase = getCreateColumnUseCase();
    const column = await createColumnUseCase.execute(boardId, title);

    const response = {
      id: column.getId(),
      title: column.getTitle(),
      position: column.getPosition(),
      createdAt: column.getCreatedAt(),
      updatedAt: column.getUpdatedAt(),
    };

    return NextResponse.json(
      { message: 'Column created successfully', column: response },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof SyntaxError) {
      return NextResponse.json({ message: 'Invalid JSON' }, { status: 400 });
    }

    if (error instanceof BoardNotFoundError) {
      return NextResponse.json({ message: error.message }, { status: 404 });
    }

    if (error instanceof InvalidColumnTitleError) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }

    return NextResponse.json({ message: 'An unexpected error occurred' }, { status: 500 });
  }
}
