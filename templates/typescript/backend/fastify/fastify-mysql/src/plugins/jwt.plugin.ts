import fp from 'fastify-plugin';
import fastifyJwt from '@fastify/jwt';
import { config } from '@shared';

// Registers @fastify/jwt globally — use fastify.jwt.sign() and request.jwtVerify()
export default fp(async (fastify) => {
  fastify.register(fastifyJwt, {
    secret: config.jwt.secret,
    sign: { expiresIn: config.jwt.expiresIn },
  });

  // Decorator so any route can do: fastify.authenticate(request, reply)
  fastify.decorate('authenticate', async (request: any, reply: any) => {
    try {
      await request.jwtVerify();
    } catch {
      reply.status(401).send({ success: false, message: 'Invalid or expired token' });
    }
  });
});
