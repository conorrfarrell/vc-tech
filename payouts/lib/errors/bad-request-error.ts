import { CustomError } from './custom-error';

export default class BadRequestError extends CustomError {
  statusCode = 400;

  constructor(message?: string) {
    super(message);

    this.name = 'BadRequest';
  }
}
