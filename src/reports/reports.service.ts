import { Injectable } from "@nestjs/common";
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
}
