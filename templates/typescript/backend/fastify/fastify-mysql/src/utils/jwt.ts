import { config } from '@shared';
import { JwtPayload } from '@appTypes';

// Fastify JWT handles sign/verify via fastify.jwt — these helpers
// are thin wrappers used only outside of route handlers (e.g. tests)
export const jwtConfig = {
  secret: config.jwt.secret,
  sign: { expiresIn: config.jwt.expiresIn },
};
