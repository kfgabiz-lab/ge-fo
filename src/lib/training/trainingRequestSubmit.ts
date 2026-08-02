import { fetchApi } from "@/lib/api";

export interface TrainingRequestProduct {
  id: number;
  name: string;
  type: string;
  groupId: number;
  groupTitle: string;
}

export interface TrainingRequestSubmitPayload {
  trainingTrack: string;
  firstName: string;
  lastName: string;
  company: string;
  streetAddress: string;
  address2: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  email: string;
  title: string;
  cellPhone: string;
  salesContact: string;

  sessionCount: string;
  sessionDays: string;
  scheduleStart: string;
  scheduleEnd: string;
  studentCount: string;

  trainingFormat: string;
  locationName: string;
  locationStreetAddress: string;
  locationAddress2: string;
  locationCity: string;
  locationState: string;
  locationZip: string;
  contactPerson: string;
  contactDetails: string;

  selectedProducts: TrainingRequestProduct[];
  jobTitles: string[];
  studentInvolvement: string[];
  vfdUnderstanding: string;
  vfdUnderstandingTopics: string[];
  comments: string;
  consentChecked: boolean;
  recaptchaToken: string;
}

export interface TrainingRequestSubmitResponse {
  id: number;
}

export async function submitTrainingRequest(
  payload: TrainingRequestSubmitPayload,
): Promise<TrainingRequestSubmitResponse> {
  return fetchApi<TrainingRequestSubmitResponse>("/api/v1/fo/training/requests", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}
