import { BoardNotFoundError } from '@/domain/board/errors/board-not-found.error';
import { ColumnNotFoundError } from '@/domain/board/errors/column-not-found.error';
import { TaskNotFoundError } from '@/domain/board/errors/task-not-found.error';
import { TaskLimitReachedError } from '@/domain/column/errors/task-limit-reached.error';
import { getMoveTaskUseCase } from '@/shared/container/board.container';
import { NextResponse } from 'next/server';
import { moveTaskSchema } from './move-task.schema';

export async function POST(
  request: Request,
  context: {
    params: Promise<{
      boardId: string;
      taskId: string;
    }>;
  },
) {
  try {
    const { boardId, taskId } = await context.params;
    const body = await request.json();
    const result = moveTaskSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ message: 'Invalid request body' }, { status: 400 });
    }

    const { targetColumnId } = result.data;
    const moveTaskUseCase = getMoveTaskUseCase();
    await moveTaskUseCase.execute({
      boardId,
      taskId,
      targetColumnId,
    });

    return NextResponse.json({ message: 'Task moved successfully' });
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

    if (error instanceof TaskNotFoundError) {
      return NextResponse.json({ message: error.message }, { status: 404 });
    }

    if (error instanceof TaskLimitReachedError) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }

    return NextResponse.json({ message: 'An unexpected error occurred' }, { status: 500 });
  }
}
