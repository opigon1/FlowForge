export class InvalidColumnPositionError extends Error {
  constructor(message = 'Position cannot be negative') {
    super(message);
  }
}
