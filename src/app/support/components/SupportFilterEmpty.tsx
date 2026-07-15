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
};

export default function SupportFilterEmpty({ content }: SupportFilterEmptyProps) {
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

      <Link
        href={viewAllHref}
        className="btn-base btn-lv01 btn-lv01--solid support_filter_empty__view-all"
      >
        {viewAllLabel}
      </Link>
    </div>
  );
}
