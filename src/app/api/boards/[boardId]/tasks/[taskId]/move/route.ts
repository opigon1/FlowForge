import { getMoveTaskUseCase } from '@/shared/container/board.container';
import { NextResponse } from 'next/server';
import { moveTaskSchema } from './move-task.schema';
import { handleApiError } from '@/shared/http/handle-api-error';

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
    return handleApiError(error);
  }
}
