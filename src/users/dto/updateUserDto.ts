import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './createUserDto.js';

export class updateUserDto extends PartialType(CreateUserDto) {}
