import { getRenameColumnUseCase } from '@/shared/container/board.container';
import { renameColumnSchema } from '../columns.sсhema';
import { NextResponse } from 'next/server';
import { ColumnNotFoundError } from '@/domain/board/errors/column-not-found.error';
import { BoardNotFoundError } from '@/domain/board/errors/board-not-found.error';
import { DuplicateColumnTitleError } from '@/domain/board/errors/duplicate-column-title.error';
import { InvalidColumnTitleError } from '@/domain/column/errors/invalid-column-title-error.error';

export async function PATCH(
  request: Request,
  context: { params: Promise<{ boardId: string; columnId: string }> },
) {
  try {
    const { boardId, columnId } = await context.params;
    const body = await request.json();
    const result = renameColumnSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ message: result.error.issues }, { status: 400 });
    }

    const { title } = result.data;
    const renameColumnUseCase = getRenameColumnUseCase();
    await renameColumnUseCase.execute(boardId, columnId, title);

    return NextResponse.json({ message: 'Column renamed successfully' }, { status: 200 });
  } catch (error) {
    if (error instanceof SyntaxError) {
      return NextResponse.json({ message: 'Invalid JSON' }, { status: 400 });
    }

    if (error instanceof BoardNotFoundError) {
      return NextResponse.json({ message: error.message }, { status: 404 });
    }
    if (error instanceof ColumnNotFoundError) {
      return NextResponse.json({ message: error.message }, { status: 404 });
    }

    if (error instanceof InvalidColumnTitleError) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }
    if (error instanceof DuplicateColumnTitleError) {
      return NextResponse.json({ message: error.message }, { status: 409 });
    }
    console.error(error);
    return NextResponse.json({ message: 'An unexpected error occurred' }, { status: 500 });
  }
}
