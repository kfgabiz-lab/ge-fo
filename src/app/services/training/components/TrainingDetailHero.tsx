import type { EngineeringTrainingDetail } from "@/data/services/engineeringTrainingDetailContent";

export default function TrainingDetailHero({
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
            data-slugkey="_fetchedRel8.curriculum.image"
            data-slugkey-attr="src"
          />
        </div>
        <div className="support_service_training_detail_hero__content">
          <hr className="support_service_training_detail_hero__divider" />
          <div className="support_service_training_detail_hero__text">
            <p
              className="support_service_training_detail_hero__category"
              data-slugkey="_fetchedRel8.curriculum.product_category"
            >
              {detail.category}
            </p>
            <h1
              className="support_service_training_detail_hero__title"
              data-slugkey="_fetchedRel8.curriculum.title"
            >
              {detail.title}
            </h1>
            <p
              className="support_service_training_detail_hero__desc"
              data-slugkey="_fetchedRel8.curriculum.description"
            >
              {detail.descriptionLines.join(" ")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
