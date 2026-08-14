"use client";

import { FormControl, MenuItem } from "@mui/material";
import { useState } from "react";
import { GuideSelectIcon } from "@/components/form/GuideFieldIcons";
import GuideSelect from "@/components/form/GuideSelect";
import DevicesProductDownloadsCopyLink from "@/app/()/products-systems/components/product/DevicesProductDownloadsCopyLink";
import DevicesProductDownloadsDownloadBtn from "@/app/()/products-systems/components/product/DevicesProductDownloadsDownloadBtn";
import {
  fetchDownloadCenterFileUrl,
  hasSelectableVersions,
  type DownloadCenterItem,
} from "@/data/support/downloadCenterData";
import {
  renderInlineTextHighlight,
  renderTitleTextHighlight,
} from "./renderSearchTextHighlight";

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
  searchTerm?: string;
  className?: string;
}) {
  const versions = item.versions ?? [];
  const namedVersions = versions.filter((v) => v.versionName?.trim());
  const [selectedVersionId, setSelectedVersionId] = useState<number | null>(
    namedVersions[0]?.versionId ?? versions[0]?.versionId ?? null,
  );
  const selectedVersion =
    versions.find((v) => v.versionId === selectedVersionId) ?? versions[0];
  const files = selectedVersion?.files ?? [];
  const showVersionSelect = hasSelectableVersions(item);

  const highlight = searchTerm?.trim() ? searchTerm.trim() : undefined;

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
                      const ver = namedVersions.find(
                        (v) => String(v.versionId) === String(value),
                      );
                      const label = ver?.versionName ?? "";
                      return (
                        <span className="guide_field__select-value" title={label}>
                          {label}
                        </span>
                      );
                    }}
                  >
                    {namedVersions.map((version) => (
                      <MenuItem
                        key={version.versionId}
                        value={String(version.versionId)}
                      >
                        {version.versionName}
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
                  <DevicesProductDownloadsDownloadBtn
                    resolveUrl={() => fetchDownloadCenterFileUrl(file.filePath)}
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
