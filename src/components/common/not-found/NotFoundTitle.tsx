import { notFoundPage } from "@/data/common/notFoundContent";

export default function NotFoundTitle() {
  return (
    <section className="common_404_title" id="common-404-title">
      <div className="inner">
        <h1 className="common_404_title__heading">{notFoundPage.title}</h1>
        <p className="common_404_title__desc">{notFoundPage.description}</p>
      </div>
    </section>
  );
}
