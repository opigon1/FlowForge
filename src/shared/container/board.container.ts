import { MoveTaskUseCase } from '@/domain/board/use-case/move-task.use-case';
import { PrismaBoardRepository } from '@/infrastructure/repositories/prisma-board-repository';

export function getMoveTaskUseCase() {
  const repository = new PrismaBoardRepository();
  return new MoveTaskUseCase(repository);
}
