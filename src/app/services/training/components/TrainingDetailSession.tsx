import Link from "next/link";
import {
  engineeringTrainingDetailAssets,
  type EngineeringTrainingSession,
} from "@/data/services/engineeringTrainingDetailContent";

const { type: typeIcon, duration: durationIcon, location: locationIcon } =
  engineeringTrainingDetailAssets.scheduleMetaIcons;

// Training 코스 상세 - 스케줄 세션 카드 (ls-publish EngineeringTrainingDetailSession 이관)
// 세션 상세 링크는 variant별 hrefPrefix 주입으로 파생.
export default function TrainingDetailSession({
  courseId,
  session,
  hrefPrefix,
}: {
  courseId: string;
  session: EngineeringTrainingSession;
  hrefPrefix: string;
}) {
  const sessionHref = `${hrefPrefix}/${courseId}/${session.id}`;

  return (
    // data-slug-item: 가장 가까운 조상 data-slug-repeat(training_schedule)의 반복 단위
    <li className="support_service_training_detail_schedule__item" data-slug-item>
      {/* 세션 날짜: training_schedule 아이템 date */}
      <p
        className="support_service_training_detail_schedule__date"
        data-slugkey="date"
      >
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
        {/* closesLabel(접수마감 카운트 라벨): curriculum_detail2.register_period_to 와 today() 로
            FE 산출(trainingDetailData.computeClosesLabel). 코스레벨 단건 값이라 카드에 동일 표시, 단일 필드가 아니라 미태깅 */}
        <span className="support_service_training_detail_session__tag">
          {session.closesLabel}
        </span>
        <div className="support_service_training_detail_session__main">
          <div className="support_service_training_detail_session__body">
            {/* 세션 제목: training_schedule 아이템 title (카드별 개별 값) */}
            <h2
              className="support_service_training_detail_session__title"
              data-slugkey="title"
            >
              <Link href={sessionHref}>{session.title}</Link>
            </h2>
            {/* PRODUCTS COVERED: 연결제품 제품명 합산(_fetchedRel22=Power + _fetchedRel23=Automation,
                각 원소 _fetchedRelN[].product.product_name). 코스레벨 다건을 join 문자열로 렌더 →
                다중소스 합산이라 단일 slugKey 미태깅(trainingDetailData.extractProductNames) */}
            <p className="support_service_training_detail_session__products">
              {session.productsCovered}
            </p>
          </div>
          {/* 아래 meta 3종(trainingType/duration/location)은 training_schedule 아이템 필드가 아니라
              코스레벨(단건) 필드로 각 카드에 동일 표시됨 → 반복 아이템 slugKey 로 태깅하지 않고 주석 표기.
              뷰모델(toTrainingCourseDetail)에서 부모 단건 레코드 값으로 채움:
              - trainingType → curriculum_detail1.training_type(코드→라벨)
              - duration     → curriculum_detail2.duration
              - location     → curriculum_detail2.address */}
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
              <span>{session.trainingType}</span>
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
              <span>{session.duration}</span>
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
                <span>{session.location}</span>
              </li>
            ) : null}
          </ul>
        </div>
        {/* 세션 상세 링크 href: training_schedule 아이템 id(uuid) 기반으로 파생
            (href = /services/{variant}-training/{courseId}/{id}) */}
        <Link
          href={sessionHref}
          className="support_service_training_detail_session__link"
          aria-label={`View ${session.title} on ${session.date}`}
          data-slugkey="id"
          data-slugkey-attr="href"
        />
      </article>
    </li>
  );
}
