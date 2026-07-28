"use client";

import { FormControl, MenuItem } from "@mui/material";
import { useState } from "react";
import { GuideSelectIcon } from "@/components/form/GuideFieldIcons";
import GuideSelect from "@/components/form/GuideSelect";
import DevicesProductDownloadsCopyLink from "@/app/()/products-systems/components/product/DevicesProductDownloadsCopyLink";
import {
  fetchDownloadCenterFileUrl,
  type DownloadCenterItem,
} from "@/data/support/downloadCenterData";
import {
  renderInlineTextHighlight,
  renderTitleTextHighlight,
} from "./renderSearchTextHighlight";

// YYYY-MM-DD → "Dec 9, 2025"(퍼블리싱 표기). DownloadCenterCard 와 동일 규칙. 값 없거나 파싱 실패 시 원본/빈문자.
function formatDownloadDate(date: string | null): string {
  if (!date) return "";
  const d = new Date(`${date}T00:00:00`);
  if (Number.isNaN(d.getTime())) return date;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function renderFileHighlight(text: string, highlight?: string) {
  if (!highlight) {
    return text;
  }

  return renderInlineTextHighlight(
    text,
    highlight,
    "devices_product_downloads__file-name-mark",
  );
}

export default function SearchDocumentsCard({
  item,
  searchTerm,
  className,
}: {
  item: DownloadCenterItem;
  // 검색어(있을 때만 제목/파일명 강조). 다른 검색 카드와 동일 관례.
  searchTerm?: string;
  className?: string;
}) {
  const versions = item.versions ?? [];
  // 기본 선택 = 첫 버전(BE 가 sort_key DESC 로 내려주므로 최신 버전). 버전 전환은 재요청 없이 클라이언트 상태만 변경.
  const [selectedVersionId, setSelectedVersionId] = useState<number | null>(
    versions[0]?.versionId ?? null,
  );
  const selectedVersion =
    versions.find((v) => v.versionId === selectedVersionId) ?? versions[0];
  const files = selectedVersion?.files ?? [];
  // 버전 드롭다운은 다버전일 때만 노출(단일 버전은 파일만) — 퍼블리싱 조건 유지.
  const showVersionSelect = versions.length > 1;

  const highlight = searchTerm?.trim() ? searchTerm.trim() : undefined;

  // Download 버튼 — 클릭 시 fresh URL 발급 후 새 탭 다운로드. CTP 미연동(500) 등은 무시(화면 깨짐 방지).
  const handleDownload = async (filePath: string | null) => {
    try {
      const url = await fetchDownloadCenterFileUrl(filePath);
      if (url && typeof window !== "undefined") {
        window.open(url, "_blank", "noopener,noreferrer");
      }
    } catch {
      /* CTP 로컬 미연동 등 — 무시 */
    }
  };

  const rootClass = className
    ? `devices_product_downloads__item search_all__document ${className}`.trim()
    : "devices_product_downloads__item search_all__document";

  return (
    <article className={rootClass}>
      <header className="devices_product_downloads__item-head devices_product_downloads__item-head--center">
        <div className="devices_product_downloads__item-head-main">
          <div className="devices_product_downloads__item-head-meta">
            <span className="devices_product_downloads__type">
              {item.docTypeLabel ?? ""}
            </span>
            {item.date ? (
              <time className="devices_product_downloads__date" dateTime={item.date}>
                {formatDownloadDate(item.date)}
              </time>
            ) : null}
          </div>
          <div className="devices_product_downloads__item-head-title-row">
            <h3 className="devices_product_downloads__item-tit">
              {renderTitleTextHighlight(
                item.title ?? "",
                highlight,
                "devices_product_downloads__item-tit-mark",
              )}
            </h3>
            {showVersionSelect ? (
              <div className="devices_product_downloads__item-version">
                <FormControl className="guide_field guide_field--h38 guide_field--w120 devices_product_downloads__version-select">
                  <GuideSelect
                    value={selectedVersion ? String(selectedVersion.versionId) : ""}
                    onChange={(event) =>
                      setSelectedVersionId(Number(event.target.value))
                    }
                    IconComponent={GuideSelectIcon}
                    inputProps={{ "aria-label": `Version for ${item.title ?? ""}` }}
                    renderValue={(value) => {
                      const ver = versions.find(
                        (v) => String(v.versionId) === String(value),
                      );
                      const label = ver?.versionName ?? String(ver?.sortKey ?? "");
                      return (
                        <span className="guide_field__select-value" title={label}>
                          {label}
                        </span>
                      );
                    }}
                  >
                    {versions.map((version) => (
                      <MenuItem
                        key={version.versionId}
                        value={String(version.versionId)}
                      >
                        {version.versionName ?? String(version.sortKey)}
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
            {files.map((file, index) => (
              <li
                key={file.fileId ?? `${file.fileName}-${index}`}
                className="devices_product_downloads__file"
              >
                <div className="devices_product_downloads__file-main">
                  <span className="devices_product_downloads__pdf" aria-hidden>
                    <img
                      src="/ico/ico_pdf_18.svg"
                      alt=""
                      width={18}
                      height={18}
                      loading="lazy"
                      decoding="async"
                    />
                  </span>
                  <span className="devices_product_downloads__file-name">
                    {renderFileHighlight(file.fileName ?? "", highlight)}
                    {file.fileSizeText ? ` (${file.fileSizeText})` : ""}
                  </span>
                </div>
                <div className="devices_product_downloads__file-actions">
                  <DevicesProductDownloadsCopyLink
                    className="devices_product_downloads__file-btn--line"
                    resolveUrl={() => fetchDownloadCenterFileUrl(file.filePath)}
                  />
                  <button
                    type="button"
                    className="devices_product_downloads__file-btn devices_product_downloads__file-btn--download"
                    onClick={() => handleDownload(file.filePath)}
                  >
                    Download
                    <span className="devices_product_downloads__file-btn-icon" aria-hidden />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  );
}
