export class difficultyDistributionDTO {
  easy: number;
  medium: number;
  hard: number;
  difficultyScore: number;
}

export class topicDistributionDTO{
  topicName: string;
  count: number;
  percentage: number;
}

export class examMetricDTO{
  difficultyScore: number;
  topicEntropy: number;
  subtopicVarietyScore: number;
}

export class examBalancedDTO{
  difficulty: boolean;
  topic: boolean;
  subtopic: boolean;
}

export class examSummaryDTO{
  examId: number;
  examName: string;
  totalQuestions: number;
  difficultyDistribution: difficultyDistributionDTO;
  topicDistribution: topicDistributionDTO[];
  subtopicVariey: number;
  metrics: examMetricDTO;
  balanced: examBalancedDTO;
  parameters?: any;
}

export class subjectSummaryDTO {
  subjectId: number;
  subjectName: string;
  examSummaries: examSummaryDTO[];
  subjectBalanceScore: number; // 0..1
}

export class examComparisonResultDTO{
  subjects: subjectSummaryDTO [];
}