type DevicesProductDownloadsCheckLabelProps = {
  label: string;
  count?: number;
};

export default function DevicesProductDownloadsCheckLabel({
  label,
  count,
}: DevicesProductDownloadsCheckLabelProps) {
  return (
    <span className="devices_product_downloads__check-label">
      <span className="devices_product_downloads__check-label-text">{label}</span>
      {count !== undefined ? (
        <span className="devices_product_downloads__check-label-count">
          ({count})
        </span>
      ) : null}
    </span>
  );
}
