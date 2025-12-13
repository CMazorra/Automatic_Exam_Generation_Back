import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateApprovedExamDto } from './dto/create-approved_exam.dto';
import { UpdateApprovedExamDto } from './dto/update-approved_exam.dto';
import { normalizeDate } from 'src/statistics/helpers';

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
    const date = normalizeDate(new Date());
    await this.prisma.exam.update({
      where: {id:exam_id},
      data: {status : isRejected ? 'Rechazado' : 'Aprobado'},
    });

    return this.prisma.approved_Exam.create({
      data: { date,exam_id, head_teacher_id, guidelines},
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
          date: normalizeDate(date),
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
          date: normalizeDate(date),
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
          date: normalizeDate(date),
          exam_id,
          head_teacher_id,
        },
      },
    });
  }


  //Task2
async listApprovedByHeadTeacher(headTeacherId: number) {
    return await this.prisma.approved_Exam.findMany({
      where: { head_teacher_id: headTeacherId },
      select: {
        exam: {
          select: {
            id: true,
            name: true,      
            subject: {
              select: { name: true }
            },
          },
        },
        date: true,
        guidelines: true,
      },
    });
  }









}
