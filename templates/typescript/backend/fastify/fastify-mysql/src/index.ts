import 'dotenv/config';
import Fastify from 'fastify';
import { config } from '@shared';
import { jwtPlugin, corsPlugin, swaggerPlugin } from '@plugins';
import { authRoutes, todoRoutes } from '@routes';

const fastify = Fastify({ logger: true });

const start = async () => {
  // Plugins — order matters: swagger before routes so schemas are picked up
  await fastify.register(swaggerPlugin);
  await fastify.register(corsPlugin);
  await fastify.register(jwtPlugin);

  // Routes
  await fastify.register(authRoutes, { prefix: '/api/auth' });
  await fastify.register(todoRoutes, { prefix: '/api/todos' });

  await fastify.listen({ port: config.port, host: '0.0.0.0' });
  fastify.log.info(`API Docs at http://localhost:${config.port}/api/docs`);
};

start().catch((err) => {
  fastify.log.error(err);
  process.exit(1);
});
