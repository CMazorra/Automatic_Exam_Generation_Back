import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class TeacherRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.TeacherCreateInput) {
    return this.prisma.teacher.create({ data });
  }

  async findAll() {
    return this.prisma.teacher.findMany({include: { user: true }});
  }

  async findId(id: number) {
    return this.prisma.teacher.findUnique({where: { id }, include: { user: true }});
  }

  async update(id: number, data: Prisma.TeacherUpdateInput) {
    return this.prisma.teacher.update({where: { id }, data});
  }

  async delete(id: number) {
    return this.prisma.teacher.delete({where: { id }});
  }
}
