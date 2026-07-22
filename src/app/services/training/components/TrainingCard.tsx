import Link from "next/link";
import type { TrainingCardItem } from "../data/trainingData";

// 미디어 미등록 시 카드 폴백 이미지
const CARD_FALLBACK_IMAGE = "/img/services/engineering-training/course-01.jpg";

// Training 강의 카드. 상세 링크(id 기반)는 variant별 detailHref 주입.
export default function TrainingCard({
  course,
  detailHref,
}: {
  course: TrainingCardItem;
  detailHref: string;
}) {
  return (
    // data-slugkey="id": 상세 링크 href는 id(curriculum PK) 기반으로 파생
    <Link
      href={detailHref}
      className="support_service_training_card"
      data-slugkey="id"
      data-slugkey-attr="href"
    >
      <div className="support_service_training_card__media">
        {/* image: curriculum.image 파일id 배열 첫번째 → /api/v1/fo/page-files/{id} */}
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
        {/* product_category: PRODUCTCATEGORY 코드(P=Power/A=Automation) → 라벨 변환 결과 */}
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
