export abstract class CustomError extends Error {
  abstract statusCode: number;

  constructor(message?: string) {
    super(message);
    Object.setPrototypeOf(this, CustomError.prototype);
  }

  get status() {
    return this.statusCode;
  }

  get json() {
    return {
      status: this.status,
      name: this.name,
      message: this.message,
    };
  }
}
