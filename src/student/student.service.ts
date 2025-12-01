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
    return this.prisma.student.findUnique({where: {id, user:{isActive:true}}, include: {user: true}});
  }

  async findOneAll(id: number) {
    return this.prisma.student.findUnique({where: {id}, include: {user: true}});
  }

  async findOneDeleted(id: number) {
    return this.prisma.student.findUnique({where: {id, user:{isActive:false}}, include: {user: true}});
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

  const reevals = await this.prisma.reevaluation.findMany({
    include: {
      exam_student: {
        include: {
          exam: { include: { subject: true }},
          student: { include: { user: true }}
        }
      },
      teacher: { include: { user: true }}
    }
  });

  if (!reevals.length) return {};

  const subjectAvgCache: Record<number, number | null> = {};
  const result = {};   // 👈 YA NO ES UN ARRAY

  for (const r of reevals) {
    const examStudent = r.exam_student;
    if (!examStudent) continue;

    const exam = examStudent.exam;
    const subject = exam?.subject;
    const student = examStudent.student;

    const originalScore = examStudent.score;
    const recalifiedScore = r.score;
    const subjectId = subject?.id ?? null;
    const subjectName = subject?.name ?? "Sin asignatura";
    const studentName = student.user?.name ?? "Sin nombre";

    // ----------- PROMEDIO POR ASIGNATURA -----------
    let subjectAverage: number | null = null;

    if (subjectId !== null) {
      if (subjectAvgCache[subjectId] !== undefined) {
        subjectAverage = subjectAvgCache[subjectId];
      } else {
        const agg = await this.prisma.exam_Student.aggregate({
          where: {
            exam: { subject_id: subjectId }
          },
          _avg: { score: true }
        });
        subjectAverage = agg._avg?.score ?? null;
        subjectAvgCache[subjectId] = subjectAverage;
      }
    }

    // ---------- ARMAR OBJETO RESULTADO ----------
    if (!result[studentName]) {
      result[studentName] = {};
    }

    if (!result[studentName][subjectName]) {
      result[studentName][subjectName] = [];
    }

    result[studentName][subjectName].push({
      examId: exam.id,
      originalScore,
      recalifiedScore,
      subjectAverage,
      diffBefore: subjectAverage !== null ? Number((originalScore - subjectAverage).toFixed(3)) : null,
      diffAfter: subjectAverage !== null ? Number((recalifiedScore - subjectAverage).toFixed(3)) : null,
    });
  }

  return result;
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
