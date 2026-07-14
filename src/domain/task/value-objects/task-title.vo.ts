import { MAX_TASK_TITLE_LENGTH, MIN_TASK_TITLE_LENGTH } from '@/shared/constants/task';

export class TaskTitle {
  private readonly value: string;
  constructor(title: string) {
    const normalized = title.trim();
    if (!normalized || normalized.length === 0) {
      throw new Error('Task title cannot be empty');
    }

    if (normalized.length > MAX_TASK_TITLE_LENGTH || normalized.length < MIN_TASK_TITLE_LENGTH) {
      throw new Error(
        `Task title must be between ${MIN_TASK_TITLE_LENGTH} and ${MAX_TASK_TITLE_LENGTH} characters`,
      );
    }

    this.value = normalized;
  }

  toString(): string {
    return this.value;
  }

  equals(other: TaskTitle): boolean {
    return this.value === other.value;
  }
}
