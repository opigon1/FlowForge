import { MAX_BOARD_TITLE_LENGTH, MIN_BOARD_TITLE_LENGTH } from '@/shared/constants/board/index';
import { InvalidBoardTitleError } from '../errors/invalid-board-title.error';

export class BoardTitle {
  private readonly value: string;
  constructor(title: string) {
    const normalized = title.trim();
    if (!normalized) {
      throw new InvalidBoardTitleError('Board title cannot be empty');
    }

    if (normalized.length > MAX_BOARD_TITLE_LENGTH || normalized.length < MIN_BOARD_TITLE_LENGTH) {
      throw new InvalidBoardTitleError(
        `Board title must be between ${MIN_BOARD_TITLE_LENGTH} and ${MAX_BOARD_TITLE_LENGTH} characters`,
      );
    }

    this.value = normalized;
  }

  toString(): string {
    return this.value;
  }

  equals(other: BoardTitle): boolean {
    return this.value === other.value;
  }
}
