import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { REQUEST_TOKEN_PAYLOAD } from '../common/auth.constants.js';

interface AuthenticatedRequest extends Request {
  request_token_payload?: {
    id: number;
    name: string;
    email: string;
  };
}

export const TokenPayloadParam = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const context = ctx.switchToHttp();
    const request: AuthenticatedRequest =
      context.getRequest<AuthenticatedRequest>();
    return request[REQUEST_TOKEN_PAYLOAD];
  },
);
