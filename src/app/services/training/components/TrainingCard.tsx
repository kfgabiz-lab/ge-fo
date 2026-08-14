"use client";

import Link from "next/link";
import type { TrainingCardItem } from "../data/trainingData";
import { seedBreadcrumbTitle } from "@/components/layout/shared/breadcrumbTitleStore";

const CARD_FALLBACK_IMAGE = "/img/services/engineering-training/course-01.webp";

export default function TrainingCard({
  course,
  detailHref,
}: {
  course: TrainingCardItem;
  detailHref: string;
}) {
  return (
    <Link
      href={detailHref}
      className="support_service_training_card"
      data-slugkey="id"
      data-slugkey-attr="href"
      onClick={() => seedBreadcrumbTitle(detailHref, "Course")}
    >
      <div className="support_service_training_card__media">
        <img
          loading="lazy"
          decoding="async"
          src={course.imageSrc ?? CARD_FALLBACK_IMAGE}
          alt=""
          data-slugkey="image"
          data-slugkey-attr="src"
        />
      </div>
      <div className="support_service_training_card__body">
        <p
          className="support_service_training_card__category"
          data-slugkey="product_category"
        >
          {course.categoryLabel}
        </p>
        <div className="support_service_training_card__text">
          <h3
            className="support_service_training_card__tit"
            data-slugkey="title"
          >
            {course.title}
          </h3>
          <p
            className="support_service_training_card__desc"
            data-slugkey="description"
          >
            {course.description}
          </p>
        </div>
      </div>
    </Link>
  );
}
