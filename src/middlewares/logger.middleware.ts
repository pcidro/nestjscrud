import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

interface AuthenticatedRequest extends Request {
  user?: {
    token: string;
    role: string;
  };
}

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const authorization = req.headers.authorization;

    if (authorization) {
      req.user = {
        token: authorization,
        role: 'admin',
      };
    }

    next();
  }
}
