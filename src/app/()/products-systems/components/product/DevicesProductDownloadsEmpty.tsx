import { emptyStateIconSrc } from "@/data/commonAssets";

export default function DevicesProductDownloadsEmpty() {
  return (
    <div className="devices_product_downloads__empty">
      <div className="devices_product_downloads__empty-icon" aria-hidden="true">
        <img src={emptyStateIconSrc} alt="" />
      </div>
      <div className="devices_product_downloads__empty-text">
        <p className="devices_product_downloads__empty-title">
          There are no results
        </p>
        <p className="devices_product_downloads__empty-desc">
          Check if all the words are spelled correctly
        </p>
      </div>
    </div>
  );
}
