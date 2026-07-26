// 인기 검색어(Popular Keywords) 조회/로깅 헬퍼
// - 데이터 소스: 신규 BE 엔드포인트(/api/v1/fo/search-keywords/*). page_data slug 아님.
// - 랭킹은 검색 출처(source) 단위로 분리 집계된다.
//   · DOWNLOAD_CENTER : Support > Download Center 자체 검색
//   · UNIFIED_SEARCH  : GNB 헤더 검색 + 404 페이지 검색(둘 다 "통합검색" 개념으로 묶임)
// - 규칙 근거: docs/ge_guide/fo/fo-api연동가이드.md (컴포넌트 직접 fetch 금지, fetchApi 경유)
import { fetchApi } from "@/lib/api";

// 검색 출처 — BE SearchKeywordSource enum 과 1:1(문자열 그대로 전송).
export type SearchKeywordSource = "DOWNLOAD_CENTER" | "UNIFIED_SEARCH";

// ---------------- 검색어 로깅(write) ----------------

// 사용자가 직접 입력해서 실행한 검색어 1건을 집계 테이블에 적재하는 write 전용 호출(fire-and-forget).
// - 스펙: POST /api/v1/fo/search-keywords, body {source, keyword} → 204 No Content(응답 본문 없음)
// - fire-and-forget: 결과를 화면에 쓰지 않으며, 실패해도 검색 동작 자체에 영향이 없어야 한다.
//   · 204는 바디가 없어 fetchApi 내부 res.json() 에서 파싱 예외가 나지만, 서버측 적재는
//     응답 전에 이미 커밋되므로 파싱 예외는 무해 → 아래 catch 로 조용히 삼킨다.
//     (pageDataApi.ts 의 incrementViewCount 와 동일한 처리)
//   · 네트워크/4xx/5xx 실패도 동일하게 catch 로 무시(에러 UI/토스트 없음).
// - 인기검색어 태그 클릭은 "사용자의 직접 입력"이 아니므로 호출부에서 로깅하지 않는다(기획 결정).
export async function logSearchKeyword(
  source: SearchKeywordSource,
  keyword: string,
): Promise<void> {
  const trimmed = keyword?.trim();
  if (!trimmed) return;
  try {
    await fetchApi<void>(`/api/v1/fo/search-keywords`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ source, keyword: trimmed }),
    });
  } catch {
    // fire-and-forget: 검색어 로깅 실패는 무시
  }
}

// ---------------- 인기 검색어(read) ----------------

// 출처별 인기 검색어 목록(최대 5건, 상위 순).
// - 스펙: GET /api/v1/fo/search-keywords/popular?source=... → 200, List<String>
// - 실패/미집계 시 빈 배열을 반환한다. 정적 폴백(퍼블리싱 기본 태그) 적용은 호출부 책임.
//   (downloadCenterData.ts 의 catch { return [] } 패턴과 동일)
export async function fetchPopularKeywords(
  source: SearchKeywordSource,
): Promise<string[]> {
  try {
    const list = await fetchApi<string[]>(
      `/api/v1/fo/search-keywords/popular?source=${encodeURIComponent(source)}`,
    );
    return Array.isArray(list) ? list.filter((k) => !!k && !!k.trim()) : [];
  } catch {
    return [];
  }
}
