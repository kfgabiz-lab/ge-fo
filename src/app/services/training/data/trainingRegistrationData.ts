import { fetchApi } from "@/lib/api";
import type { CodeItem } from "@/app/support/contact-us/data/contactUsData";

export type { CodeItem };

export interface TrainingRegistrationRequest {
  curriculumId: number;
  sessionId: number;
  studentName: string;
  email: string;
  jobTitle: string;
  phone: string;
  companyName: string;
  eventDate: string;
  streetAddress?: string;
  address2?: string;
  apartment?: string;
  city?: string;
  stateProvince?: string;
  zipCode?: string;
  typeOfBusiness?: string;
  privacyConsentFlag: boolean;
  recaptchaToken: string;
}

export interface TrainingRegistrationResponse {
  success: boolean;
  id: number;
  message: string;
}

export async function fetchBusinessTypes(): Promise<CodeItem[]> {
  return fetchApi<CodeItem[]>("/api/v1/fo/codes/BUSINESSTYPE");
}

export async function submitTrainingRegistration(
  payload: TrainingRegistrationRequest,
): Promise<TrainingRegistrationResponse> {
  return fetchApi<TrainingRegistrationResponse>(
    "/api/v1/fo/training/registrations",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    },
  );
}
