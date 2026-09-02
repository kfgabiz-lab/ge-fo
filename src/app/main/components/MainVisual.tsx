import BannerSwiper from "./BannerSwiper";
import VideoSwiper from "./VideoSwiper";
import {
  fetchBannerItems,
  fetchHeroItems,
  fetchNoticeItem,
} from "./mainVisualData";

export default async function MainVisual() {
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

      {noticeItem && (
        <section className="main_notic">
          <div className="inner">
            {(() => {
              const content = (
                <>
                  <div className="tit_area">
                    <p className="tit">
                      <img
                        loading="eager"
                        decoding="async"
                        src="/ico/ico_bell_20.svg"
                        alt=""
                        aria-hidden="true"
                      />
                      <span data-slugkey="prefix">{noticeItem.prefixLabel}</span>
                    </p>
                    <p className="txt" data-slugkey="bottomText">
                      {noticeItem.bottomText}
                    </p>
                  </div>
                  {noticeItem.url && (
                    <div className="btn_area">
                      <span className="btn-text-30">
                        More
                        <span className="btn-text-30__icon" aria-hidden="true">
                          <span className="icon_arrow-14" aria-hidden="true" />
                        </span>
                      </span>
                    </div>
                  )}
                </>
              );
              // 링크가 없으면 <a>가 아니라 <div>로 렌더링해 클릭해도
              // 아무 곳으로도 이동하지 않도록 한다 (href=""는 현재 페이지로
              // 다시 이동해버리는 문제가 있었음).
              return noticeItem.url ? (
                <a
                  href={noticeItem.url}
                  className="item"
                  data-slug="banner-data"
                  data-slugkey="url_information"
                  data-slugkey-attr="href"
                >
                  {content}
                </a>
              ) : (
                <div className="item item--no-url" data-slug="banner-data">
                  {content}
                </div>
              );
            })()}
          </div>
        </section>
      )}
    </>
  );
}
