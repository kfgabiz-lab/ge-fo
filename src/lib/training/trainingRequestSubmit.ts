// Training Request(Step1~4) 제출 — POST /api/v1/fo/training/requests
// 규칙 근거: docs/ge_guide/fo/fo-api연동가이드.md (컴포넌트 직접 fetch 금지, fetchApi 경유)
// 요청 바디는 BE TrainingRequestSubmitRequest 와 1:1 대응(camelCase).
// - Step3 의 장소/주소 항목은 Step1 필드명과 겹쳐 BE 가 location 접두사를 쓰므로 호출부에서 매핑해 넘긴다.
import { fetchApi } from "@/lib/api";

/** 선택 제품 1건 — BE TrainingRequestSubmitRequest.SelectedProduct 와 동일 구조 */
export interface TrainingRequestProduct {
  id: number;
  name: string;
  /** 트리 구분 — P(Power) / A(Automation) */
  type: string;
  /** 어느 그룹(두 번째 드롭다운) 아래에서 고른 제품인지 */
  groupId: number;
  groupTitle: string;
}

/** POST /api/v1/fo/training/requests 요청 바디 */
export interface TrainingRequestSubmitPayload {
  // ===== Step1: Basic Information =====
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

  // ===== Step2: Requested Date(s) of Training =====
  sessionCount: string;
  sessionDays: string;
  /** "yyyy-MM-dd" */
  scheduleStart: string;
  /** "yyyy-MM-dd" */
  scheduleEnd: string;
  studentCount: string;

  // ===== Step3: Training Class Location (Step1 과 이름 충돌을 피하려 location 접두사 사용) =====
  trainingFormat: string;
  locationName: string;
  locationStreetAddress: string;
  locationAddress2: string;
  locationCity: string;
  locationState: string;
  locationZip: string;
  contactPerson: string;
  contactDetails: string;

  // ===== Step4: Training Class Details =====
  selectedProducts: TrainingRequestProduct[];
  jobTitles: string[];
  studentInvolvement: string[];
  vfdUnderstanding: string;
  vfdUnderstandingTopics: string[];
  comments: string;
  consentChecked: boolean;
  /** reCAPTCHA 토큰 — BE 검증용, 저장되지 않음 */
  recaptchaToken: string;
}

/** 성공 응답 — 저장된 신청 id 만 반환 */
export interface TrainingRequestSubmitResponse {
  id: number;
}

/**
 * 교육 신청 저장. 성공 시 { id } 반환.
 * 실패(400 유효성 오류 등)는 fetchApi 가 Error 를 throw 하므로 호출부에서 catch 한다
 * (contact-us 제출 헬퍼 submitContactUs 와 동일 컨벤션).
 */
export async function submitTrainingRequest(
  payload: TrainingRequestSubmitPayload,
): Promise<TrainingRequestSubmitResponse> {
  return fetchApi<TrainingRequestSubmitResponse>("/api/v1/fo/training/requests", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}
