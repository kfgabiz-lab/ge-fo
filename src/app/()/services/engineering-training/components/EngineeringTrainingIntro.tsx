import { engineeringTrainingPage } from "@/data/services/engineeringTrainingContent";

export default function EngineeringTrainingIntro() {
  const { intro } = engineeringTrainingPage;

  return (
    <section className="support_service_training_intro" id="engineering-training-intro">
      <div className="inner">
        <div className="support_service_training_intro__media">
          <img
            loading="lazy"
            decoding="async"
            className="support_service_training_intro__hero"
            src={intro.heroImage}
            alt=""
          />
        </div>
        <h2 className="support_service_training_intro__headline">
          {intro.headline}
        </h2>
        <p className="support_service_training_intro__desc">
          {intro.description}
        </p>
      </div>
    </section>
  );
}
