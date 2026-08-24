"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { TrainingCardItem } from "../data/trainingData";
import {
  seedBreadcrumbCrumbHref,
  seedBreadcrumbTitle,
} from "@/components/layout/shared/breadcrumbTitleStore";

const CARD_FALLBACK_IMAGE = "/img/services/engineering-training/course-01.webp";

export default function TrainingCard({
  course,
  detailHref,
}: {
  course: TrainingCardItem;
  detailHref: string;
}) {
  const listPathname = usePathname();
  const handleCardClick = () => {
    seedBreadcrumbTitle(detailHref, "Course");
    seedBreadcrumbCrumbHref(detailHref, "Training", listPathname);
  };

  return (
    <Link
      href={detailHref}
      className="support_service_training_card"
      data-slugkey="id"
      data-slugkey-attr="href"
      onClick={handleCardClick}
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
