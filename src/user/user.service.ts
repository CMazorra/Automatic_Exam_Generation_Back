import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService){}

  async create(data: CreateUserDto) {
    return this.prisma.user.create({data});
  }

  async findAll() {
    return this.prisma.user.findMany();
  }

  async findOne(id: number) {
    return this.prisma.user.findUnique({ where: {id_us: id}});
  }

  async update(id: number, data: UpdateUserDto) {
    return this.prisma.user.update({where: {id_us: id}, data});
  }

  async remove(id: number) {
    return this.prisma.user.delete({where: {id_us: id}})
  }
}
