import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  HttpException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateUserDto } from './dto/createUserDto.js';
import { updateUserDto } from './dto/updateUserDto.js';
import { HashingService } from '../auth/hash/hashing.service.js';
import { payLoadTokenDto } from '../auth/dto/payload.dto.js';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private hashService: HashingService,
  ) {}

  private handleError(error: unknown): never {
    if (error instanceof HttpException) {
      throw error;
    }

    console.error(error);
    throw new InternalServerErrorException(
      'Erro interno ao processar solicitação',
    );
  }

  private validateUser(id: number, tokenPayload: payLoadTokenDto) {
    if (id !== tokenPayload.id) {
      throw new ForbiddenException('Usuário não autorizado');
    }
  }

  async delete(id: number, tokenPayload: payLoadTokenDto) {
    try {
      this.validateUser(id, tokenPayload);

      const user = await this.prisma.user.findUnique({
        where: { id },
      });

      if (!user) {
        throw new BadRequestException('Usuário não encontrado');
      }

      return await this.prisma.user.delete({
        where: { id },
        select: {
          id: true,
          name: true,
          email: true,
        },
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  async create(createUserDto: CreateUserDto) {
    try {
      const passwordHash = await this.hashService.hash(createUserDto.password);

      return await this.prisma.user.create({
        data: {
          name: createUserDto.name,
          email: createUserDto.email,
          passwordHash,
        },
        select: {
          id: true,
          name: true,
          email: true,
        },
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  async findAllUsers() {
    try {
      return await this.prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          tasks: true,
        },
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  async findOneUser(id: number) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
          email: true,
          tasks: true,
        },
      });

      if (!user) {
        throw new BadRequestException('Usuário não encontrado');
      }

      return user;
    } catch (error) {
      this.handleError(error);
    }
  }

  async update(id: number, body: updateUserDto, tokenPayload: payLoadTokenDto) {
    try {
      this.validateUser(id, tokenPayload);

      const user = await this.prisma.user.findUnique({
        where: { id },
      });

      if (!user) {
        throw new BadRequestException('Usuário não encontrado');
      }

      const dataUser: {
        name?: string;
        passwordHash?: string;
        email?: string;
      } = {
        name: body.name || undefined,
        email: body.email || undefined,
      };

      if (body.password) {
        dataUser.passwordHash = await this.hashService.hash(body.password);
      }

      return await this.prisma.user.update({
        where: { id },
        data: dataUser,
        select: {
          id: true,
          name: true,
          email: true,
        },
      });
    } catch (error) {
      this.handleError(error);
    }
  }
}
