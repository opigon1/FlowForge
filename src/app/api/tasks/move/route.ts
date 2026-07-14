import { moveTaskUseCase } from '@/shared/container/task.container';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json();

  await moveTaskUseCase.execute({
    taskId: body.taskId,
    newColumnId: body.newColumnId,
  });

  return NextResponse.json({ message: 'Task moved successfully' });
}
