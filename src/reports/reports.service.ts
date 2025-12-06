import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { WorstQuestionReportDto } from "./dto/create-report.dto";
import { CorrelationReportDto } from "./dto/difficulty-correlation.dto";
import { difficultyToNumber, correlation } from "src/statistics/helpers";
import { average } from "simple-statistics";

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async getWorstQuestions(): Promise<WorstQuestionReportDto[]> {
    const questions = await this.prisma.question.findMany({
      include: {
        subject: true,
        teacher: {
          include: { user:true}
        },
        exam_questions: {
          include: {
            answers: true,
          },
        },
      },
    });

    const stats = questions.map((q) => {
      const answers = q.exam_questions.flatMap(eq => eq.answers);

      const total = answers.length;
      const avgScore = total === 0 ? 0 : answers.reduce((sum,a) => sum + a.score, 0)/total;

      return {
        questionId: q.id,
        questionText: q.question_text,
        difficulty: q.difficulty,
        subject:q.subject.name,
        teacher: q.teacher.user.name,
        totalAnswers: total,
        averageScore: avgScore,
        answers,
      };
  })
   .filter(q => q.totalAnswers > 0);
  return stats.sort((a,b) => a.averageScore - b.averageScore).slice(0,10);
  }
   async getDifficultyCorrelation(): Promise<CorrelationReportDto[]> {
    const subjects = await this.prisma.subject.findMany({
      include: {
        questions: {
          include: {
            exam_questions: {
              include: {
                answers: true,
                exam: true,
              }
            }
          }
        }
      }
    });

    const reports: CorrelationReportDto[] = [];
    for (const subject of subjects) {
      let difficultyValues: number[] = [];
      let performanceValues: number[] = [];

      for (const q of subject.questions) {
        const difficultyNum = difficultyToNumber(q.difficulty);

        const allAnswers = q.exam_questions.flatMap(eq => eq.answers);
        if (allAnswers.length === 0) continue;
        const correct = allAnswers.filter(a =>
          a.answer_text.trim().toLowerCase() === q.answer.trim().toLowerCase()
        ).length;

        const performance = correct / allAnswers.length;

        difficultyValues.push(difficultyNum);
        performanceValues.push(performance);
      }
      const corr = correlation(difficultyValues, performanceValues);

      reports.push({
        subjectId: subject.id,
        subjectName: subject.name,
        correlation: corr,
        difficultyValues,
        performanceValues,
        totalSamples: difficultyValues.length
      });
    }
    return reports;
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

  async getReevaluationComparisonReport() {
    const reevals = await this.prisma.reevaluation.findMany({
      where:{
        score:{
          not:null
        }
      },
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
      const recalifiedScore = r.score!;
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
}
