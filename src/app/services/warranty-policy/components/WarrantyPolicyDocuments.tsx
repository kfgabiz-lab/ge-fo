import { warrantyPolicyPage } from "@/data/services/warrantyPolicyContent";

/* 260811 start */
export default function WarrantyPolicyDocuments() {
  const { documents } = warrantyPolicyPage;

  return (
    <div className="support_service_warranty_documents" id="warranty-documents">
      <div className="support_service_warranty_documents__head">
        <h2 className="section_tit">{documents.title}</h2>
        <p className="section_desc">{documents.description}</p>
      </div>
      <ul className="support_service_warranty_documents__list">
        {documents.items.map((item) => (
          <li key={item.id} className="support_service_warranty_documents__item">
            <div className="support_service_warranty_documents__meta">
              <p className="support_service_warranty_documents__name">{item.name}</p>
              <span
                className="support_service_warranty_documents__divider"
                aria-hidden="true"
              />
              <p className="support_service_warranty_documents__format">
                {item.format}
              </p>
            </div>
            <a
              href={item.downloadHref}
              className="btn-base btn-lv03 btn-lv03--line"
              {...(item.downloadHref !== "#" ? { download: true } : {})}
            >
              {documents.ctaLabel}
              <span className="icon_download" aria-hidden="true" />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
/* 260811 end */
