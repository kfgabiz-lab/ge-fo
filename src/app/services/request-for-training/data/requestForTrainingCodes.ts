import type { CodeItem } from "@/app/services/training/data/trainingData";
import { fetchApi } from "@/lib/api";

export const TRAINING_JOB_TITLE_GROUP = "TRAININGJOBTITLE";
export const TRAINING_INVOLVEMENT_GROUP = "TRAININGJOIN";
export const TRAINING_VFD_TOPIC_GROUP = "TRAININGVFD";

export interface RequestForTrainingStep4Options {
  jobTitles: string[];
  studentInvolvement: string[];
  vfdTopics: string[];
}

export const emptyRequestForTrainingStep4Options: RequestForTrainingStep4Options = {
  jobTitles: [],
  studentInvolvement: [],
  vfdTopics: [],
};

async function fetchCodeLabels(groupCode: string): Promise<string[]> {
  try {
    const codes = await fetchApi<CodeItem[]>(`/api/v1/fo/codes/${groupCode}`);
    return (codes ?? []).map((code) => code.name);
  } catch {
    return [];
  }
}

export async function fetchRequestForTrainingStep4Options(): Promise<RequestForTrainingStep4Options> {
  const [jobTitles, studentInvolvement, vfdTopics] = await Promise.all([
    fetchCodeLabels(TRAINING_JOB_TITLE_GROUP),
    fetchCodeLabels(TRAINING_INVOLVEMENT_GROUP),
    fetchCodeLabels(TRAINING_VFD_TOPIC_GROUP),
  ]);
  return { jobTitles, studentInvolvement, vfdTopics };
}
