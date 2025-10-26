import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { Prisma } from 'generated/prisma';

@Injectable()
export class HeadTeacherRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.Head_TeacherCreateInput) {
    return this.prisma.head_Teacher.create({ data });
  }

  async findAll() {
    return this.prisma.head_Teacher.findMany({include: { teacher: true }});
  }

  async findId(id: number) {
    return this.prisma.head_Teacher.findUnique({where: { id }, include: { teacher: true }});
  }

  async update(id: number, data: Prisma.Head_TeacherUpdateInput) {
    return this.prisma.head_Teacher.update({where: { id }, data});
  }

  async delete(id: number) {
    return this.prisma.head_Teacher.delete({where: { id }});
  }
}