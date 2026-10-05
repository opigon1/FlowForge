export class InvalidColumnTitleError extends Error {
  constructor(message: string = 'Invalid column title') {
    super(message);
    this.name = 'InvalidColumnTitleError';
  }
}
