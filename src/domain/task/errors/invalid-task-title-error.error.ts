export class InvalidTaskTitleError extends Error {
  constructor(message: string = 'Invalid task title') {
    super(message);
    this.name = 'InvalidTaskTitleError';
  }
}
