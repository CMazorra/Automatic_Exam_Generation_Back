import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { Prisma } from 'generated/prisma';

@Injectable()
export class StudentRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.StudentCreateInput) {
    return this.prisma.student.create({ data });
  }

  async findAll() {
    return this.prisma.student.findMany({include: { user: true }});
  }

  async findId(id: number) {
    return this.prisma.student.findUnique({where: { id }, include: { user: true }});
  }

  async update(id: number, data: Prisma.StudentUpdateInput) {
    return this.prisma.student.update({where: { id }, data});
  }

  async delete(id: number) {
    return this.prisma.student.delete({where: { id }});
  }
}
