import { Global, Module } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { AuthController } from './auth.controller.js';
import { HashingService } from './hash/hashing.service.js';
import { BCryptService } from './hash/bcrypt.service.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { ConfigModule } from '@nestjs/config';
import jwtConfig from './config/jwt.config.js';

@Global()
@Module({
  imports: [PrismaModule, ConfigModule.forFeature(jwtConfig)],
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: HashingService,
      useClass: BCryptService,
    },
  ],
  exports: [HashingService],
})
export class AuthModule {}
