import { warrantyPolicyPage } from "@/data/services/warrantyPolicyContent";

export default function WarrantyPolicyApply() {
  const { apply } = warrantyPolicyPage;

  return (
    <section className="support_service_warranty_apply" id="warranty-apply">
      <div className="inner">
        <div className="support_service_warranty_apply__head">
          <h2 className="section_tit">{apply.title}</h2>
          <p className="section_desc">{apply.description}</p>
        </div>
        <div className="support_service_warranty_table-wrap">
          <table className="support_service_warranty_table support_service_warranty_table--2col">
            <thead>
              <tr>
                <th scope="col">{apply.tableColumns.category}</th>
                <th scope="col">{apply.tableColumns.contact}</th>
              </tr>
            </thead>
            <tbody>
              {apply.rows.map((row) => (
                <tr key={row.id}>
                  <th scope="row">{row.category}</th>
                  <td>
                    <a href={row.contactHref} className="support_service_warranty_apply__link">
                      {row.contact}
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
