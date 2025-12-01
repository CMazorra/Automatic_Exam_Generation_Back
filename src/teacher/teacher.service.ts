import { Injectable } from '@nestjs/common';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TeacherService {
  constructor(private readonly prisma: PrismaService ){}
  
  async create(data: CreateTeacherDto) {
    return this.prisma.teacher.create({data});
  }

  async findAll() {
    return this.prisma.teacher.findMany({where: {user:{isActive:true}},include: {user:true}});
  }

  async findAllAll() {
    return this.prisma.teacher.findMany({include: {user:true}});
  }

  async findAllDeleted() {
    return this.prisma.teacher.findMany({where: {user:{isActive:false}},include: {user:true}});
  }

  async findOne(id: number) {
    return this.prisma.teacher.findFirst({where: {id, user:{isActive:true}}, include: {user: true}});
  }

  async findOneAll(id: number) {
    return this.prisma.teacher.findUnique({where: {id}, include: {user: true}});
  }

  async findOneDeleted(id: number) {
    return this.prisma.teacher.findFirst({where: {id, user:{isActive:false}}, include: {user: true}});
  }

  async update(id: number, data: UpdateTeacherDto) {
    return this.prisma.teacher.update({where: {id}, data});
  }

  async remove(id: number) {
    return this.prisma.teacher.update({where: {id}, data:{ user:{ update:{isActive:false}}}});
  }

  async restore(id: number) {
    return this.prisma.teacher.update({where: {id}, data:{ user:{ update:{isActive:true}}}});
  }
  //Dado un profesor me devuelve sus asignaturas
async getSubjectsByTeacher(teacherId: number) {
  const teacher = await this.prisma.teacher.findUnique({
    where: { id: teacherId },
    include: { subjects: true },
  });

  return teacher?.subjects ?? [];
}







  async getTeachersReviewReport() {
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

    return result;
}

}
