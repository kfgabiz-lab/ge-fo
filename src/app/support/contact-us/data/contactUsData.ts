// Contact Us(문의 접수) 폼 옵션 조회 + 제출 헬퍼 + 타입
// - API 명세: docs/pages/contact-us/be_contact-us.md (3절 요청 스펙, 7절 FE 연동)
// - 규칙 근거: docs/ge_guide/fo/fo-api연동가이드.md (컴포넌트 직접 fetch 금지, fetchApi 경유)
// - 참고 패턴: fo/src/app/company/data/blogData.ts (codes API), warranty-policy 클라이언트 fetch
import { fetchApi } from "@/lib/api";

// ---------------- 공통코드 응답 타입 ----------------

// FoCodeResponse 형태 [{ code, name }] — 활성 코드만 sortOrder 오름차순
export interface CodeItem {
  code: string;
  name: string;
}

// ---------------- 저장 API 요청/응답 타입 ----------------

// POST /api/v1/fo/contact-us 요청 바디 (be_contact-us.md 3절 표)
// type/country 는 공통코드 API의 code(대문자)를 그대로 전송한다.
export interface ContactUsInquiryRequest {
  type: string;
  // 선택된 Lv1/Lv2/Lv3 라벨을 "카테고리1 | 카테고리2 | 카테고리3" 형태로 결합한 문자열
  productCategory?: string;
  // Lv3(제품)의 product-data PK — BE가 CTP ProductInformationInquiryType(담당자 이메일) 조회에 사용
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

// POST /api/v1/fo/contact-us 성공 응답 (be_contact-us.md 5절)
export interface ContactUsInquiryResponse {
  success: boolean;
  id: number;
  message: string;
}

// ---------------- 조회/제출 함수 ----------------

// 문의유형 옵션(라디오) — groupCode INQUIRY_TYPE
export async function fetchInquiryTypes(): Promise<CodeItem[]> {
  return fetchApi<CodeItem[]>("/api/v1/fo/codes/INQUIRY_TYPE");
}

// 국가 옵션(셀렉트) — groupCode COUNTRYCODE
export async function fetchCountries(): Promise<CodeItem[]> {
  return fetchApi<CodeItem[]>("/api/v1/fo/codes/COUNTRYCODE");
}

// 문의 접수 저장. 성공 시 201 응답(ContactUsInquiryResponse) 반환.
// 실패(400 등)는 fetchApi 가 Error 를 throw 하므로 호출부에서 catch 처리한다.
export async function submitContactUs(
  payload: ContactUsInquiryRequest,
): Promise<ContactUsInquiryResponse> {
  return fetchApi<ContactUsInquiryResponse>("/api/v1/fo/contact-us", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

// ---------------- View Response(문의 결과 조회) — 기존 CTP 전용 도메인 ----------------
// POST /api/v1/public/contact-us/answer 요청 바디 (ContactUsDetailRequest)
export interface ContactUsDetailRequest {
  caseNumber: string;
  password: string;
}

// POST /api/v1/public/contact-us/answer 성공 응답 (ContactUsDetailResponse)
export interface ContactUsDetailResponse {
  type: string;
  productCategory: string | null;
  status: string;
  description: string;
  reply: string | null;
  inquiryDate: string;
  replyDate: string | null;
}

// 문의 결과 조회. 접수번호/비밀번호 불일치 등은 BE가 404로 응답 → fetchApi 가 Error 를 throw.
export async function fetchContactUsDetail(
  payload: ContactUsDetailRequest,
): Promise<ContactUsDetailResponse> {
  return fetchApi<ContactUsDetailResponse>("/api/v1/public/contact-us/answer", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}
