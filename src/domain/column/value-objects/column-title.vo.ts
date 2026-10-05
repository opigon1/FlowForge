import { MAX_COLUMN_TITLE_LENGTH, MIN_COLUMN_TITLE_LENGTH } from '@/shared/constants/columns';
import { InvalidColumnTitleError } from '../errors/invalid-column-title-error.error';

export class ColumnTitle {
  private readonly value: string;
  constructor(title: string) {
    const normalized = title.trim();
    if (!normalized || normalized.length === 0) {
      throw new InvalidColumnTitleError('Column title cannot be empty');
    }

    if (
      normalized.length > MAX_COLUMN_TITLE_LENGTH ||
      normalized.length < MIN_COLUMN_TITLE_LENGTH
    ) {
      throw new InvalidColumnTitleError(
        `Column title must be between ${MIN_COLUMN_TITLE_LENGTH} and ${MAX_COLUMN_TITLE_LENGTH} characters`,
      );
    }

    this.value = normalized;
  }

  toString(): string {
    return this.value;
  }

  equals(other: ColumnTitle): boolean {
    return this.value === other.value;
  }
}
