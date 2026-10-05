import { CreateBoardUseCase } from '@/domain/board/use-case/create-board.use-case';
import { CreateColumnUseCase } from '@/domain/board/use-case/create-column.use-case';
import { MoveTaskUseCase } from '@/domain/board/use-case/move-task.use-case';
import { PrismaBoardRepository } from '@/infrastructure/repositories/prisma-board-repository';

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
