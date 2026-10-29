import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateUserDto } from './dto/createUserDto.js';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    return this.prisma.user.create({ data: createUserDto });
  }

  async findAllUsers() {
    return this.prisma.user.findMany({
      include: {
        tasks: true,
      },
    });
  }
  async findOneUser(id: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
      include: {
        tasks: true,
      },
    });

    if (!user) throw new BadRequestException('Usuário não encontrado');

    return user;
  }
}
