import type { EngineeringTrainingDetail } from "@/data/services/engineeringTrainingDetailContent";

export default function EngineeringTrainingDetailHero({
  detail,
}: {
  detail: EngineeringTrainingDetail;
}) {
  return (
    <section
      className="support_service_training_detail_hero"
      id="engineering-training-detail-hero"
    >
      <div className="inner">
        <div className="support_service_training_detail_hero__media">
          <img
            loading="lazy"
            decoding="async"
            className="support_service_training_detail_hero__img"
            src={detail.heroImage}
            alt=""
          />
        </div>
        <div className="support_service_training_detail_hero__content">
          <hr className="support_service_training_detail_hero__divider" />
          <div className="support_service_training_detail_hero__text">
            <p className="support_service_training_detail_hero__category">
              {detail.category}
            </p>
            <h1 className="support_service_training_detail_hero__title">
              {detail.title}
            </h1>
            <p className="support_service_training_detail_hero__desc">
              {detail.descriptionLines.map((line, index) => (
                <span key={`${detail.courseId}-desc-${index}`}>
                  {index > 0 ? <br /> : null}
                  {line}
                </span>
              ))}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
