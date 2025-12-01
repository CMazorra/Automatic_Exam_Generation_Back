import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { NotFoundException } from '@nestjs/common';

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

  async getTeachersBySubject(subjectId: number) {
  const subject = await this.prisma.subject.findUnique({
    where: { id: subjectId },
    include: {
      teachers: {
        include: {
          user: true // opcional, si quieres datos del usuario
        }
      }
    }
  });

  if (!subject) {
    throw new NotFoundException(`La asignatura con ID ${subjectId} no existe.`);
  }

  return subject.teachers;
}

async getSubjectStudents(subjectId: number) {
  return this.prisma.subject.findUnique({
    where: { id: subjectId },
    select: {
      id: true,
      name: true,
      students: {
        select: {
          id: true,
          user: {
            select: {
              name: true,
              account: true,
              age: true,
            },
          },
        },
      },
    },
  });
}



}
