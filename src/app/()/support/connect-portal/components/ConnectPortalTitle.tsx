import { connectPortalPage } from "@/data/support/connectPortalContent";

export default function ConnectPortalTitle() {
  return (
    <section className="support_connect_title" id="support-connect-title">
      <div className="inner">
        <h1 className="support_connect_title__heading">{connectPortalPage.title}</h1>
        <p className="support_connect_title__desc">{connectPortalPage.description}</p>
      </div>
    </section>
  );
}
