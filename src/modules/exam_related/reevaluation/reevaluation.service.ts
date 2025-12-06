import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateReevaluationDto } from './dto/create-reevaluation.dto';
import { UpdateReevaluationDto } from './dto/update-reevaluation.dto';

@Injectable()
export class ReevaluationService {
  constructor(private readonly prisma: PrismaService) {}

  create(data: CreateReevaluationDto) {
    return this.prisma.reevaluation.create({ data: {
    exam_id: data.exam_id,
    student_id: data.student_id,
    teacher_id: data.teacher_id,
  },
    });
  }

  findAll() {
    return this.prisma.reevaluation.findMany({
      include: {
         exam_student: true,
         teacher: true,
      },
    });
  }

  findOne(exam_id: number, student_id: number, teacher_id: number) {
    return this.prisma.reevaluation.findUnique({
      where: {
        exam_id_student_id_teacher_id: {
          exam_id,
          student_id,
          teacher_id,
        },
      },
    });
  }
  
  async update(exam_id: number, student_id: number, teacher_id: number, data: UpdateReevaluationDto) {
    const reevaluation = await this.prisma.reevaluation.findUnique({
       where: {
        exam_id_student_id_teacher_id: {exam_id, student_id, teacher_id}
       },
    });
    if (!reevaluation)
      throw new Error('Reevaluation not found');

    const updateReevaluation = await this.prisma.reevaluation.update({
      where: {
        exam_id_student_id_teacher_id: {exam_id, student_id, teacher_id}
      },
      data,
    });

    if(data.score !== undefined)
    {
      await this.prisma.exam_Student.update({
        where: {exam_id_student_id: {exam_id, student_id}},
        data: {score: data.score},
      });
    }
    return updateReevaluation;
  }

  remove(exam_id: number, student_id: number, teacher_id: number) {
    return this.prisma.reevaluation.delete({
      where:{
        exam_id_student_id_teacher_id:{
          exam_id,
          student_id,
          teacher_id,
        },
      },
    });
  }
}
