// pathname 을 키로 하는 "브레드크럼 제목" 클라이언트 오버라이드 외부 스토어.
//
// 배경: 헤더 브레드크럼은 services 레이아웃(서버 컴포넌트) 안에 있고, 소프트 내비게이션
//   (목록 카드 클릭 등)으로 같은 레이아웃 하위 경로로 이동할 때 Next App Router 는 공유 레이아웃을
//   재실행하지 않는다. 즉 레이아웃이 SSR 시점에 산출한 serverOverride 는 최초 값으로 고정되어,
//   소프트 이동한 코스상세의 current 가 정적 폴백("Curriculum Detail")으로 남는다.
// 해결: 이미 실 제목을 손에 쥔 지점(목록 카드/세션상세)에서 seedBreadcrumbTitle 로 미리 심어두면
//   HeaderBreadcrumb 가 useSyncExternalStore 로 구독해 소프트 이동 직후에도 실 라벨을 즉시 렌더한다.
//
// 하이드레이션 안전:
//   - getServerSnapshot 은 항상 동일한 EMPTY_MAP 상수 참조를 반환(SSR/CSR 최초 스냅샷 일치 → mismatch 없음).
//   - getSnapshot 은 실제 변경이 있을 때만 새 Map 으로 교체(불변 갱신). 변경 없으면 동일 참조 유지 →
//     useSyncExternalStore 의 스냅샷 캐싱 계약(같은 상태면 같은 참조)을 만족해 불필요한 리렌더가 없다.

type TitleMap = ReadonlyMap<string, string>;

// 서버 스냅샷 + 초기 스냅샷 고정 참조(항상 이 상수를 반환해야 hydration mismatch 방지).
const EMPTY_MAP: TitleMap = new Map();

let snapshot: TitleMap = EMPTY_MAP;
const listeners = new Set<() => void>();

function emit(): void {
  for (const listener of listeners) listener();
}

// 특정 경로의 브레드크럼 제목을 심는다(불변 갱신).
// - pathname/title 이 비면 무시. 기존 값과 동일하면 no-op(참조 유지 → 리렌더/통지 없음).
export function seedBreadcrumbTitle(
  pathname: string,
  title: string | undefined | null,
): void {
  if (!pathname || !title) return;
  if (snapshot.get(pathname) === title) return;
  const next = new Map(snapshot);
  next.set(pathname, title);
  snapshot = next;
  emit();
}

export function subscribeBreadcrumbTitles(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getBreadcrumbTitlesSnapshot(): TitleMap {
  return snapshot;
}

export function getBreadcrumbTitlesServerSnapshot(): TitleMap {
  return EMPTY_MAP;
}
