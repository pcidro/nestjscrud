import { Global, Module } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { AuthController } from './auth.controller.js';
import { HashingService } from './hash/hashing.service.js';
import { BCryptService } from './hash/bcrypt.service.js';

@Global()
@Module({
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
