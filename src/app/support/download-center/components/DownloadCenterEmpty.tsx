import Link from "next/link";
import { downloadCenterEmptyContent } from "@/data/support/downloadCenterContent";

export default function DownloadCenterEmpty() {
  const { title, iconSrc, tips, contactTip, contactHref } =
    downloadCenterEmptyContent;

  return (
    <div className="support_download_empty">
      <div className="support_download_empty__head">
        <div className="support_download_empty__icon" aria-hidden>
          <img src={iconSrc} alt="" width={148} height={148} />
        </div>
        <p className="support_download_empty__title">{title}</p>
      </div>

      <div className="support_download_empty__tips">
        <ul className="support_download_empty__tips-list">
          {tips.map((tip) => (
            <li key={tip} className="support_download_empty__tips-item">
              {tip}
            </li>
          ))}
          <li className="support_download_empty__tips-item">
            {contactTip.before}
            <Link href={contactHref} className="support_download_empty__tips-link">
              {contactTip.linkLabel}
            </Link>
            {contactTip.after}
          </li>
        </ul>
      </div>
    </div>
  );
}
