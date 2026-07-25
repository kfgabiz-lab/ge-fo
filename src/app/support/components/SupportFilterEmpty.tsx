"use client";

import Link from "next/link";

export type SupportFilterEmptyContent = {
  title: string;
  subtitle: string;
  iconSrc: string;
  viewAllLabel: string;
  viewAllHref: string;
};

type SupportFilterEmptyProps = {
  content: SupportFilterEmptyContent;
  /**
   * 제공 시 View All 을 Link 대신 button 으로 렌더한다 — 페이지 이동 없이 클라이언트에서 필터/검색을 초기화하는 용도.
   * (Tech Hub: 같은 URL 로의 Link 는 초기화가 안 되므로 이 핸들러로 clearAll+검색해제 처리.)
   * 미전달 시 기존처럼 viewAllHref 로 이동(Download Center 등 하위호환).
   */
  onViewAll?: () => void;
};

export default function SupportFilterEmpty({
  content,
  onViewAll,
}: SupportFilterEmptyProps) {
  const { title, subtitle, iconSrc, viewAllLabel, viewAllHref } = content;

  return (
    <div className="support_filter_empty">
      <div className="support_filter_empty__head">
        <div className="support_filter_empty__icon" aria-hidden>
          <img src={iconSrc} alt="" width={148} height={148} />
        </div>
        <div className="support_filter_empty__text">
          <p className="support_filter_empty__title">{title}</p>
          <p className="support_filter_empty__subtitle">{subtitle}</p>
        </div>
      </div>

      {onViewAll ? (
        <button
          type="button"
          onClick={onViewAll}
          className="btn-base btn-lv01 btn-lv01--solid support_filter_empty__view-all"
        >
          {viewAllLabel}
        </button>
      ) : (
        <Link
          href={viewAllHref}
          className="btn-base btn-lv01 btn-lv01--solid support_filter_empty__view-all"
        >
          {viewAllLabel}
        </Link>
      )}
    </div>
  );
}
