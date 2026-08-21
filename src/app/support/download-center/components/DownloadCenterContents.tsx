"use client";

import { FormControl, MenuItem } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { GuideSelectIcon } from "@/components/form/GuideFieldIcons";
import GuideSelect from "@/components/form/GuideSelect";
import PageNumbering from "@/components/pagination/PageNumbering";
import DownloadCenterActiveFilters from "./DownloadCenterActiveFilters";
import DownloadCenterCard from "./DownloadCenterCard";
import DownloadCenterEmpty from "./DownloadCenterEmpty";
import {
  DownloadCenterFilterBoundary,
  useDownloadCenterFilter,
  useDownloadCenterQuery,
} from "./DownloadCenterFilterProvider";
import DownloadCenterFilterPanel from "./DownloadCenterFilterPanel";
import {
  fetchDownloadCenterContents,
  type DownloadCenterItem,
  type DownloadCenterSort,
} from "@/data/support/downloadCenterData";

const PAGE_SIZE = 12;

const SORT_LABELS: Record<DownloadCenterSort, string> = {
  "": "Sort by",
  doctype: "Document Type",
  newest: "Newest",
  oldest: "Oldest",
  title: "Title A-Z",
  title_desc: "Title Z-A",
};

type DownloadCenterContentsProps = {
  empty?: boolean;
};

export default function DownloadCenterContents({
  empty = false,
}: DownloadCenterContentsProps) {
  return (
    <DownloadCenterFilterBoundary>
      <DownloadCenterContentsBody empty={empty} />
    </DownloadCenterFilterBoundary>
  );
}

function DownloadCenterContentsBody({
  empty = false,
}: DownloadCenterContentsProps) {
  const { query, page, setPage, sort, setSort } = useDownloadCenterQuery();
  const { getSelectedCategoryValues, getSelectedCategoryParentValues } =
    useDownloadCenterFilter();

  const selectedCategoryCodes = getSelectedCategoryValues("category");
  const categoryKey = [...selectedCategoryCodes].sort().join(",");
  const selectedCategoryParentCodes = getSelectedCategoryParentValues("category");
  const parentCategoryKey = [...selectedCategoryParentCodes].sort().join(",");
  const selectedDocTypes = getSelectedCategoryValues("document");
  const docTypeKey = [...selectedDocTypes].sort().join(",");

  const [items, setItems] = useState<DownloadCenterItem[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const firstResetRef = useRef(true);
  useEffect(() => {
    if (firstResetRef.current) {
      firstResetRef.current = false;
      return;
    }
    setPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, categoryKey, parentCategoryKey, docTypeKey, sort]);

  useEffect(() => {
    if (empty) {
      setItems([]);
      setTotalElements(0);
      setTotalPages(1);
      setLoading(false);
      return;
    }
    let alive = true;
    setLoading(true);
    fetchDownloadCenterContents({
      q: query,
      categories: selectedCategoryCodes,
      parentCategories: selectedCategoryParentCodes,
      docTypes: selectedDocTypes,
      sort,
      page: page - 1,
      size: PAGE_SIZE,
    })
      .then((res) => {
        if (!alive) return;
        setItems(res.content);
        setTotalElements(res.totalElements);
        setTotalPages(Math.max(1, res.totalPages));
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, categoryKey, parentCategoryKey, docTypeKey, sort, page, empty]);

  const isEmptyResult = !loading && items.length === 0;
  const showEmpty = empty || isEmptyResult;
  const resultCount = empty ? 0 : totalElements;

  return (
    <section
      className={`support_download_contents devices_product_downloads devices_product_downloads--center${
        showEmpty
          ? " support_download_contents--no-data devices_product_downloads--no-data"
          : ""
      }`}
      id="support-download-contents"
    >
      <div className="inner">
        <div className="devices_product_downloads__body">
          <DownloadCenterFilterPanel variant="sidebar" />

          <div className="devices_product_downloads__main">
            <DownloadCenterActiveFilters />
            <div className="devices_product_downloads__toolbar">
              <p className="devices_product_downloads__count">
                Total <strong>{resultCount.toLocaleString()}</strong>
              </p>
              {!showEmpty ? (
              <div className="devices_product_downloads__search-row support_download_sort--pc">
                <FormControl className="guide_field guide_field--w200">
                  <GuideSelect
                    value={sort}
                    displayEmpty
                    onChange={(event) =>
                      setSort(event.target.value as DownloadCenterSort)
                    }
                    IconComponent={GuideSelectIcon}
                    inputProps={{ "aria-label": "Sort by" }}
                    renderValue={(value) => {
                      const label = SORT_LABELS[value as DownloadCenterSort] ?? "Sort by";
                      return (
                        <span className="guide_field__select-value" title={label}>
                          {label}
                        </span>
                      );
                    }}
                  >
                    <MenuItem value="newest">Newest</MenuItem>
                    <MenuItem value="oldest">Oldest</MenuItem>
                    <MenuItem value="title">Title A-Z</MenuItem>
                    <MenuItem value="title_desc">Title Z-A</MenuItem>
                  </GuideSelect>
                </FormControl>
              </div>
              ) : null}
            </div>

            {showEmpty ? (
              <DownloadCenterEmpty />
            ) : (
              <>
                <div className="devices_product_downloads__list">
                  {items.map((item) => (
                    <DownloadCenterCard key={item.id} item={item} />
                  ))}
                </div>

                <PageNumbering
                  className="devices_product_downloads__pagination"
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={setPage}
                  ariaLabel="Download Center pagination"
                />
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
