import type { Schema } from 'joi';
import type { Request, Response, NextFunction } from 'express';
import BadRequestError from '../errors/bad-request-error';

const validate = (schema: Schema, prop: keyof Request = 'body') => (
  (req: Request, _: Response, next: NextFunction) => {
    const { error } = schema.validate(req[prop]);
    if (error) {
      throw new BadRequestError(error.message);
    }
    next();
  }
);

export default validate;
