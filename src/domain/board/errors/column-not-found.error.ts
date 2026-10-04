export class ColumnNotFoundError extends Error {
  constructor() {
    super('Column not found');
  }
}
