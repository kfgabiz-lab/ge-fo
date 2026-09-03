"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createSupportFilterStore } from "@/app/support/components/createSupportFilterStore";
import type {
  DownloadCategoryOption,
  DownloadFilterOption,
} from "@/data/support/downloadCenterContent";
import { techHubCertifications } from "@/data/support/techHubContent";
import {
  fetchTechHubCategoryTree,
  fetchTechHubCertCounts,
} from "@/data/support/techHubData";
import {
  markReturnIntentOnLeavingToDetail,
  rememberListFilterIds,
  rememberListPage,
  rememberListQuery,
  restoreListStateIfReturning,
  watchForFreshListEntryClicks,
} from "@/lib/navigation/listPageMemory";

const TECH_HUB_PATHNAME = "/support/tech-hub";

const CERTS_PENDING: DownloadFilterOption[] = techHubCertifications.map(
  (opt) => ({ ...opt, count: undefined }),
);

const store = createSupportFilterStore({
  displayName: "TechHub",
  categoryIdPrefix: "th-category",
  categoryGroup: "Category",
  categorySection: "category",
  categories: [],
  secondaryIdPrefix: "th-cert",
  secondaryGroup: "Certification",
  secondarySection: "certification",
  secondaryOptions: techHubCertifications,
});

export const TechHubFilterBoundary = store.Boundary;
export const useTechHubFilter = store.useFilter;

type TechHubQueryContextValue = {
  query: string;
  setQuery: (q: string) => void;
  page: number;
  setPage: (p: number) => void;
  categories: DownloadCategoryOption[];
  categoriesLoaded: boolean;
  certifications: DownloadFilterOption[];
  resetSignal: number;
  notifyReset: () => void;
  /** LIST 버튼 복귀·뒤로가기로 돌아온 경우에만 채워지는, 복원해야 할 필터 id 목록(1회성). */
  restoredFilterIds: string[];
  /**
   * restoreListStateIfReturning이 한 번이라도 실행돼 복귀 여부 판정이 끝났는지. 자식(Bridge)의
   * effect가 부모(이 컴포넌트)보다 먼저 도는 React 실행 순서 때문에, 판정이 나기 전엔
   * restoredFilterIds가 항상 빈 배열로 보인다 — "복원할 게 없음"과 "아직 판정 전"을
   * 구분하지 못하면 판정 전에 찍힌 빈 활성 필터를 그대로 저장해 복원 값을 지워버린다.
   */
  filterRestoreReady: boolean;
  /**
   * 필터 복원(Bridge가 toggleFilter를 호출하는 것)이 완전히 끝났는지. 복원 중인
   * toggleFilter 호출은 "사용자가 방금 필터를 바꿨다"와 겉보기에 똑같아서, 이 값을
   * false인 동안엔 필터 변경 시 페이지를 1로 되돌리는 로직(TechHubContentsBody)이
   * 복원 중인 페이지 번호를 덮어쓰지 않도록 잠시 건너뛰어야 한다.
   */
  filtersSettled: boolean;
  /** Bridge가 복원 적용(또는 "복원할 것 없음" 판정)을 마쳤을 때 호출한다. */
  markFiltersSettled: () => void;
};

const TechHubQueryContext = createContext<TechHubQueryContextValue | null>(null);

export function useTechHubQuery(): TechHubQueryContextValue {
  const ctx = useContext(TechHubQueryContext);
  if (!ctx) {
    throw new Error(
      "useTechHubQuery must be used within TechHubFilterProvider",
    );
  }
  return ctx;
}

/**
 * store.Provider 안쪽(useTechHubFilter를 쓸 수 있는 위치)에서 카테고리/인증서 체크박스
 * 필터를 sessionStorage와 동기화한다 — 복귀 시 한 번 복원하고, 이후 변경될 때마다 기억해 둔다.
 * TechHubFilterProvider 컴포넌트 자신은 store.Provider보다 바깥이라 useTechHubFilter를
 * 직접 쓸 수 없어 별도 컴포넌트로 뺐다.
 */
function TechHubFilterMemoryBridge() {
  const filter = useTechHubFilter();
  const { restoredFilterIds, filterRestoreReady, markFiltersSettled } = useTechHubQuery();
  const hasAppliedRestore = useRef(false);

  useEffect(() => {
    if (hasAppliedRestore.current) return;
    if (!filterRestoreReady) return;
    hasAppliedRestore.current = true;
    if (restoredFilterIds.length === 0) {
      // 복원할 필터가 없는 경우엔 toggleFilter로 인한 지연 반영을 기다릴 필요가 없어
      // 바로 "복원 시도는 끝났다"고 알린다 — 필터 변경 시 페이지를 1로 되돌리는 로직이
      // 계속 멈춰 있지 않도록.
      markFiltersSettled();
      return;
    }
    for (const id of restoredFilterIds) {
      filter.toggleFilter(id, true);
    }
    // 여기서 바로 markFiltersSettled()를 부르지 않는다 — 방금 부른 toggleFilter는 다른
    // 컴포넌트(store.Provider)의 state 갱신이라 이 렌더에는 아직 반영 안 됐다. activeIdsKey가
    // 실제로 바뀌는 걸 기다리는 아래 effect에서 대신 알린다(안 그러면 필터가 실제로 적용되기
    // 전에 "끝났다"고 알려서, 진짜 반영되는 순간 페이지 리셋 로직이 또 끼어든다).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [restoredFilterIds, filterRestoreReady]);

  const activeIdsKey = filter.activeChips.map((chip) => chip.id).join(",");
  useEffect(() => {
    if (hasAppliedRestore.current && restoredFilterIds.length > 0) {
      markFiltersSettled();
    }
    // 복귀 여부 판정이 아직 안 끝났으면(부모 effect가 이 컴포넌트보다 늦게 도는 최초 렌더 등)
    // 지금 빈 상태를 "선택 없음"으로 잘못 기억해 복원 값을 지워버리지 않도록 건너뛴다.
    // 판정이 끝났어도 복원 적용이 아직이면(비동기로 카테고리 트리가 로드되기 전 등) 마찬가지.
    // filterRestoreReady는 굳이 deps에 넣지 않는다 — 그것만 바뀌어서 이 effect가 다시
    // 도는 순간엔 방금 적용한 toggleFilter가 아직 activeChips에 반영되기 전이라(다른
    // 컴포넌트의 state 갱신은 다음 렌더에야 보임) activeIdsKey가 여전히 예전 값이다.
    // activeIdsKey가 실제로 바뀔 때만(=toggleFilter 반영이 끝난 뒤) 다시 돌아야 안전하다.
    if (!filterRestoreReady) return;
    if (restoredFilterIds.length > 0 && !hasAppliedRestore.current) return;
    const ids = activeIdsKey ? activeIdsKey.split(",") : [];
    rememberListFilterIds(TECH_HUB_PATHNAME, ids);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIdsKey]);

  return null;
}

export function TechHubFilterProvider({
  children,
  initialCategories = [],
}: {
  children: ReactNode;
  initialCategories?: string[];
}) {
  const [categories, setCategories] = useState<DownloadCategoryOption[]>([]);
  const [categoriesLoaded, setCategoriesLoaded] = useState(false);
  const [certifications, setCertifications] =
    useState<DownloadFilterOption[]>(CERTS_PENDING);
  const [query, setQueryState] = useState("");
  const [page, setPageState] = useState(1);
  const [resetSignal, setResetSignal] = useState(0);
  const [restoredFilterIds, setRestoredFilterIds] = useState<string[]>([]);
  const [filterRestoreReady, setFilterRestoreReady] = useState(false);
  const [filtersSettled, setFiltersSettled] = useState(false);
  const markFiltersSettled = () => setFiltersSettled(true);

  const setPage = (p: number) => {
    setPageState(p);
    rememberListPage(TECH_HUB_PATHNAME, p);
  };

  // 초기 state는 항상 서버와 동일하게 1페이지·빈 검색어로 시작하고, LIST 버튼 복귀·브라우저
  // 뒤로가기로 돌아온 경우에만 마운트 직후 patch한다 — 렌더 중 sessionStorage 값으로 초기
  // state를 계산하면 SSR과 달라져 하이드레이션 불일치가 난다(자세한 이유는
  // listPageMemory.ts의 restoreListStateIfReturning 참고). 모든 관련 네비게이션이 하드
  // 리로드(완전한 새 마운트)라 effect 기반 복원이 안전하다.
  useEffect(() => {
    restoreListStateIfReturning(TECH_HUB_PATHNAME, {
      page: setPageState,
      query: setQueryState,
      filterIds: setRestoredFilterIds,
    });
    setFilterRestoreReady(true);
  }, []);

  // 이미 이 목록 페이지에 있는 채로 GNB 등에서 같은 URL을 다시 클릭하면
  // 하드 리로드도 리마운트도 안 일어나 페이지 번호가 그대로 남는다 — 그 클릭을
  // 감지해 1페이지·빈 검색어로 되돌린다.
  useEffect(
    () =>
      watchForFreshListEntryClicks(TECH_HUB_PATHNAME, () => {
        setPageState(1);
        setQueryState("");
      }),
    [],
  );

  // 목록에 머무는 동안 자기 상세 페이지로 향하는 링크를 클릭하면 "복귀 의도"를 남긴다 —
  // LIST 버튼뿐 아니라 카드를 직접 클릭해 상세로 들어간 뒤 브라우저 뒤로가기로 돌아오는
  // 경우도 페이지/검색어를 복원하기 위함.
  useEffect(() => markReturnIntentOnLeavingToDetail(TECH_HUB_PATHNAME), []);

  const initialCategoryKey = initialCategories.join(",");
  const q = query.trim();

  useEffect(() => {
    let alive = true;
    const preselected = new Set(
      initialCategoryKey.split(",").filter((code) => code !== ""),
    );
    fetchTechHubCategoryTree({ q })
      .then((tree) => {
        if (!alive) return;
        if (preselected.size === 0) {
          setCategories(tree);
          return;
        }
        setCategories(
          tree.map((option) => ({
            ...option,
            nested: (option.nested ?? []).map((nested) =>
              preselected.has(nested.id)
                ? { ...nested, defaultChecked: true }
                : nested,
            ),
          })),
        );
      })
      .finally(() => {
        if (alive) setCategoriesLoaded(true);
      });
    return () => {
      alive = false;
    };
  }, [initialCategoryKey, q]);

  useEffect(() => {
    let alive = true;
    fetchTechHubCertCounts({ q }).then((counts) => {
      if (!alive) return;
      if (counts.length === 0) return;
      const countMap = new Map(
        counts.map((c) => [c.certCode.toLowerCase(), c.count]),
      );
      setCertifications(
        techHubCertifications.map((opt) =>
          countMap.has(opt.id)
            ? { ...opt, count: countMap.get(opt.id) }
            : { ...opt, count: undefined },
        ),
      );
    });
    return () => {
      alive = false;
    };
  }, [q]);

  const setQuery = (next: string) => {
    setQueryState(next);
    rememberListQuery(TECH_HUB_PATHNAME, next);
    setPage(1);
  };

  const notifyReset = () => setResetSignal((prev) => prev + 1);

  const queryValue = useMemo(
    () => ({
      query,
      setQuery,
      page,
      setPage,
      categories,
      categoriesLoaded,
      certifications,
      resetSignal,
      notifyReset,
      restoredFilterIds,
      filterRestoreReady,
      filtersSettled,
      markFiltersSettled,
    }),
    [
      query,
      page,
      categories,
      categoriesLoaded,
      certifications,
      resetSignal,
      restoredFilterIds,
      filterRestoreReady,
      filtersSettled,
    ],
  );

  return (
    <TechHubQueryContext.Provider value={queryValue}>
      <store.Provider categories={categories}>
        <TechHubFilterMemoryBridge />
        {children}
      </store.Provider>
    </TechHubQueryContext.Provider>
  );
}
