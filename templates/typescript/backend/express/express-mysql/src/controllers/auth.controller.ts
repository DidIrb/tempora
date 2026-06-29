import { Request, Response } from 'express';
import { prisma, respond } from '@shared';
import { hashPassword, comparePassword, generateToken } from '@utils';
import { SignupBody, LoginBody } from '@appTypes';

export const signup = async (req: Request<{}, {}, SignupBody>, res: Response): Promise<void> => {
  const { name, email, password } = req.body;
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) { respond(res, 409, 'Email already in use'); return; }
  const hashed = await hashPassword(password);
  const user = await prisma.user.create({ data: { name, email, password: hashed } });
  const token = generateToken({ userId: user.id, email: user.email });
  respond(res, 201, 'Account created', { token, user: { id: user.id, name: user.name, email: user.email } });
};

export const login = async (req: Request<{}, {}, LoginBody>, res: Response): Promise<void> => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await comparePassword(password, user.password))) {
    respond(res, 401, 'Invalid credentials'); return;
  }
  const token = generateToken({ userId: user.id, email: user.email });
  respond(res, 200, 'Login successful', { token, user: { id: user.id, name: user.name, email: user.email } });
};
