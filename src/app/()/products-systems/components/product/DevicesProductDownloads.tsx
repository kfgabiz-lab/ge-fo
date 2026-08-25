"use client";

import { FormControl, InputAdornment, MenuItem, TextField } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { GuideSelectIcon } from "@/components/form/GuideFieldIcons";
import GuideSelect from "@/components/form/GuideSelect";
import PageNumbering from "@/components/pagination/PageNumbering";
import { formatDisplayDate } from "@/lib/formatDate";
import { pushDataLayerEvent } from "@/lib/gtm";
import DevicesProductDownloadsCopyLink from "./DevicesProductDownloadsCopyLink";
import DevicesProductDownloadsDownloadBtn from "./DevicesProductDownloadsDownloadBtn";
import DevicesProductDownloadsDocumentFilter from "./DevicesProductDownloadsDocumentFilter";
import DevicesProductDownloadsEmpty from "./DevicesProductDownloadsEmpty";
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
  type ProductDownloadFile,
  type ProductDownloadItem,
  type ProductDownloadsPage,
} from "../../data/productDetailContent";
import {
  fetchDownloadCenterFileUrl,
  type DownloadCenterSort,
} from "@/data/support/downloadCenterData";
import type { DownloadFilterOption } from "@/data/support/downloadCenterContent";

function fileExtensionOf(fileName: string): string {
  const dotIndex = fileName.lastIndexOf(".");
  return dotIndex === -1 ? "" : fileName.slice(dotIndex + 1).toLowerCase();
}

function DevicesProductDownloadsItem({
  item,
  productName,
}: {
  item: ProductDownloadItem;
  productName?: string;
}) {
  const [selectedVersion, setSelectedVersion] = useState(item.version);
  const [otherVersionFiles, setOtherVersionFiles] = useState<
    ProductDownloadFile[] | null
  >(null);

  useEffect(() => {
    if (selectedVersion === item.version) {
      setOtherVersionFiles(null);
      return;
    }

    const target = item.downloadVersions?.find(
      (v) => v.versionName === selectedVersion,
    );
    if (!target) {
      setOtherVersionFiles([]);
      return;
    }

    let alive = true;
    Promise.all(
      target.files.map(async (file) => {
        let url = "";
        try {
          url = await fetchDownloadCenterFileUrl(file.filePath);
        } catch {
          url = "";
        }
        return {
          name: file.fileName ?? "",
          size: file.fileSizeText ?? "",
          url,
        };
      }),
    ).then((resolved) => {
      if (alive) setOtherVersionFiles(resolved);
    });

    return () => {
      alive = false;
    };
  }, [selectedVersion, item.version, item.downloadVersions]);

  const files = otherVersionFiles ?? item.files;

  return (
    <article className="devices_product_downloads__item">
      <header className="devices_product_downloads__item-head devices_product_downloads__item-head--center">
        <div className="devices_product_downloads__item-head-main">
          <div className="devices_product_downloads__item-head-meta">
            <span className="devices_product_downloads__type">{item.type}</span>
            {item.date ? (
              <time className="devices_product_downloads__date" dateTime={item.date}>
                {formatDisplayDate(item.date)}
              </time>
            ) : null}
          </div>
          <div className="devices_product_downloads__item-head-title-row">
            <h3 className="devices_product_downloads__item-tit">{item.title}</h3>
            {item.showVersionSelect ? (
              <div className="devices_product_downloads__item-version">
                <FormControl className="guide_field guide_field--h38 guide_field--w120 devices_product_downloads__version-select">
                  <GuideSelect
                    value={selectedVersion}
                    displayEmpty
                    onChange={(event) =>
                      setSelectedVersion(event.target.value as string)
                    }
                    IconComponent={GuideSelectIcon}
                    inputProps={{
                      "aria-label": `Version for ${item.title}`,
                    }}
                    renderValue={(value) => {
                      const text = value ? String(value) : item.version;
                      return (
                        <span className="guide_field__select-value" title={text}>
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
            {files.map((file) => (
              <li key={file.name} className="devices_product_downloads__file">
                <div className="devices_product_downloads__file-main">
                  <span className="devices_product_downloads__pdf" aria-hidden="true">
                    <img
                      loading="lazy"
                      decoding="async"
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
                  <DevicesProductDownloadsDownloadBtn
                    url={file.url}
                    onDownloaded={() => {
                      pushDataLayerEvent({
                        event: "file_download",
                        file_name: file.name,
                        product_info: productName ?? "",
                        file_category: item.type,
                        file_extension: fileExtensionOf(file.name),
                      });
                    }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  );
}

type DevicesProductDownloadsProps = {
  initial: ProductDownloadsPage;
  productCodes: string[];
  docTypeOptions?: DownloadFilterOption[];
  productName?: string;
};

type DevicesProductDownloadsBodyProps = {
  initial: ProductDownloadsPage;
  productCodes: string[];
  productName?: string;
  keyword: string;
  setKeyword: (value: string) => void;
  appliedKeyword: string;
  setAppliedKeyword: (value: string) => void;
};

export default function DevicesProductDownloads({
  initial,
  productCodes,
  docTypeOptions = [],
  productName,
}: DevicesProductDownloadsProps) {
  const [keyword, setKeyword] = useState("");
  const [appliedKeyword, setAppliedKeyword] = useState("");

  return (
    <DevicesProductDownloadsFilterBoundary
      productCodes={productCodes}
      docTypeOptions={docTypeOptions}
      appliedKeyword={appliedKeyword}
    >
      <DevicesProductDownloadsBody
        initial={initial}
        productCodes={productCodes}
        productName={productName}
        keyword={keyword}
        setKeyword={setKeyword}
        appliedKeyword={appliedKeyword}
        setAppliedKeyword={setAppliedKeyword}
      />
    </DevicesProductDownloadsFilterBoundary>
  );
}

function DevicesProductDownloadsBody({
  initial,
  productCodes,
  productName,
  keyword,
  setKeyword,
  appliedKeyword,
  setAppliedKeyword,
}: DevicesProductDownloadsBodyProps) {
  const { selectedDocTypes } = useDevicesProductDownloadsFilter();
  const docTypeKey = [...selectedDocTypes].sort().join(",");
  const productCodeKey = [...productCodes].sort().join(",");
  const titleRef = useRef<HTMLHeadingElement>(null);

  const [items, setItems] = useState(initial.items);
  const [totalElements, setTotalElements] = useState(initial.totalElements);
  const [totalPages, setTotalPages] = useState(initial.totalPages);
  const [currentPage, setCurrentPage] = useState(1);
  const [sort, setSort] = useState<DownloadCenterSort>(
    PRODUCT_DOWNLOADS_DEFAULT_SORT,
  );
  const [sortOpen, setSortOpen] = useState(false);

  const commitSearch = () => {
    setAppliedKeyword(keyword.trim());
  };

  const firstResetRef = useRef(true);
  useEffect(() => {
    if (firstResetRef.current) {
      firstResetRef.current = false;
      return;
    }
    setCurrentPage(1);
  }, [docTypeKey, sort, appliedKeyword]);

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
      q: appliedKeyword,
    }).then((page) => {
      if (!alive) return;
      setItems(page.items);
      setTotalElements(page.totalElements);
      setTotalPages(page.totalPages);
    });

    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [docTypeKey, productCodeKey, sort, currentPage, appliedKeyword]);

  const showingStart =
    items.length === 0 ? 0 : (currentPage - 1) * PRODUCT_DOWNLOADS_PAGE_SIZE + 1;
  const showingEnd = items.length === 0 ? 0 : showingStart + items.length - 1;
  const isEmpty = items.length === 0;

  return (
    <section
      className={`devices_product_downloads${
        isEmpty ? " devices_product_downloads--no-data" : ""
      }`}
      id="product-downloads"
    >
        <div className="inner">
          <div className="devices_product_downloads__head">
            <h2 className="section_tit" ref={titleRef} tabIndex={-1}>
              Downloads
            </h2>
          </div>
          <DevicesProductDownloadsMobileControls
            sort={sort}
            onSortChange={setSort}
            keyword={keyword}
            onKeywordChange={setKeyword}
            onSearch={commitSearch}
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
                <TextField
                  className="guide_field guide_field--search"
                  placeholder="keyword"
                  aria-label="keyword downloads"
                  value={keyword}
                  onChange={(event) => setKeyword(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") commitSearch();
                  }}
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
                            onClick={commitSearch}
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
                <FormControl className="guide_field guide_field--w200">
                  <GuideSelect
                    value={sort}
                    displayEmpty
                    onChange={(event) =>
                      setSort(event.target.value as DownloadCenterSort)
                    }
                    onOpen={() => setSortOpen(true)}
                    onClose={() => setSortOpen(false)}
                    IconComponent={GuideSelectIcon}
                    inputProps={{ "aria-label": "Sort by" }}
                    renderValue={(value) => {
                      const text = sortOpen
                        ? "Sort by"
                        : productDownloadsSortLabel(
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
              </div>
            </div>
            {isEmpty ? (
              <DevicesProductDownloadsEmpty />
            ) : (
              <>
            <div className="devices_product_downloads__list">
              {items.map((item, index) => (
                <DevicesProductDownloadsItem
                  key={`${item.id}-${currentPage}-${index}`}
                  item={item}
                  productName={productName}
                />
              ))}
            </div>
            <PageNumbering
              className="devices_product_downloads__pagination"
              currentPage={currentPage}
              totalPages={totalPages}
              scrollTargetSelector=".section_tit"
              onPageChange={(page) => {
                setCurrentPage(page);
                titleRef.current?.focus();
              }}
              ariaLabel="Downloads pagination"
            />
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
