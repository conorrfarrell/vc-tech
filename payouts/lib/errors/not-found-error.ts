import { CustomError } from './custom-error';

export default class NotFoundError extends CustomError {
  statusCode = 404;

  constructor(message?: string) {
    super(message);

    this.name = 'NotFoundError';
  }
}
