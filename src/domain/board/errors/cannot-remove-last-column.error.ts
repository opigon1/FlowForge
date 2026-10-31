export class CannotRemoveLastColumnError extends Error {
  constructor() {
    super('Cannot remove the last column from the board');
    this.name = 'CannotRemoveLastColumnError';
  }
}
