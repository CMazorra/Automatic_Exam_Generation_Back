import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';

@Injectable()
export class SubjectService {
  constructor(private prisma: PrismaService) {}

  create(data: CreateSubjectDto) {
    return this.prisma.subject.create({ data });
  }

  findAll() {
    return this.prisma.subject.findMany({ include: { head_teacher: true } });
  }

  findOne(id: number) {
    return this.prisma.subject.findUnique({ where: { id }, include: { head_teacher: true } });
  }

  update(id: number, data: UpdateSubjectDto) {
    return this.prisma.subject.update({ where: { id }, data });
  }

  remove(id: number) {
    return this.prisma.subject.delete({ where: { id } });
  }
}
