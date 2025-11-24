import { Injectable,  NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateExamDto } from './dto/create-exam.dto';
import { UpdateExamDto } from './dto/update-exam.dto';

@Injectable()
export class ExamService {
  constructor(private readonly prisma: PrismaService) {}

  create(data: CreateExamDto) {
    return this.prisma.exam.create({ data });
  }

  findAll() {
    return this.prisma.exam.findMany({
      include: {
        subject: true,
        teacher: true,
        head_teacher: true,
        parameters: true,
        exam_questions: true,
        exam_students: true,
      },
    });
  }

  findOne(id: number) {
    return this.prisma.exam.findUnique({
      where: { id },
      include: {
        subject: true,
        teacher: true,
        head_teacher: true,
        parameters: true,
        exam_questions: true,
        exam_students: true,
      },
    });
  }

  update(id: number, data: UpdateExamDto) {
    return this.prisma.exam.update({
      where: { id },
      data,
    });
  }

  remove(id: number) {
    return this.prisma.exam.delete({
      where: { id },
    });
  }

  async getExamPerformance(examId: number){
    const examQuestions = await this.prisma.exam_Question.findMany({
      where: { exam_id: examId },
      include: {
        question: true,
        answers: true
    }
    });
    if (!examQuestions.length) {
      throw new NotFoundException("No hay preguntas asociadas al examen");
    }
    const report = examQuestions.map(eq => {
      const q = eq.question;
      const answers = eq.answers;

    const totalAttempts = answers.length;

    const correctCount = answers.filter(
      a => a.answer_text.trim().toLowerCase() === q.answer.trim().toLowerCase()
    ).length;

    const accuracyRate = totalAttempts > 0 ? correctCount / totalAttempts : 0;

    return {
      questionId: q.id,
      questionText: q.question_text,
      difficulty: q.difficulty,
      correctAnswer: q.answer,
      totalAttempts,
      correctCount,
      accuracyRate
    };
  });
  const groupedByDifficulty = report.reduce((groups, item) => {
    const difficulty = item.difficulty;

    if (!groups[difficulty]) {
      groups[difficulty] = [];
    }

    groups[difficulty].push(item);

    return groups;
  }, {} as Record<string, typeof report>);

  return {
    examId,
    totalQuestions: report.length,
    groupedByDifficulty
  };
  }
}
