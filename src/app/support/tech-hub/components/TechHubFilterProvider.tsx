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
import {
  markReturnIntentOnLeavingToDetail,
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
    });
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
    }),
    [query, page, categories, categoriesLoaded, certifications, resetSignal],
  );

  return (
    <TechHubQueryContext.Provider value={queryValue}>
      <store.Provider categories={categories}>{children}</store.Provider>
    </TechHubQueryContext.Provider>
  );
}
