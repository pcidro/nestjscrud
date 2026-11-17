import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { HashingService } from './hash/hashing.service.js';
import jwtConfig from './config/jwt.config.js';
import type { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { StringValue } from 'ms';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private readonly hashingService: HashingService,
    @Inject(jwtConfig.KEY)
    private readonly jwtconfig: ConfigType<typeof jwtConfig>,
    private readonly jwtService: JwtService,
  ) {}

  async autenticate(loginDto: LoginDto) {
    const user = await this.prisma.user.findFirst({
      where: {
        email: loginDto.email,
      },
    });
    if (!user) {
      throw new HttpException(
        'usuario não encontrado',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const passwordIsValid = await this.hashingService.compare(
      loginDto.password,
      user.passwordHash,
    );

    if (!passwordIsValid) {
      throw new HttpException(
        'Senha ou Email incorretos',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const token = await this.jwtService.signAsync(
      {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      {
        secret: this.jwtconfig.secret,
        audience: this.jwtconfig.audience,
        issuer: this.jwtconfig.issuer,
        expiresIn: this.jwtconfig.jwtTtl as StringValue,
      },
    );

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      token,
    };
  }
}
