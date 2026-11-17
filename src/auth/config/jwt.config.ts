import { registerAs } from '@nestjs/config';
import { StringValue } from 'ms';

export default registerAs('jwt', () => {
  return {
    secret: process.env.JWT_SECRET,
    audience: process.env.JWT_TOKEN_AUDIENCE,
    issuer: process.env.JWT_TOKEN_ISSUE,
    jwtTtl: process.env.JWT_TTL as StringValue,
  };
});
