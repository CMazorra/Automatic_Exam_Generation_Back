import { Injectable } from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StudentService {
  constructor(private readonly prisma: PrismaService){}
  
  async create(data: CreateStudentDto) {
    return this.prisma.student.create({data});
  }

  async findAll() {
    return this.prisma.student.findMany({where: {user:{isActive:true}},include: {user:true}});
  }

  async findAllAll() {
    return this.prisma.student.findMany({include: {user:true}});
  }

  async findAllDeleted() {
    return this.prisma.student.findMany({where: {user:{isActive:false}},include: {user:true}});
  }

  async findOne(id: number) {
    return this.prisma.student.findFirst({where: {id, user:{isActive:true}}, include: {user: true}});
  }

  async findOneAll(id: number) {
    return this.prisma.student.findUnique({where: {id}, include: {user: true}});
  }

  async findOneDeleted(id: number) {
    return this.prisma.student.findFirst({where: {id, user:{isActive:false}}, include: {user: true}});
  }

  async update(id: number, data: UpdateStudentDto) {
    return this.prisma.student.update({where: {id}, data});
  }

  async remove(id: number) {
    return this.prisma.student.update({where: {id}, data:{ user:{ update:{isActive:false}}}});
  }

  async restore(id: number) {
    return this.prisma.student.update({where: {id}, data:{ user:{ update:{isActive:true}}}});
  }

  async getReevaluationComparisonReport() {
    const now = new Date();
    const twoSemestersAgo = new Date();
    twoSemestersAgo.setMonth(now.getMonth() - 12);

    const reviews = await this.prisma.exam_Student.findMany({where: {exam: {Approved_Exams: {some: {date: {gte: twoSemestersAgo, }}}}},include: {exam: {include: {subject: true,}},teacher: {include: {user: true,}}}});

    if (!reviews.length) {
      return { message: "No hay profesores que hayan calificado exámenes en los últimos dos semestres." };
    }

    const result = {};

    for (const r of reviews) {
      const teacherName = r.teacher.user.name;
      const subjectName = r.exam.subject.name;
      if (!result[teacherName]) {
        result[teacherName] = {};
      }
      if (!result[teacherName][subjectName]) {
        result[teacherName][subjectName] = 0;
      }
      result[teacherName][subjectName] += 1;
    }

  
  }

  async getStudentSubjects(studentId: number) {
  return this.prisma.student.findUnique({
    where: { id: studentId },
    select: {
      id: true,
      subjects: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
}

}
