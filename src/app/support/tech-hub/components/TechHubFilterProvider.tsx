"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
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

// 실카운트 도착 전 초기 상태 — 배지 미표시(count undefined). 정적 목업 건수(100)가 잠깐 노출되는 것을 막는다.
// (Download Center 의 DOC_TYPES_PENDING 과 동일 패턴.)
const CERTS_PENDING: DownloadFilterOption[] = techHubCertifications.map(
  (opt) => ({ ...opt, count: undefined }),
);

// Tech Hub 필터 스토어 — 카테고리는 정적이 아니라 category-data fetch 결과를 Provider 에 동적 주입한다.
// Certification(secondary) 은 정적 옵션 유지(option.id = BE certs 토큰 "ul"/"iec").
// ⚠️ 스토어 레지스트리(활성 칩/선택값 추출)는 이 config 로 구성되므로 옵션 목록 자체는 반드시 여기에 있어야 한다.
//    count 만 cert-counts 실카운트로 병합해 패널 표시용으로 따로 내려준다(Download Center 와 동일).
const store = createSupportFilterStore({
  displayName: "TechHub",
  categoryIdPrefix: "th-category",
  categoryGroup: "Category",
  categorySection: "category",
  categories: [], // 동적 주입(fetch), 정적 기본 없음
  secondaryIdPrefix: "th-cert",
  secondaryGroup: "Certification",
  secondarySection: "certification",
  secondaryOptions: techHubCertifications,
});

export const TechHubFilterBoundary = store.Boundary;
export const useTechHubFilter = store.useFilter;

// 검색어/페이지/동적 카테고리를 형제 컴포넌트(Search ↔ Contents ↔ FilterPanel)가 공유하기 위한 컨텍스트.
type TechHubQueryContextValue = {
  query: string;
  setQuery: (q: string) => void;
  page: number; // 1-based(UI PageNumbering 기준)
  setPage: (p: number) => void;
  categories: DownloadCategoryOption[]; // 아코디언 표시용(코드 + LV2별 count)
  categoriesLoaded: boolean;
  certifications: DownloadFilterOption[]; // 인증 옵션(옆 건수 배지 = cert-counts 실카운트)
  /**
   * 검색 입력 초기화 신호. View All(전체 초기화)처럼 "검색어가 원래 비어 있어도"
   * 검색창 로컬 입력값을 반드시 비워야 하는 경우를 위해 매번 증가하는 카운터.
   * (query 값 비교만으로는 검색어가 이미 "" 인 케이스에서 변화가 없어 입력값이 남는다.)
   */
  resetSignal: number;
  notifyReset: () => void;
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

// initialCategories: 진입 시 미리 체크해 둘 LV2 카테고리 코드 목록(제품상세 Tech Hub 배너의 프리필터).
// 비어 있으면 기존과 완전히 동일하게 동작한다.
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
  const [page, setPage] = useState(1);
  const [resetSignal, setResetSignal] = useState(0);

  // 배열 prop 은 렌더마다 참조가 바뀔 수 있어, effect 의존성은 CSV 문자열 키로 고정한다.
  const initialCategoryKey = initialCategories.join(",");

  useEffect(() => {
    let alive = true;
    const preselected = new Set(
      initialCategoryKey.split(",").filter((code) => code !== ""),
    );
    fetchTechHubCategoryTree()
      .then((tree) => {
        if (!alive) return;
        // 프리필터가 있으면 해당 LV2(nested.id === 코드)에 defaultChecked 를 세팅한 "새" 트리로 교체한다(원본 mutate 금지).
        // createSupportFilterStore 의 buildInitialChecked 가 nested.defaultChecked 를 읽어 초기 체크로 반영하고,
        // 부모(LV1) 체크 상태는 syncCategoryParentState 가 자동 동기화한다.
        // (초기 categories=[] → 트리 도착 시 registry signature 가 바뀌며 buildInitialChecked 가 재실행되는 경로를 탄다.)
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
  }, [initialCategoryKey]);

  // 인증 옆 건수 배지 = cert-counts 실카운트 병합(코드 기준). 실패 시 CERTS_PENDING 유지(배지 미표시).
  useEffect(() => {
    let alive = true;
    fetchTechHubCertCounts().then((counts) => {
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
  }, []);

  // 검색어 변경 시 항상 1페이지로.
  const setQuery = (q: string) => {
    setQueryState(q);
    setPage(1);
  };

  // 검색창 입력값 초기화 요청(TechHubEmpty 의 View All). 값 비교가 아닌 신호 증가라 항상 반영된다.
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
    }),
    [query, page, categories, categoriesLoaded, certifications, resetSignal],
  );

  return (
    <TechHubQueryContext.Provider value={queryValue}>
      <store.Provider categories={categories}>{children}</store.Provider>
    </TechHubQueryContext.Provider>
  );
}
