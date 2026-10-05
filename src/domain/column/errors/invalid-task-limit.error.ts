export class InvalidTaskLimitError extends Error {
  constructor(message = 'Task limit must be greater than zero') {
    super(message);
  }
}
