import Link from "next/link";
import {
  engineeringTrainingDetailAssets,
  type EngineeringTrainingSession,
} from "@/data/services/engineeringTrainingDetailContent";

const { type: typeIcon, duration: durationIcon, location: locationIcon } =
  engineeringTrainingDetailAssets.scheduleMetaIcons;

// Training 코스 상세 - 스케줄 세션 카드 (ls-publish EngineeringTrainingDetailSession 이관)
// 세션 상세 링크는 variant별 hrefPrefix 주입으로 파생.
// 마크업은 퍼블리싱 원본과 동일: <li>(__item) 안에 날짜(__date) + 카드(__session).
export default function TrainingDetailSession({
  courseId,
  session,
  hrefPrefix,
  showDate,
}: {
  courseId: string;
  session: EngineeringTrainingSession;
  hrefPrefix: string;
  // 날짜 그룹 첫 세션이면 true. 같은 날짜 묶음의 뒤 세션은 false → __date 를 빈 값으로 렌더해
  //   날짜 중복 노출을 막고, PC 250px 날짜 컬럼(spacer)은 유지해 카드 정렬을 맞춘다.
  showDate: boolean;
}) {
  const sessionHref = `${hrefPrefix}/${courseId}/${session.id}`;

  return (
    // data-slug-item: 가장 가까운 조상 data-slug-repeat(currDtlMgmt-data)의 반복 단위 = 교육회차 1행
    <li className="support_service_training_detail_schedule__item" data-slug-item>
      {/* 교육일자: 이 행의 training_date_from/to 로 FE 산출(formatSessionDateRange). 파생 포맷 문자열이라 미태깅.
          같은 날짜 묶음의 첫 세션에만 텍스트 노출(뒤 세션은 빈 값 = 날짜 컬럼 spacer 유지). */}
      <p className="support_service_training_detail_schedule__date">
        {showDate ? session.date : ""}
      </p>
      <article
        className={[
          "support_service_training_detail_session",
          session.location && "support_service_training_detail_session--in-person",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {/* 접수마감 라벨: 이 회차 행의 curriculum_detail2.register_period_to 와 today() 로
            FE 산출(trainingDetailData.computeClosesLabel). 필드값 자체가 아니라 카운트다운 라벨이라 미태깅 */}
        <span className="support_service_training_detail_session__tag">
          {session.closesLabel}
        </span>
        <div className="support_service_training_detail_session__main">
          <div className="support_service_training_detail_session__body">
            {/* 회차 제목: 이 행의 curriculum_detail2.title */}
            <h2
              className="support_service_training_detail_session__title"
              data-slugkey="curriculum_detail2.title"
            >
              <Link href={sessionHref}>{session.title}</Link>
            </h2>
            {/* PRODUCTS COVERED: 이 행의 연결제품(power_list + automation_list = category-data depth3 연결행 PK)을
                전용 엔드포인트(/training/product-tree) 평면 행으로 제품명 해석 후 join 문자열로 렌더 →
                다중소스 합산이라 단일 slugKey 미태깅(trainingDetailData.extractProductNames) */}
            <p className="support_service_training_detail_session__products">
              {session.productsCovered}
            </p>
          </div>
          {/* 아래 meta 3종은 각 회차 행(currDtlMgmt-data 아이템)의 자체 필드 → 반복 아이템 slugKey 로 태깅:
              - trainingType → curriculum_detail1.training_type (CSV, STEP6 split+라벨조합)
              - duration     → curriculum_detail2.duration (STEP6 "N Hours" 포맷)
              - location     → curriculum_detail2.address (STEP6 조건부: training_type이 Virtual(002) 단독이면 숨김) */}
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
        {/* 세션(회차) 상세 링크 href: 이 회차 행의 PK(id) 기반으로 파생
            (href = /services/{variant}-training/{curriculumId}/{행 id}). courseId 인자는 STEP6에서 curriculumId 로 대응 */}
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
