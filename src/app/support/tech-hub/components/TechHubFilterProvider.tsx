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
  computeInitialListState,
  markReturnIntentOnLeavingToDetail,
  rememberListPage,
  rememberListQuery,
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
  // LIST 버튼 복귀·브라우저 뒤로가기 여부는 렌더 중(lazy initializer)에 동기적으로 확정한다 —
  // useEffect에서 복원하면 라우터 캐시 재사용 등으로 effect가 안 붙는 경우 복원이 누락될 수 있다.
  const [initial] = useState(() => computeInitialListState(TECH_HUB_PATHNAME));
  const [query, setQueryState] = useState(initial.query);
  const [page, setPageState] = useState(initial.page);
  const [resetSignal, setResetSignal] = useState(0);

  const setPage = (p: number) => {
    setPageState(p);
    rememberListPage(TECH_HUB_PATHNAME, p);
  };

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
