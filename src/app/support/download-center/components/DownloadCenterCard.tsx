"use client";

import { FormControl, MenuItem } from "@mui/material";
import { useState } from "react";
import DevicesProductDownloadsCopyLink from "@/app/()/products-systems/components/product/DevicesProductDownloadsCopyLink";
import { GuideSelectIcon } from "@/components/form/GuideFieldIcons";
import GuideSelect from "@/components/form/GuideSelect";
import {
  fetchDownloadCenterFileUrl,
  hasSelectableVersions,
  type DownloadCenterFile,
  type DownloadCenterItem,
} from "@/data/support/downloadCenterData";

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

type DownloadCenterCardProps = {
  item: DownloadCenterItem;
};

export default function DownloadCenterCard({ item }: DownloadCenterCardProps) {
  const versions = item.versions ?? [];
  const namedVersions = versions.filter((v) => v.versionName?.trim());
  const [selectedVersionId, setSelectedVersionId] = useState<number | null>(
    namedVersions[0]?.versionId ?? versions[0]?.versionId ?? null,
  );
  const selectedVersion =
    versions.find((v) => v.versionId === selectedVersionId) ?? versions[0];
  const files = selectedVersion?.files ?? [];
  const showVersionSelect = hasSelectableVersions(item);

  const handleDownload = async (file: DownloadCenterFile) => {
    try {
      const url = await fetchDownloadCenterFileUrl(file.filePath);
      if (url && typeof window !== "undefined") {
        window.open(url, "_blank", "noopener,noreferrer");
      }
    } catch {
    }
  };

  return (
    <article className="devices_product_downloads__item">
      <header className="devices_product_downloads__item-head devices_product_downloads__item-head--center">
        <div className="devices_product_downloads__item-head-main">
          <div className="devices_product_downloads__item-head-meta">
            <span className="devices_product_downloads__type">
              {item.docTypeLabel ?? ""}
            </span>
            <time
              className="devices_product_downloads__date"
              dateTime={item.date ?? ""}
            >
              {formatDownloadDate(item.date)}
            </time>
          </div>
          <div className="devices_product_downloads__item-head-title-row">
            <h2 className="devices_product_downloads__item-tit">
              {item.title ?? ""}
            </h2>
          </div>
        </div>
      </header>

      <div className="devices_product_downloads__item-downloads">
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
                      {file.fileName ?? ""}
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
                      onClick={() => handleDownload(file)}
                    >
                      Download
                      <span
                        className="devices_product_downloads__file-btn-icon"
                        aria-hidden
                      />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </article>
  );
}
