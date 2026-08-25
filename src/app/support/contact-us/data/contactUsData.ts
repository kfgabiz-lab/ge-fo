import { fetchApi } from "@/lib/api";

export interface CodeItem {
  code: string;
  name: string;
}

export interface ContactUsInquiryRequest {
  type: string;
  productCategory?: string;
  productId?: number;
  email: string;
  firstName: string;
  lastName: string;
  companyName: string;
  country: string;
  description: string;
  password: string;
  confirmPassword: string;
  marketingOptInFlag: boolean;
  privacyConsentFlag: boolean;
}

export interface ContactUsInquiryResponse {
  success: boolean;
  id: number;
  message: string;
}

export async function fetchCountries(): Promise<CodeItem[]> {
  return fetchApi<CodeItem[]>("/api/v1/fo/codes/COUNTRYNAME");
}

export async function submitContactUs(
  payload: ContactUsInquiryRequest,
): Promise<ContactUsInquiryResponse> {
  return fetchApi<ContactUsInquiryResponse>("/api/v1/fo/contact-us", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export interface ContactUsDetailRequest {
  caseNumber: string;
  password: string;
}

export interface ContactUsDetailResponse {
  type: string;
  productCategory: string | null;
  status: string;
  description: string;
  reply: string | null;
  inquiryDate: string;
  replyDate: string | null;
}

export async function fetchContactUsDetail(
  payload: ContactUsDetailRequest,
): Promise<ContactUsDetailResponse> {
  return fetchApi<ContactUsDetailResponse>("/api/v1/public/contact-us/answer", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}
