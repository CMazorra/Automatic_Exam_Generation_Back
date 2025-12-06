import { Controller, Get } from "@nestjs/common";
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
}
