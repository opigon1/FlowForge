export class ColumnNotFoundError extends Error {
  constructor() {
    super('Column not found');
    this.name = 'ColumnNotFoundError';
  }
}
