import Link from "next/link";
import { downloadCenterEmptyContent } from "@/data/support/downloadCenterContent";

// Figma 5565:128770(down4.png) — Download Center 전용 tips형 Empty.
// 검색/필터 결과 0건(totalElements===0) 시 목록 영역에 노출. 판정은 DownloadCenterContents 에서 처리.
// (Tech Hub 의 공통 SupportFilterEmpty 와 다르게 Download Center 는 검색팁 4줄 + Contact Us 링크 스펙.)
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
