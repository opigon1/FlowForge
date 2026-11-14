import { NextResponse } from 'next/server';
import { createColumnSchema } from './columns.sсhema';
import { getCreateColumnUseCase } from '@/shared/container/board.container';
import { handleApiError } from '@/shared/http/handle-api-error';

export async function POST(request: Request, context: { params: Promise<{ boardId: string }> }) {
  try {
    const { boardId } = await context.params;
    const body = await request.json();
    const result = createColumnSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ message: result.error.issues }, { status: 400 });
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
    return handleApiError(error);
  }
}
