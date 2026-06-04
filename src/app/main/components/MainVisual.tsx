import BannerSwiper from "./BannerSwiper";
import VideoSwiper from "./VideoSwiper";

export default function MainVisual() {
  return (
    <>
      <section className="main_visual">
        <VideoSwiper />
        <BannerSwiper />
      </section>

      <section className="main_notic">
        <div className="inner">
          <a href="" className="item">
            <div className="tit_area">
              <p className="tit">
              <img loading="eager" decoding="async" src="/ico/ico_bell_20.svg" alt="" aria-hidden="true" />
              Exhibition
                </p>
              <p className="txt">
                Triple iF Design 2026 3 Wins in Smart Device &amp; Energy
                Platform Design
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
