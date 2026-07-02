import { downloadCenterPage } from "@/data/support/downloadCenterContent";

export default function DownloadCenterTitle() {
  return (
    <section className="support_download_title" id="support-download-title">
      <div className="inner">
        <h1 className="support_download_title__heading">{downloadCenterPage.title}</h1>
        <p className="support_download_title__desc">{downloadCenterPage.description}</p>
      </div>
    </section>
  );
}
