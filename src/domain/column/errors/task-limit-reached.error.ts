export class TaskLimitReachedError extends Error {
  constructor() {
    super('Task limit reached');
  }
}
