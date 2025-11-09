import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateApprovedExamDto } from './dto/create-approved_exam.dto';
import { UpdateApprovedExamDto } from './dto/update-approved_exam.dto';

@Injectable()
export class approved_examService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateApprovedExamDto) {
    const {exam_id, head_teacher_id, guidelines} = data;

    const exam = await this.prisma.exam.findUnique({
      where: { id: exam_id },
    });

    if(!exam){
      throw new Error('Exam not found');
    }

    const lower = guidelines.toLowerCase();
    const isRejected = lower.includes('rechazado')

    await this.prisma.exam.update({
      where: {id:exam_id},
      data: {status : isRejected ? 'rejected' : 'approved'},
    });

    if (isRejected)
    {
      await this.prisma.exam.create({
        data: {
          name: `${exam.name} (Corrections Required`,
          status: 'pending',
          difficulty: exam.difficulty,
          subject_id: exam.subject_id,
          teacher_id: exam.teacher_id,
          parameters_id : exam.parameters_id,
          head_teacher_id: exam.head_teacher_id,
        },
      });
    }

    return this.prisma.approved_Exam.create({
      data: { exam_id, head_teacher_id, guidelines},
    });
  }

  findAll() {
    return this.prisma.approved_Exam.findMany({
      include: {
        exam: true,
        head_teacher: true,
      },
    });
  }

  findOne(date: Date, exam_id: number, head_teacher_id: number) {
    return this.prisma.approved_Exam.findUnique({
      where:{
        date_exam_id_head_teacher_id: {
          date,
          exam_id,
          head_teacher_id,
      },
    },
    include: {
        exam: true,
        head_teacher: true,
    },
    });
  }

  update(date: Date, exam_id: number, head_teacher_id: number, data: UpdateApprovedExamDto) {
    return this.prisma.approved_Exam.update({
      where: {
        date_exam_id_head_teacher_id: {
          date,
          exam_id,
          head_teacher_id,
        },
      },
      data,
    });
  }

  remove(date: Date, exam_id: number, head_teacher_id: number) {
    return this.prisma.approved_Exam.delete({
      where: {
        date_exam_id_head_teacher_id: {
          date,
          exam_id,
          head_teacher_id,
        },
      },
    });
  }
}
