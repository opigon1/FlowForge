import { NextResponse } from 'next/server';
import { renameTaskSchema } from './task.schema';
import { getDeleteTaskUseCase, getRenameTaskUseCase } from '@/shared/container/board.container';
import { handleApiError } from '@/shared/http/handle-api-error';

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
    return handleApiError(error);
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
    return handleApiError(error);
  }
}
