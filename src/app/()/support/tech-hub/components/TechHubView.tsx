import Link from "next/link";
import { techHubViewDetail } from "@/data/support/techHubContent";
import TechHubViewPlayer from "./TechHubViewPlayer";
import TechHubViewSeriesItem from "./TechHubViewSeriesItem";

export default function TechHubView() {
  const detail = techHubViewDetail;

  return (
    <section className="support_tech_hub_view" id="support-tech-hub-view">
      <div className="inner">
        <header className="support_tech_hub_view__head">
          <div className="support_tech_hub_view__head-main">
            <span className="support_tech_hub_view__chapter">
              {detail.chapter}
            </span>
            <h1 className="support_tech_hub_view__title">{detail.title}</h1>
            <p className="support_tech_hub_view__date">{detail.date}</p>
          </div>
          <hr className="support_tech_hub_view__divider" />
        </header>

        <div className="support_tech_hub_view__body">
          <div className="support_tech_hub_view__main">
            <TechHubViewPlayer
              youtubeVideoId={detail.youtubeVideoId}
              title={detail.title}
            />
          </div>

          <div
            className="support_tech_hub_view__series-divider"
            aria-hidden
          />

          <aside className="support_tech_hub_view__series">
            <h2 className="support_tech_hub_view__series-heading">
              {detail.seriesTitle}
            </h2>
            <ul className="support_tech_hub_view__series-list">
              {detail.series.map((item) => (
                <TechHubViewSeriesItem key={item.id} item={item} />
              ))}
            </ul>
          </aside>
        </div>

        <div className="support_tech_hub_view__actions">
          <Link
            href={detail.listHref}
            className="btn-base btn-lv01 btn-lv01--solid support_tech_hub_view__list-btn"
          >
            LIST
          </Link>
        </div>
      </div>
    </section>
  );
}
