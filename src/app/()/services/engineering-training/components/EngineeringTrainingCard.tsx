import Link from "next/link";
import type { EngineeringTrainingCourse } from "@/data/services/engineeringTrainingContent";

export default function EngineeringTrainingCard({
  course,
}: {
  course: EngineeringTrainingCourse;
}) {
  const detailHref = `/services/engineering-training/${course.id}`;

  return (
    <article className="support_service_training_card">
      <div className="support_service_training_card__media">
        <Link href={detailHref} tabIndex={-1} aria-hidden>
          <img loading="lazy" decoding="async" src={course.image} alt="" />
        </Link>
      </div>
      <div className="support_service_training_card__body">
        <p className="support_service_training_card__category">{course.category}</p>
        <div className="support_service_training_card__text">
          <h3 className="support_service_training_card__tit">
            <Link href={detailHref}>{course.title}</Link>
          </h3>
          {course.descriptionLines ? (
            <p className="support_service_training_card__desc">
              {course.descriptionLines.map((line, index) => (
                <span key={`${course.id}-${index}`}>
                  {index > 0 ? <br /> : null}
                  {line}
                </span>
              ))}
            </p>
          ) : (
            <p className="support_service_training_card__desc">{course.description}</p>
          )}
        </div>
      </div>
    </article>
  );
}
