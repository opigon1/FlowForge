import {
  BoardNotFoundError,
  CannotRemoveLastColumnError,
  ColumnNotFoundError,
  DuplicateColumnTitleError,
  InvalidBoardTitleError,
  TaskNotFoundError,
} from '@/domain/board/errors';
import {
  InvalidColumnPositionError,
  InvalidColumnTitleError,
  InvalidTaskLimitError,
} from '@/domain/column/errors/index';
import { InvalidTaskTitleError } from '@/domain/task/errors';
import { NextResponse } from 'next/server';

export function handleApiError(error: unknown) {
  if (error instanceof SyntaxError) {
    return NextResponse.json({ message: 'Invalid JSON' }, { status: 400 });
  }

  if (error instanceof BoardNotFoundError) {
    return NextResponse.json({ message: error.message }, { status: 404 });
  }

  if (error instanceof CannotRemoveLastColumnError) {
    return NextResponse.json({ message: error.message }, { status: 409 });
  }

  if (error instanceof ColumnNotFoundError) {
    return NextResponse.json({ message: error.message }, { status: 404 });
  }

  if (error instanceof DuplicateColumnTitleError) {
    return NextResponse.json({ message: error.message }, { status: 409 });
  }

  if (error instanceof InvalidBoardTitleError) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }

  if (error instanceof TaskNotFoundError) {
    return NextResponse.json({ message: error.message }, { status: 404 });
  }

  if (error instanceof InvalidColumnTitleError) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }

  if (error instanceof InvalidColumnPositionError) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }

  if (error instanceof InvalidTaskLimitError) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }

  if (error instanceof InvalidTaskTitleError) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }

  console.error(error);
  return NextResponse.json({ message: 'An unexpected error occurred' }, { status: 500 });
}
