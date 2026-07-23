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
  // devices-tree(category-data) 행의 rowId(page_data PK) — Lv1/Lv2/Lv3(제품) 공통
  productCategoryLv1Id?: number;
  productCategoryLv2Id?: number;
  productCategoryLv3Id?: number;
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

// 국가 옵션(셀렉트) — groupCode COUNTRY
export async function fetchCountries(): Promise<CodeItem[]> {
  return fetchApi<CodeItem[]>("/api/v1/fo/codes/COUNTRY");
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
