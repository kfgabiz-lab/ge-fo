import Link from "next/link";
import type { PressListItem } from "@/app/()/company/data/pressListContent";

type CompanyPressListGridProps = {
  items: PressListItem[];
  detailHref?: string;
};

export default function CompanyPressListGrid({
  items,
  detailHref = "/company/press/detail",
}: CompanyPressListGridProps) {
  return (
    <ul className="company-press-list__grid">
      {items.map((item) => (
        <li key={item.id} className="company-press-list__item">
          <Link href={detailHref} className="company-press-list__card">
            <div className="company-press-list__image">
              <img src={item.image} alt={item.title} />
            </div>
            <div className="company-press-list__content">
              <h3 className="company-press-list__title">{item.title}</h3>
              <p className="company-press-list__date">{item.date}</p>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
