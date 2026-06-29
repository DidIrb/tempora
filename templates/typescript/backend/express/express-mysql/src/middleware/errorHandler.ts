import { Request, Response, NextFunction } from 'express';
import { respond } from '@shared';

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error(err.stack);
  respond(res, 500, 'Internal server error');
};
