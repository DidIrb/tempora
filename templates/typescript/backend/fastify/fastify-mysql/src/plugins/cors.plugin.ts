import fp from 'fastify-plugin';
import fastifyCors from '@fastify/cors';
import { config } from '@shared';

export default fp(async (fastify) => {
  fastify.register(fastifyCors, {
    origin: config.corsOrigin,
  });
});
