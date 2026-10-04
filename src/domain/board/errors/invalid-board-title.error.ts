export class InvalidBoardTitleError extends Error {
  constructor(message: string = 'Invalid board title') {
    super(message);
    this.name = 'InvalidBoardTitleError';
  }
}
