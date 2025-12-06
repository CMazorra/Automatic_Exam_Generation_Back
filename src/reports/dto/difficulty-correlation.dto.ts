export class CorrelationReportDto {
  subjectId: number;
  subjectName: string;
  correlation: number;
  difficultyValues: number[];
  performanceValues: number[];
  totalSamples: number;
}
