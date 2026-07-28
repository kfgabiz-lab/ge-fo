"use client";

import { FormControl, InputAdornment, MenuItem, TextField } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { GuideSelectIcon } from "@/components/form/GuideFieldIcons";
import GuideSelect from "@/components/form/GuideSelect";
import PageNumbering from "@/components/pagination/PageNumbering";
import DevicesProductDownloadsCopyLink from "./DevicesProductDownloadsCopyLink";
import DevicesProductDownloadsDocumentFilter from "./DevicesProductDownloadsDocumentFilter";
import DevicesProductDownloadsFilter from "./DevicesProductDownloadsFilter";
import {
  DevicesProductDownloadsFilterBoundary,
  useDevicesProductDownloadsFilter,
} from "./DevicesProductDownloadsFilterProvider";
import DevicesProductDownloadsMobileControls from "./DevicesProductDownloadsMobileControls";
import {
  fetchProductDownloadsPage,
  PRODUCT_DOWNLOADS_DEFAULT_SORT,
  PRODUCT_DOWNLOADS_PAGE_SIZE,
  productDownloadsSortLabel,
  productDownloadsSortOptions,
  type ProductDownloadsPage,
} from "../../data/productDetailContent";
import type { DownloadCenterSort } from "@/data/support/downloadCenterData";

type DevicesProductDownloadsProps = {
  /** SSR 에서 기본 문서유형 + 제품코드 조건으로 조회해 둔 1페이지 결과(목록 + 전체 건수) */
  initial: ProductDownloadsPage;
  /**
   * 현재 제품의 연계 제품코드(product.product_code) — 기획서 18번 "현재 제품과 연계된 파일만 출력".
   * ⚠️ 클라이언트 재조회(필터/정렬/페이지 변경) 때도 SSR 과 같은 조건이어야 하므로 반드시 함께 넘긴다.
   *    빠지면 필터를 바꾸는 순간 제품 무관 전체 목록으로 바뀐다.
   */
  productCodes: string[];
};

// 필터 컨텍스트는 이 컴포넌트가 직접 만들기 때문에(Boundary) 같은 컴포넌트 안에서는 소비할 수 없다.
// Download Center(DownloadCenterContents)와 동일하게 Boundary 래퍼 / 본문을 분리해 본문에서 훅을 쓴다.
export default function DevicesProductDownloads({
  initial,
  productCodes,
}: DevicesProductDownloadsProps) {
  return (
    <DevicesProductDownloadsFilterBoundary>
      <DevicesProductDownloadsBody
        initial={initial}
        productCodes={productCodes}
      />
    </DevicesProductDownloadsFilterBoundary>
  );
}

function DevicesProductDownloadsBody({
  initial,
  productCodes,
}: DevicesProductDownloadsProps) {
  const { selectedDocTypes } = useDevicesProductDownloadsFilter();
  // 선택 코드 집합을 정렬해 안정적인 의존성 키로 사용(체크 순서가 달라도 같은 조건이면 재조회하지 않음).
  const docTypeKey = [...selectedDocTypes].sort().join(",");
  // 제품코드도 동일하게 문자열 키로 의존(매 렌더 새 배열이라 배열 자체를 의존성에 넣으면 무한 재조회).
  const productCodeKey = [...productCodes].sort().join(",");

  // initial = 서버(SSR)에서 기본 체크 문서유형 + 1페이지 조건으로 이미 조회해 넘겨준 결과.
  // 마운트 시점에는 조건이 동일하므로 재조회하지 않고, 이후 필터/페이지 변경분만 클라이언트에서 다시 조회한다.
  const [items, setItems] = useState(initial.items);
  const [totalElements, setTotalElements] = useState(initial.totalElements);
  const [totalPages, setTotalPages] = useState(initial.totalPages);
  const [currentPage, setCurrentPage] = useState(1);
  // 정렬 기본값은 기획서상 Document Type. SSR(fetchProductDownloadsPage 기본 인자)과 같은 값이어야
  // 마운트 직후 재조회 없이 초기 목록을 그대로 쓸 수 있다.
  const [sort, setSort] = useState<DownloadCenterSort>(
    PRODUCT_DOWNLOADS_DEFAULT_SORT,
  );

  // 필터/정렬 변경 시 1페이지로 리셋(최초 실행 제외).
  // Download Center(DownloadCenterContents)의 검색/필터/정렬 리셋과 동일한 패턴을 그대로 따른다.
  const firstResetRef = useRef(true);
  useEffect(() => {
    if (firstResetRef.current) {
      firstResetRef.current = false;
      return;
    }
    setCurrentPage(1);
  }, [docTypeKey, sort]);

  // 실목록 조회(문서유형 필터 / 정렬 / 페이지 변경 시).
  // 페이징·정렬 모두 BE 에 위임한다. 클라이언트에서 잘라내거나 재정렬하지 않는다
  // (현재 페이지 5건만 재정렬하면 전체 목록 순서가 아니라 페이지 내 순서만 바뀌기 때문).
  const skipFirstFetchRef = useRef(true);
  useEffect(() => {
    if (skipFirstFetchRef.current) {
      skipFirstFetchRef.current = false;
      return;
    }

    let alive = true;
    fetchProductDownloadsPage({
      docTypes: selectedDocTypes,
      productCodes,
      page: currentPage,
      sort,
    }).then((page) => {
      if (!alive) return;
      setItems(page.items);
      setTotalElements(page.totalElements);
      setTotalPages(page.totalPages);
    });

    return () => {
      alive = false;
    };
    // selectedDocTypes / productCodes 는 매 렌더 새 배열일 수 있어 문자열 키로만 의존한다.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [docTypeKey, productCodeKey, sort, currentPage]);

  // 0건이면 "0-0", 아니면 현재 페이지의 실제 표시 범위. total 은 서버가 준 전체 건수 기준.
  const showingStart =
    items.length === 0 ? 0 : (currentPage - 1) * PRODUCT_DOWNLOADS_PAGE_SIZE + 1;
  const showingEnd = items.length === 0 ? 0 : showingStart + items.length - 1;

  return (
    <section className="devices_product_downloads" id="product-downloads">
        <div className="inner">
          <div className="devices_product_downloads__head">
            <h2 className="section_tit">Downloads</h2>
          </div>
          <DevicesProductDownloadsMobileControls
            sort={sort}
            onSortChange={setSort}
          />
          <div className="devices_product_downloads__body">
            <DevicesProductDownloadsFilter className="devices_product_downloads__filter-stack--pc">
              <DevicesProductDownloadsDocumentFilter />
            </DevicesProductDownloadsFilter>
          <div className="devices_product_downloads__main">
            <div className="devices_product_downloads__toolbar">
              <p className="devices_product_downloads__count">
                Showing {showingStart}-{showingEnd} of{" "}
                <strong>{totalElements.toLocaleString()}</strong> results
              </p>
              <div className="devices_product_downloads__search-row devices_product_downloads__search-row--pc">
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
                      const text = productDownloadsSortLabel(
                        value as DownloadCenterSort,
                      );
                      return (
                        <span className="guide_field__select-value" title={text}>
                          {text}
                        </span>
                      );
                    }}
                  >
                    {productDownloadsSortOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </GuideSelect>
                </FormControl>
                <TextField
                  className="guide_field guide_field--search"
                  placeholder=""
                  aria-label="key word downloads"
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment
                          position="end"
                          className="guide_field__search-adorn"
                        >
                          <button
                            type="button"
                            className="guide_field__search-icon-button"
                            aria-label="Search"
                          >
                            <img
                              loading="lazy"
                              decoding="async"
                              src="/ico/ico_search_24.svg"
                              alt=""
                              width={18}
                              height={18}
                            />
                          </button>
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              </div>
            </div>
            <div className="devices_product_downloads__list">
              {items.map((item, index) => (
                <article
                  key={`${item.id}-${currentPage}-${index}`}
                  className="devices_product_downloads__item"
                >
                  <header className="devices_product_downloads__item-head devices_product_downloads__item-head--center">
                    <div className="devices_product_downloads__item-head-main">
                      <div className="devices_product_downloads__item-head-meta">
                        <span className="devices_product_downloads__type">
                          {item.type}
                        </span>
                        {item.date ? (
                          <time
                            className="devices_product_downloads__date"
                            dateTime={item.date}
                          >
                            {item.date}
                          </time>
                        ) : null}
                      </div>
                      <div className="devices_product_downloads__item-head-title-row">
                        <h3 className="devices_product_downloads__item-tit">
                          {item.title}
                        </h3>
                        {item.version ? (
                          <div className="devices_product_downloads__item-version">
                            <FormControl className="guide_field guide_field--h38 guide_field--w120 devices_product_downloads__version-select">
                              <GuideSelect
                                defaultValue={item.version}
                                displayEmpty
                                IconComponent={GuideSelectIcon}
                                inputProps={{
                                  "aria-label": `Version for ${item.title}`,
                                }}
                                renderValue={(value) => {
                                  const text = value ? String(value) : item.version;
                                  return (
                                    <span
                                      className="guide_field__select-value"
                                      title={text}
                                    >
                                      {text}
                                    </span>
                                  );
                                }}
                              >
                                {(item.versions ?? [item.version]).map((version) => (
                                  <MenuItem key={version} value={version}>
                                    {version}
                                  </MenuItem>
                                ))}
                              </GuideSelect>
                            </FormControl>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </header>
                  <div className="devices_product_downloads__item-body">
                    <div className="devices_product_downloads__files-panel">
                      <ul className="devices_product_downloads__files">
                        {item.files.map((file) => (
                          <li key={file.name} className="devices_product_downloads__file">
                            <div className="devices_product_downloads__file-main">
                              <span
                                className="devices_product_downloads__pdf"
                                aria-hidden="true"
                              >
                                <img loading="lazy" decoding="async"
                                  src="/ico/ico_pdf_18.svg"
                                  alt=""
                                  width={18}
                                  height={18}
                                />
                              </span>
                              <span className="devices_product_downloads__file-name">
                                {file.name}
                                {file.size ? ` (${file.size})` : ""}
                              </span>
                            </div>
                            <div className="devices_product_downloads__file-actions">
                              <DevicesProductDownloadsCopyLink url={file.url} />
                              <button
                                type="button"
                                className="devices_product_downloads__file-btn devices_product_downloads__file-btn--download"
                                onClick={() => {
                                  // 기획서 26번 — 해당 파일 다운로드(PDF 는 새 탭에서 열림).
                                  // url 은 SSR(mapDownloadCenterItemsToProductDownloads)에서 미리 발급해 둔 값이므로
                                  // 클릭 시점에 추가 조회하지 않는다. 발급 실패(빈 문자열)면 조용히 무시.
                                  if (file.url) {
                                    window.open(file.url, "_blank", "noopener,noreferrer");
                                  }
                                }}
                              >
                                Download
                                <span
                                  className="devices_product_downloads__file-btn-icon"
                                  aria-hidden="true"
                                />
                              </button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </article>
              ))}
            </div>
            <PageNumbering
              className="devices_product_downloads__pagination"
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              ariaLabel="Downloads pagination"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
