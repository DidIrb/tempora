import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '@utils';
import { respond } from '@shared';

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    respond(res, 401, 'No token provided');
    return;
  }
  try {
    req.user = verifyToken(authHeader.split(' ')[1]);
    next();
  } catch {
    respond(res, 401, 'Invalid or expired token');
  }
};
