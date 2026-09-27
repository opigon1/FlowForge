import { MAX_BOARD_TITLE_LENGTH, MIN_BOARD_TITLE_LENGTH } from '@/shared/constants/board/index';

export class BoardTitle {
  private readonly value: string;
  constructor(title: string) {
    const normalized = title.trim();
    if (!normalized || normalized.length === 0) {
      throw new Error('Board title cannot be empty');
    }

    if (normalized.length > MAX_BOARD_TITLE_LENGTH || normalized.length < MIN_BOARD_TITLE_LENGTH) {
      throw new Error(
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
