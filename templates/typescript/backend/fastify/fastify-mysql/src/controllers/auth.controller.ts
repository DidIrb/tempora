import { FastifyRequest, FastifyReply } from 'fastify';
import { prisma, respond } from '@shared';
import { hashPassword, comparePassword } from '@utils';
import { SignupBody, LoginBody } from '@appTypes';

export const signup = async (
  request: FastifyRequest<{ Body: SignupBody }>,
  reply: FastifyReply
) => {
  const { name, email, password } = request.body;
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return respond(reply, 409, 'Email already in use');
  const hashed = await hashPassword(password);
  const user = await prisma.user.create({ data: { name, email, password: hashed } });
  const token = reply.jwtSign({ userId: user.id, email: user.email });
  return respond(reply, 201, 'Account created', { token, user: { id: user.id, name: user.name, email: user.email } });
};

export const login = async (
  request: FastifyRequest<{ Body: LoginBody }>,
  reply: FastifyReply
) => {
  const { email, password } = request.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await comparePassword(password, user.password))) {
    return respond(reply, 401, 'Invalid credentials');
  }
  const token = reply.jwtSign({ userId: user.id, email: user.email });
  return respond(reply, 200, 'Login successful', { token, user: { id: user.id, name: user.name, email: user.email } });
};
