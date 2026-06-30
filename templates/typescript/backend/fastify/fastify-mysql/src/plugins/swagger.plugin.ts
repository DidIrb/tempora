import fp from 'fastify-plugin';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import { config } from '@shared';

export default fp(async (fastify) => {
  fastify.register(fastifySwagger, {
    openapi: {
      info: { title: 'Fastify MySQL API', version: '1.0.0', description: 'REST API with JWT auth and Todo CRUD' },
      servers: [{ url: `http://localhost:${config.port}` }],
      components: {
        securitySchemes: {
          bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
        },
      },
    },
  });

  fastify.register(fastifySwaggerUi, {
    routePrefix: '/api/docs',
  });
});
