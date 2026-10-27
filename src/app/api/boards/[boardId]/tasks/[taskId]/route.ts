import { NextResponse } from 'next/server';
import { renameTaskSchema } from './task.schema';
import { getDeleteTaskUseCase, getRenameTaskUseCase } from '@/shared/container/board.container';
import { InvalidTaskTitleError } from '@/domain/task/errors/invalid-task-title-error.error';
import { BoardNotFoundError } from '@/domain/board/errors/board-not-found.error';
import { TaskNotFoundError } from '@/domain/board/errors/task-not-found.error';
import { ColumnNotFoundError } from '@/domain/board/errors/column-not-found.error';

export async function PATCH(
  request: Request,
  context: { params: Promise<{ boardId: string; taskId: string }> },
) {
  try {
    const { boardId, taskId } = await context.params;
    const body = await request.json();
    const result = renameTaskSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ message: 'Invalid request body' }, { status: 400 });
    }

    const { title } = result.data;
    const renameTaskUseCase = getRenameTaskUseCase();
    await renameTaskUseCase.execute(boardId, taskId, title);
    return NextResponse.json({ message: 'Task renamed successfully' });
  } catch (error) {
    if (error instanceof SyntaxError) {
      return NextResponse.json({ message: 'Invalid JSON' }, { status: 400 });
    }

    if (error instanceof BoardNotFoundError) {
      return NextResponse.json({ message: error.message }, { status: 404 });
    }

    if (error instanceof TaskNotFoundError) {
      return NextResponse.json({ message: error.message }, { status: 404 });
    }

    if (error instanceof ColumnNotFoundError) {
      return NextResponse.json({ message: error.message }, { status: 404 });
    }

    if (error instanceof InvalidTaskTitleError) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }
    console.error(error);
    return NextResponse.json({ message: 'An unexpected error occurred' }, { status: 500 });
  }
}

export async function DELETE(
  _: Request,
  context: { params: Promise<{ boardId: string; taskId: string }> },
) {
  try {
    const { boardId, taskId } = await context.params;
    const deleteTaskUseCase = getDeleteTaskUseCase();
    await deleteTaskUseCase.execute(boardId, taskId);
    return NextResponse.json({ message: 'Task deleted successfully' });
  } catch (error) {
    if (error instanceof BoardNotFoundError) {
      return NextResponse.json({ message: error.message }, { status: 404 });
    }

    if (error instanceof TaskNotFoundError) {
      return NextResponse.json({ message: error.message }, { status: 404 });
    }
    console.error(error);
    return NextResponse.json({ message: 'An unexpected error occurred' }, { status: 500 });
  }
}
