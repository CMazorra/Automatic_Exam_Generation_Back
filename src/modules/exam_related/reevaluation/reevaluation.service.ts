import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateReevaluationDto } from './dto/create-reevaluation.dto';
import { UpdateReevaluationDto } from './dto/update-reevaluation.dto';

@Injectable()
export class ReevaluationService {
  constructor(private readonly prisma: PrismaService) {}

  create(data: CreateReevaluationDto) {
    return this.prisma.reevaluation.create({ data });
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

  update(exam_id: number, student_id: number, teacher_id: number, data: UpdateReevaluationDto) {
    return this.prisma.reevaluation.update({
      where: {
        exam_id_student_id_teacher_id: {
          exam_id,
          student_id,
          teacher_id,
        },
      },
      data,
    });
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
