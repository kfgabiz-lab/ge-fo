"use client";

import { FormControl, MenuItem } from "@mui/material";
import { GuideSelectIcon } from "@/components/form/GuideFieldIcons";
import GuideSelect from "@/components/form/GuideSelect";
import type { ProductDownloadItem } from "@/app/()/products-systems/data/productDetailContent";

function renderHighlight(text: string, highlight?: string) {
  if (!highlight) {
    return text;
  }
  const index = text.indexOf(highlight);
  if (index === -1) {
    return text;
  }
  return (
    <>
      {text.slice(0, index)}
      <span className="search_all__mark">{highlight}</span>
      {text.slice(index + highlight.length)}
    </>
  );
}

export default function SearchDocumentsCard({
  item,
  className,
}: {
  item: ProductDownloadItem;
  className?: string;
}) {
  const rootClass = className
    ? `devices_product_downloads__item search_documents__card ${className}`
    : "devices_product_downloads__item search_documents__card";

  return (
    <article className={rootClass}>
      <header className="devices_product_downloads__item-head devices_product_downloads__item-head--center">
        <div className="devices_product_downloads__item-head-main">
          <div className="devices_product_downloads__item-head-meta">
            <span className="devices_product_downloads__type">{item.type}</span>
            {item.date ? (
              <time className="devices_product_downloads__date" dateTime={item.date}>
                {item.date}
              </time>
            ) : null}
          </div>
          <div className="devices_product_downloads__item-head-title-row">
            <h3 className="devices_product_downloads__item-tit">
              {renderHighlight(item.title, "DC Device")}
            </h3>
            {item.versions && item.versions.length > 0 ? (
              <div className="devices_product_downloads__item-version">
                <FormControl className="guide_field guide_field--h38 guide_field--w120 devices_product_downloads__version-select">
                  <GuideSelect
                    defaultValue={item.version}
                    IconComponent={GuideSelectIcon}
                    inputProps={{ "aria-label": `Version for ${item.title}` }}
                    onOpen={(event) => event.preventDefault()}
                    renderValue={(value) => (
                      <span className="guide_field__select-value" title={String(value)}>
                        {String(value)}
                      </span>
                    )}
                  >
                    {item.versions.map((version) => (
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
                    {file.name}
                    {file.size ? ` (${file.size})` : ""}
                  </span>
                </div>
                <div className="devices_product_downloads__file-actions">
                  <button
                    type="button"
                    className="devices_product_downloads__file-btn devices_product_downloads__file-btn--copy devices_product_downloads__file-btn--line"
                  >
                    Copy Link
                    <span className="devices_product_downloads__file-btn-icon" aria-hidden />
                  </button>
                  <button
                    type="button"
                    className="devices_product_downloads__file-btn devices_product_downloads__file-btn--download"
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
