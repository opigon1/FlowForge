import { CreateBoardUseCase } from '@/domain/board/use-case/create-board.use-case';
import { CreateColumnUseCase } from '@/domain/column/use-case/create-column.use-case';
import { CreateTaskUseCase } from '@/domain/task/use-case/create-task.use-case';
import { GetBoardUseCase } from '@/domain/board/use-case/get-board.use-case';
import { MoveTaskUseCase } from '@/domain/task/use-case/move-task.use-case';
import { RenameTaskUseCase } from '@/domain/task/use-case/rename-task.use-case';
import { PrismaBoardRepository } from '@/infrastructure/repositories/prisma-board-repository';
import { DeleteTaskUseCase } from '@/domain/task/use-case/delete-task.use-case';
import { RenameColumnUseCase } from '@/domain/column/use-case/rename-column.use-case';
import { DeleteColumnUseCase } from '@/domain/column/use-case/delete-column.use-case';
import { ChangeColumnTaskLimitUseCase } from '@/domain/column/use-case/change-column-limit.use-case';

const repository = new PrismaBoardRepository();

export function getCreateBoardUseCase() {
  return new CreateBoardUseCase(repository);
}

export function getMoveTaskUseCase() {
  return new MoveTaskUseCase(repository);
}

export function getCreateColumnUseCase() {
  return new CreateColumnUseCase(repository);
}

export function getRenameColumnUseCase() {
  return new RenameColumnUseCase(repository);
}

export function getDeleteColumnUseCase() {
  return new DeleteColumnUseCase(repository);
}

export function getChangeTaskLimitUseCase() {
  return new ChangeColumnTaskLimitUseCase(repository);
}

export function getCreateTaskUseCase() {
  return new CreateTaskUseCase(repository);
}

export function getBoardUseCase() {
  return new GetBoardUseCase(repository);
}

export function getRenameTaskUseCase() {
  return new RenameTaskUseCase(repository);
}

export function getDeleteTaskUseCase() {
  return new DeleteTaskUseCase(repository);
}
