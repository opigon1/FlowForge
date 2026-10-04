export class BoardNotFoundError extends Error {
  constructor() {
    super('Board not found');
    this.name = 'BoardNotFoundError';
  }
}
