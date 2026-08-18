import Link from "next/link";
import { emptyStateIconSrc } from "@/data/commonAssets";
import { searchEmptyResult } from "@/data/search/searchAllContent";

export default function SearchEmptyResult({
  className,
}: {
  className?: string;
}) {
  const { title, notes, contactNote } = searchEmptyResult;

  return (
    <div className={className ? `search_empty ${className}` : "search_empty"}>
      <div className="search_empty__top">
        <div className="search_empty__icon" aria-hidden="true">
          <img src={emptyStateIconSrc} alt="" />
        </div>
        <p className="search_empty__title">{title}</p>
      </div>
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
