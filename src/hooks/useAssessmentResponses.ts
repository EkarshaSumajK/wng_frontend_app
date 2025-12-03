import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/services/api';

interface AssessmentResponsesData {
  assessment_id: string;
  template_name: string;
  category: string;
  title: string;
  school_id: string;
  class_id: string | null;
  total_students: number;
  statistics: {
    average_score: number | null;
    min_score: number | null;
    max_score: number | null;
    median_score: number | null;
    std_dev: number | null;
    percentiles: {
      '25th_percentile': number | null;
      '50th_percentile': number | null;
      '75th_percentile': number | null;
    };
  };
  student_results: Array<{
    student_id: string;
    student_name: string;
    total_score: number;
    completed_at: string;
    responses: Array<{
      question_id: string;
      question_text: string;
      answer: any;
      score: number;
    }>;
  }>;
}

export const useAssessmentResponses = (assessmentId: string | null) => {
  return useQuery({
    queryKey: ['assessment-responses', assessmentId],
    queryFn: () =>
      apiClient.get<AssessmentResponsesData>(
        `/assessments/results/assessment/${assessmentId}/all`
      ),
    enabled: !!assessmentId,
  });
};
