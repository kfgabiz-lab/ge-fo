// Training Request Step4 — VFD 제품 선택 시 노출되는 체크박스 3개 그룹의 옵션 공통코드 조회
// - 규칙 근거: docs/ge_guide/fo/fo-api연동가이드.md (컴포넌트 직접 fetch 금지, fetchApi 경유)
// - 참고 패턴: 같은 Step4의 RequestForTrainingProductSelector가 쓰는 fetchTrainingCategories
//   (동일한 GET /api/v1/fo/codes/{groupCode} · 동일한 CodeItem 타입 재사용)
import type { CodeItem } from "@/app/services/training/data/trainingData";
import { fetchApi } from "@/lib/api";

// 그룹코드 — BO 공통코드 관리에 등록된 group_code와 1:1
export const TRAINING_JOB_TITLE_GROUP = "TRAININGJOBTITLE"; // 교육생 직위
export const TRAINING_INVOLVEMENT_GROUP = "TRAININGJOIN"; // 교육생 관련 분야
export const TRAINING_VFD_TOPIC_GROUP = "TRAININGVFD"; // VFD 이해도 후속 주제

/** Step4 체크박스 3그룹 옵션 — 화면에 그대로 뿌리는 라벨(영문 원문) 배열 */
export interface RequestForTrainingStep4Options {
  jobTitles: string[];
  studentInvolvement: string[];
  vfdTopics: string[];
}

/** 로딩 전 초기값 — 옵션이 비면 체크박스가 렌더되지 않는다(별도 안내/폴백 UI 없음) */
export const emptyRequestForTrainingStep4Options: RequestForTrainingStep4Options = {
  jobTitles: [],
  studentInvolvement: [],
  vfdTopics: [],
};

// 코드그룹 → 라벨 배열.
// 그룹코드 누락/오타 시 API가 404가 아니라 200 + [] 로 조용히 응답하므로 빈 배열이 그대로 내려온다.
// 통신 자체가 실패한 경우도 동일하게 빈 배열로 흡수한다(ProductSelector의 .catch(() => {}) 와 동일 정책).
async function fetchCodeLabels(groupCode: string): Promise<string[]> {
  try {
    const codes = await fetchApi<CodeItem[]>(`/api/v1/fo/codes/${groupCode}`);
    return (codes ?? []).map((code) => code.name);
  } catch {
    return [];
  }
}

/** 3개 그룹 동시 조회 — sortOrder 오름차순은 BE(getFoCodes)가 보장하므로 응답 순서를 그대로 사용 */
export async function fetchRequestForTrainingStep4Options(): Promise<RequestForTrainingStep4Options> {
  const [jobTitles, studentInvolvement, vfdTopics] = await Promise.all([
    fetchCodeLabels(TRAINING_JOB_TITLE_GROUP),
    fetchCodeLabels(TRAINING_INVOLVEMENT_GROUP),
    fetchCodeLabels(TRAINING_VFD_TOPIC_GROUP),
  ]);
  return { jobTitles, studentInvolvement, vfdTopics };
}
