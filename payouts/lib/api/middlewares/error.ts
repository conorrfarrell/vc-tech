import type { Response, Request, NextFunction } from 'express';
import { CustomError } from '../../errors/custom-error';

const errorHandler = (err: Error | CustomError, _: Request, res: Response, next: NextFunction) => {
  if (err instanceof CustomError) {
    res
      .status(err.status)
      .json(err.json);
    return next();
  }

  return res
    .status(500)
    .send(err.message);
};

export default errorHandler;
