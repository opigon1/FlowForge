import { NextResponse } from 'next/server';
import { createTaskSchema } from './task.schema';
import { getCreateTaskUseCase } from '@/shared/container/board.container';
import { BoardNotFoundError } from '@/domain/board/errors/board-not-found.error';
import { ColumnNotFoundError } from '@/domain/board/errors/column-not-found.error';
import { InvalidTaskTitleError } from '@/domain/task/errors/invalid-task-title-error.error';
import { TaskLimitReachedError } from '@/domain/column/errors/task-limit-reached-error.error';

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
    if (error instanceof SyntaxError) {
      return NextResponse.json({ message: 'Invalid JSON' }, { status: 400 });
    }

    if (error instanceof BoardNotFoundError) {
      return NextResponse.json({ message: error.message }, { status: 404 });
    }

    if (error instanceof ColumnNotFoundError) {
      return NextResponse.json({ message: error.message }, { status: 404 });
    }

    if (error instanceof InvalidTaskTitleError) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }

    if (error instanceof TaskLimitReachedError) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }

    return NextResponse.json({ message: 'An unexpected error occurred' }, { status: 500 });
  }
}
