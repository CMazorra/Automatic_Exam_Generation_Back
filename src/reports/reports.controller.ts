import { Controller, Get, Param } from "@nestjs/common";
import { ReportsService } from "./reports.service";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { WorstQuestionReportDto } from "./dto/create-report.dto";
import { CorrelationReportDto } from "./dto/difficulty-correlation.dto";

@ApiTags("Reports")
@Controller("reports")
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Get("worst-questions")
  @ApiOperation({
    summary: "Obtiene las 10 preguntas con mayor tasa de reprobación",
  })
  @ApiResponse({
    status: 200,
    type: [WorstQuestionReportDto],
  })
  async getWorstQuestions() {
    return this.reportsService.getWorstQuestions();
  }

   @Get("difficulty-performance-correlation")
   @ApiOperation({
    summary: "Obtiene la correlación entre dificultad y desempeño por materia",
  })
  @ApiResponse({
    status: 200,
    type: [CorrelationReportDto],
  })
  async correlationReport() {
    return this.reportsService.getDifficultyCorrelation();
  }

  @Get(':id/exam-performance')
  @ApiOperation({
    summary: "desempeno de los estudiantes dado un examen",
  })
  getPerformance(@Param('id') id: string) {
    return this.reportsService.getExamPerformance(+id);
  }

  @Get("teachers-review-report")
  @ApiOperation({
    summary: "profesores que han realizado examenes en los utimos dos semestres",
  })
  getTeachersReviewReport() {
    return this.reportsService.getTeachersReviewReport();
  }

  @Get("reevaluation-comparison")
  @ApiOperation({
    summary: "desempeno de los estudiantes que han solicitado una recalificacion",
  })
  getReevaluationComparisonReport() {
    return this.reportsService.getReevaluationComparisonReport();
  }
}
