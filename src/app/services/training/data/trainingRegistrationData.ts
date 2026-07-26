// Training 세션 등록(Registration Form) 옵션 조회 + 제출 헬퍼 + 타입
// - 규칙 근거: docs/ge_guide/fo/fo-api연동가이드.md (컴포넌트 직접 fetch 금지, fetchApi 경유)
// - 참고 패턴: fo/src/app/support/contact-us/data/contactUsData.ts (codes API + 제출 헬퍼)
// - CodeItem 타입은 contactUsData 의 것을 재사용(중복 정의 금지).
import { fetchApi } from "@/lib/api";
import type { CodeItem } from "@/app/support/contact-us/data/contactUsData";

export type { CodeItem };

// ---------------- 저장 API 요청/응답 타입 ----------------

// POST /api/v1/fo/training/registrations 요청 바디
// - curriculumId/sessionId 는 세션 상세 route 의 courseId/sessionId(page_data.id) 숫자값.
// - eventDate 는 세션 시작일("yyyy-MM-dd") 문자열(서버에서 LocalDate 파싱).
// - typeOfBusiness 는 공통코드 BUSINESSTYPE 코드값(001/002/003, 선택).
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

// POST /api/v1/fo/training/registrations 성공 응답(201)
export interface TrainingRegistrationResponse {
  success: boolean;
  id: number;
  message: string;
}

// ---------------- 조회/제출 함수 ----------------

// 비즈니스 유형 옵션(셀렉트) — groupCode BUSINESSTYPE (기존 코드그룹 재사용)
export async function fetchBusinessTypes(): Promise<CodeItem[]> {
  return fetchApi<CodeItem[]>("/api/v1/fo/codes/BUSINESSTYPE");
}

// 등록 접수 저장. 성공 시 201 응답(TrainingRegistrationResponse) 반환.
// 실패(400 등)는 fetchApi 가 Error 를 throw 하므로 호출부에서 catch 처리한다.
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
