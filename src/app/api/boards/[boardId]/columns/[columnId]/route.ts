import {
  getChangeTaskLimitUseCase,
  getDeleteColumnUseCase,
  getRenameColumnUseCase,
} from '@/shared/container/board.container';
import { changeColumnTaskLimitSchema, renameColumnSchema } from '../columns.sсhema';
import { NextResponse } from 'next/server';
import { handleApiError } from '@/shared/http/handle-api-error';

export async function PATCH(
  request: Request,
  context: { params: Promise<{ boardId: string; columnId: string }> },
) {
  try {
    const { boardId, columnId } = await context.params;
    const body = await request.json();

    const hasTitle = Object.hasOwn(body, 'title');
    const hasTaskLimit = Object.hasOwn(body, 'taskLimit');

    if (hasTitle === hasTaskLimit) {
      return NextResponse.json(
        { message: 'Provide exactly one field: title or taskLimit' },
        { status: 400 },
      );
    }

    if (hasTitle) {
      const result = renameColumnSchema.safeParse(body);
      if (!result.success) {
        return NextResponse.json({ message: result.error.issues }, { status: 400 });
      }
      const { title } = result.data;
      const renameColumnUseCase = getRenameColumnUseCase();
      await renameColumnUseCase.execute(boardId, columnId, title);

      return NextResponse.json({ message: 'Column renamed successfully' }, { status: 200 });
    }

    if (hasTaskLimit) {
      const result = changeColumnTaskLimitSchema.safeParse(body);
      if (!result.success) {
        return NextResponse.json({ message: result.error.issues }, { status: 400 });
      }
      const { taskLimit } = result.data;
      const changeTaskLimitUseCase = getChangeTaskLimitUseCase();
      const column = await changeTaskLimitUseCase.execute(
        boardId,
        columnId,
        taskLimit ?? undefined,
      );

      return NextResponse.json(
        {
          message: 'Column task limit changed successfully',
          column: {
            id: column.getId(),
            taskLimit: column.getTaskLimit(),
          },
        },
        { status: 200 },
      );
    }

    return NextResponse.json({ message: 'Provide either title or taskLimit' }, { status: 400 });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(
  _: Request,
  context: { params: Promise<{ boardId: string; columnId: string }> },
) {
  try {
    const { boardId, columnId } = await context.params;
    const deleteColumnUseCase = getDeleteColumnUseCase();
    await deleteColumnUseCase.execute(boardId, columnId);
    return NextResponse.json({ message: 'column deleted successfully' }, { status: 200 });
  } catch (error) {
    return handleApiError(error);
  }
}
