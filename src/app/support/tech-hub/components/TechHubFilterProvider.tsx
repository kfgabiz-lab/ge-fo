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
  rememberListPage,
  restoreListPageIfReturning,
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

  // LIST 버튼으로 돌아왔거나(markListReturnIntent) 브라우저 뒤로가기일 때만
  // 기억된 페이지로 복원한다 — GNB 등으로 새로 진입한 경우는 항상 1페이지.
  useEffect(() => {
    restoreListPageIfReturning(TECH_HUB_PATHNAME, setPageState);
  }, []);

  // 이미 이 목록 페이지에 있는 채로 GNB 등에서 같은 URL을 다시 클릭하면
  // 하드 리로드도 리마운트도 안 일어나 페이지 번호가 그대로 남는다 — 그 클릭을
  // 감지해 1페이지로 되돌린다.
  useEffect(
    () => watchForFreshListEntryClicks(TECH_HUB_PATHNAME, () => setPageState(1)),
    [],
  );

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
