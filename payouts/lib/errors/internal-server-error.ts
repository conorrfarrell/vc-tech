import { CustomError } from './custom-error';

export default class InternalServerError extends CustomError {
  statusCode = 500;

  constructor(message?: string) {
    super(message);

    this.name = 'InternalServerError';
  }
}
