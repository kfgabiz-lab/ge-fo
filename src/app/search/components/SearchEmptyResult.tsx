import Link from "next/link";
import { searchEmptyResult } from "@/data/search/searchAllContent";

/**
 * 통합검색 공통 Empty State (LSEA-FO-SEARCH-102).
 * All/Products/Documents/Media/Pages 5개 탭이 각자 결과 0건일 때 동일한 마크업으로 노출한다.
 * (company/support 의 Empty 컴포넌트와는 문구·구성이 다른 별도 기획이라 재사용하지 않는다.)
 */
export default function SearchEmptyResult({
  className,
}: {
  /** 탭별 여백 보정이 필요할 때만 추가 클래스를 붙인다. */
  className?: string;
}) {
  const { title, notes, contactNote } = searchEmptyResult;

  return (
    <div className={className ? `search_empty ${className}` : "search_empty"}>
      <p className="search_empty__title">{title}</p>
      <ul className="search_empty__list">
        {notes.map((note) => (
          <li key={note} className="search_empty__item">
            {note}
          </li>
        ))}
        <li className="search_empty__item">
          {contactNote.before}
          <Link
            href={contactNote.linkHref}
            prefetch={false}
            className="search_empty__link"
          >
            {contactNote.linkLabel}
          </Link>
          {contactNote.after}
        </li>
      </ul>
    </div>
  );
}
