import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import jwtConfig from '../config/jwt.config.js';
import { REQUEST_TOKEN_PAYLOAD } from '../common/auth.constants.js';

interface AuthenticatedRequest extends Request {
  request_token_payload?: {
    id: number;
    name: string;
    email: string;
  };
}

@Injectable()
export class TokenAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtconfig: ConfigType<typeof jwtConfig>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: AuthenticatedRequest = context.switchToHttp().getRequest();
    const token = this.extractTokenHeader(request);
    if (!token) {
      throw new UnauthorizedException('Token not found');
    }

    try {
      const payLoad = await this.jwtService.verifyAsync(token, this.jwtconfig);
      request[REQUEST_TOKEN_PAYLOAD] = payLoad;
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException('Not authorized');
    }
    return true;
  }

  extractTokenHeader(request: Request) {
    const authorization = request.headers?.authorization;

    if (!authorization || typeof authorization !== 'string') {
      return undefined;
    }
    return authorization.split(' ')[1];
  }
}
