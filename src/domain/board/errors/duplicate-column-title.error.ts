export class DuplicateColumnTitleError extends Error {
  constructor() {
    super('A column with this title already exists in the board');
    this.name = 'DuplicateColumnTitleError';
  }
}
