import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { WorstQuestionReportDto } from "./dto/create-report.dto";
import { CorrelationReportDto } from "./dto/difficulty-correlation.dto";
import { difficultyToNumber, correlation, balanceScore, subtopicVarietyScore } from "src/statistics/helpers";
import { examComparisonResultDTO, subjectSummaryDTO, examSummaryDTO } from './dto/exam-distribution.dto';
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

    const stats: WorstQuestionReportDto[] = [];

    for ( const q of questions)
    {
      const allAnswers = q.exam_questions.flatMap(eq => eq.answers);
      const validAnswers = allAnswers.filter(a => (a.score ?? 0) > 0);
      if(validAnswers.length === 0) continue;
      const maxScore = q.score ?? 1;
      const avgSCore = validAnswers.reduce(
        (acc,a) => acc + ((a.score ?? 0) / maxScore), 0
      ) /validAnswers.length;

      if (!q.subject || !q.teacher?.user) continue;

      stats.push({
        questionId: q.id,
        questionText: q.question_text,
        difficulty: q.difficulty,
        subject: q.subject?.name ?? "Desconocido",
        teacher: q.teacher?.user?.name ?? "Desconocido",
        totalAnswers: allAnswers.length,
        averageScore: avgSCore
      });
    }
    return stats.sort((a,b)=> a.averageScore - b.averageScore)
    .slice(0,10);
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
   async compareExamsBetweenSubjects(subjectIds?: number[]): Promise<examComparisonResultDTO> {

    if (!subjectIds)
    {
      const allsubjects = await this.prisma.subject.findMany({
        select: { id: true }
      });
      subjectIds = allsubjects.map(s => s.id);
    }
    
    const subjects = await this.prisma.subject.findMany({
      where: { id: { in: subjectIds } },
      include: {
        exams: {
          include: {
            exam_questions: {
              include: {
                question: {
                  include: {
                    sub_topic: {
                      include: {
                        topic: true
                      }
                    },
                    subject: true,
                  }
                }
              }
            },
            parameters: true
          }
        }
      }
    });

    const result: subjectSummaryDTO[] = [];

    for (const subject of subjects) {
      const examSummaries: examSummaryDTO[] = [];

      for (const exam of subject.exams) {
        const questions: NonNullable<typeof exam.exam_questions>[number]["question"][] = [];
        for (const eq of exam.exam_questions ?? []) {
          const question = eq?.question;
          if (!question || !question.subject) continue;
          questions.push(question);
        }

        const totalQuestions = questions.length;

        // ----------------------
        // DISTRIBUCIÓN DIFICULTAD
        // ----------------------
        const difficultyCounts = { easy: 0, medium: 0, hard: 0 };
        const numericalDiffs: number[] = [];

        for (const q of questions) {
          const d = q.difficulty?.toUpperCase?.() ?? "";

          if (d.includes("FÁCIL")) difficultyCounts.easy++;
          else if (d.includes("MEDIO")) difficultyCounts.medium++;
          else if (d.includes("DIFÍCIL")) difficultyCounts.hard++;

          numericalDiffs.push(difficultyToNumber(q.difficulty ?? "MEDIO"));
        }

        const difficultyScore = balanceScore(numericalDiffs);

        // ----------------------
        // DISTRIBUCIÓN TEMAS
        // ----------------------
        const topicMap: Record<string, number> = {};

        for (const q of questions) {
          const topicName = q.sub_topic?.topic?.name ?? "Desconocido";
          topicMap[topicName] = (topicMap[topicName] || 0) + 1;
        }

        const topicDistribution = Object.entries(topicMap).map(([topicName, count]) => ({
          topicName,
          count,
          percentage: totalQuestions > 0 ? (count / totalQuestions) * 100 : 0,
        }));

        const topicValues = Object.values(topicMap);
        const topicEntropy = balanceScore(topicValues);

        // ----------------------
        // VARIEDAD SUBTEMAS
        // ----------------------
        const subtopicCounts: Record<number, number> = {};

        for (const q of questions) {
          const subId = q.sub_topic_id;
          if (subId == null) continue;
          subtopicCounts[subId] = (subtopicCounts[subId] || 0) + 1;
        }

        const varietyScore = subtopicVarietyScore(subtopicCounts);

        // ----------------------
        // EVALUACIÓN DEL BALANCE
        // ----------------------
        const balanced = {
          difficulty: difficultyScore >= 0.6,
          topic: topicEntropy >= 0.6,
          subtopic: varietyScore >= 0.5,
        };

        // ----------------------
        // AGREGAR RESUMEN DEL EXAMEN
        // ----------------------
        examSummaries.push({
          examId: exam.id,
          examName: exam.name,
          totalQuestions,
          difficultyDistribution: {
            easy: difficultyCounts.easy,
            medium: difficultyCounts.medium,
            hard: difficultyCounts.hard,
            difficultyScore
          },
          topicDistribution,
          subtopicVariey: varietyScore,
          metrics: {
            difficultyScore,
            topicEntropy,
            subtopicVarietyScore: varietyScore
          },
          balanced,
          parameters: exam.parameters
        });
      }

      // puntaje global de la asignatura
      const subjectBalanceScore =
        examSummaries.length > 0
          ? examSummaries.reduce((acc, e) => acc + e.metrics.difficultyScore, 0) / examSummaries.length
          : 0;

      result.push({
        subjectId: subject.id,
        subjectName: subject.name,
        examSummaries,
        subjectBalanceScore
      });
    }

    return { subjects: result };
  }
}

