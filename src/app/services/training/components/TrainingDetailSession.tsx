"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  engineeringTrainingDetailAssets,
  type EngineeringTrainingSession,
} from "@/data/services/engineeringTrainingDetailContent";
import { contentDetailPath } from "@/lib/contentDetailPath";
import { seedBreadcrumbCrumbHref } from "@/components/layout/shared/breadcrumbTitleStore";
import { TRAINING_SESSION_DETAIL_HREF_PREFIX } from "../data/trainingData";

const { type: typeIcon, duration: durationIcon, location: locationIcon } =
  engineeringTrainingDetailAssets.scheduleMetaIcons;

export default function TrainingDetailSession({
  session,
}: {
  session: EngineeringTrainingSession;
}) {
  const coursePathname = usePathname();
  const sessionHref = contentDetailPath(
    TRAINING_SESSION_DETAIL_HREF_PREFIX,
    session.id,
    session.slug,
  );
  const handleSessionLinkClick = () => {
    seedBreadcrumbCrumbHref(sessionHref, "Course", coursePathname);
  };

  return (
    <li className="support_service_training_detail_schedule__item" data-slug-item>
      <p className="support_service_training_detail_schedule__date">
        {session.date}
      </p>
      <article
        className={[
          "support_service_training_detail_session",
          session.location && "support_service_training_detail_session--in-person",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <span className="support_service_training_detail_session__tag">
          {session.closesLabel}
        </span>
        <div className="support_service_training_detail_session__main">
          <div className="support_service_training_detail_session__body">
            <h2
              className="support_service_training_detail_session__title"
              data-slugkey="curriculum_detail2.title"
            >
              <Link href={sessionHref} onClick={handleSessionLinkClick}>{session.title}</Link>
            </h2>
            <p className="support_service_training_detail_session__products">
              {session.productsCovered}
            </p>
          </div>
          <ul className="support_service_training_detail_session__meta">
            <li>
              <span
                className="support_service_training_detail_session__meta-icon"
                aria-hidden
              >
                <img
                  src={typeIcon}
                  alt=""
                  width={18}
                  height={18}
                  loading="lazy"
                  decoding="async"
                />
              </span>
              <span data-slugkey="curriculum_detail1.training_type">{session.trainingType}</span>
            </li>
            <li>
              <span
                className="support_service_training_detail_session__meta-icon"
                aria-hidden
              >
                <img
                  src={durationIcon}
                  alt=""
                  width={18}
                  height={18}
                  loading="lazy"
                  decoding="async"
                />
              </span>
              <span data-slugkey="curriculum_detail2.duration">{session.duration}</span>
            </li>
            {session.location ? (
              <li>
                <span
                  className="support_service_training_detail_session__meta-icon support_service_training_detail_session__meta-icon--map"
                  aria-hidden
                >
                  <img
                    src={locationIcon}
                    alt=""
                    width={18}
                    height={18}
                    loading="lazy"
                    decoding="async"
                  />
                </span>
                <span data-slugkey="curriculum_detail2.address">{session.location}</span>
              </li>
            ) : null}
          </ul>
        </div>
        <Link
          href={sessionHref}
          className="support_service_training_detail_session__link"
          aria-label={`View ${session.title} on ${session.date}`}
          data-slugkey="id"
          data-slugkey-attr="href"
          onClick={handleSessionLinkClick}
        />
      </article>
    </li>
  );
}
