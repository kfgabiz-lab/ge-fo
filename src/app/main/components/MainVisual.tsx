import BannerSwiper from "./BannerSwiper";
import VideoSwiper from "./VideoSwiper";
import {
  fetchBannerItems,
  fetchHeroItems,
  fetchNoticeItem,
} from "./mainVisualData";

export default async function MainVisual() {
  // 서버 컴포넌트에서 히어로/배너/공지 데이터를 병렬 조회 후 각 컴포넌트에 props 전달.
  // 조회 실패 시 빈 배열/ null → 기존 정적 목업으로 폴백(화면 깨짐 방지).
  const [heroItems, bannerItems, noticeItem] = await Promise.all([
    fetchHeroItems().catch(() => []),
    fetchBannerItems().catch(() => []),
    fetchNoticeItem().catch(() => null),
  ]);

  return (
    <>
      <section className="main_visual">
        <VideoSwiper heroItems={heroItems} />
        <BannerSwiper bannerItems={bannerItems} />
      </section>

      <section className="main_notic">
        <div className="inner">
          {/* noticeItem 있으면 실데이터, 없으면(매칭 0건/조회 실패) 정적 목업 유지 */}
          <a
            href={noticeItem ? noticeItem.url : ""}
            className="item"
            data-slug="banner-data"
            data-slugKey="url"
            data-slugKey-attr="href"
          >
            <div className="tit_area">
              <p className="tit">
                <img
                  loading="eager"
                  decoding="async"
                  src="/ico/ico_bell_20.svg"
                  alt=""
                  aria-hidden="true"
                />
                <span data-slugKey="prefix">
                  {noticeItem ? noticeItem.prefixLabel : "Exhibition"}
                </span>
              </p>
              <p className="txt" data-slugKey="bottomText">
                {noticeItem
                  ? noticeItem.bottomText
                  : "Triple iF Design 2026 3 Wins in Smart Device & Energy Platform Design"}
              </p>
            </div>
            <div className="btn_area">
              <span className="btn-text-30">
                More
                <span className="btn-text-30__icon" aria-hidden="true">
                  <span className="icon_arrow-14" aria-hidden="true" />
                </span>
              </span>
            </div>
          </a>
        </div>
      </section>
    </>
  );
}
