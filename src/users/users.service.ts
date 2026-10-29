import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateUserDto } from './dto/createUserDto.js';
import { updateUserDto } from './dto/updateUserDto.js';

@Injectable()
export class UsersService {
  async delete(id: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) throw new BadRequestException('Usuário não encontrado');

    return await this.prisma.user.delete({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });
  }
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    try {
      return await this.prisma.user.create({
        data: {
          name: createUserDto.name,
          email: createUserDto.email,
          passwordHash: createUserDto.password,
        },
        select: {
          id: true,
          name: true,
          email: true,
        },
      });
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Erro ao criar usuário');
    }
  }

  async findAllUsers() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        tasks: true,
      },
    });
  }

  async findOneUser(id: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        tasks: true,
      },
    });

    if (!user) throw new BadRequestException('Usuário não encontrado');

    return user;
  }
  async update(id: number, body: updateUserDto) {
    return await this.prisma.user.update({
      where: {
        id,
      },
      data: {
        name: body.name ? body.name : undefined,
        email: body.email ? body.email : undefined,
        passwordHash: body.password ? body.password : undefined,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });
  }
}
