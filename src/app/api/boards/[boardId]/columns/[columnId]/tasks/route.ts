import { NextResponse } from 'next/server';
import { createTaskSchema } from './task.schema';
import { getCreateTaskUseCase } from '@/shared/container/board.container';
import { handleApiError } from '@/shared/http/handle-api-error';

export async function POST(
  request: Request,
  {
    params,
  }: {
    params: Promise<{ boardId: string; columnId: string }>;
  },
) {
  try {
    const { boardId, columnId } = await params;
    const body = await request.json();
    const result = createTaskSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ message: 'Invalid request body' }, { status: 400 });
    }

    const { title } = result.data;
    const createTaskUseCase = getCreateTaskUseCase();
    const task = await createTaskUseCase.execute(boardId, columnId, title);

    const response = {
      id: task.getId(),
      title: task.getTitle().toString(),
      createdAt: task.getCreatedAt(),
      updatedAt: task.getUpdatedAt(),
    };

    return NextResponse.json(
      { message: 'Task created successfully', task: response },
      { status: 201 },
    );
  } catch (error) {
    return handleApiError(error);
  }
}
