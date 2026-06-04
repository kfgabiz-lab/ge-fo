export default function CommonBanner01() {
  return (
    <section className="common_banner_01">
      <div className="img_area">
        <img loading="lazy" decoding="async" src="/img/main/bg_banner_02.png" alt="banner_02" />
      </div>
      <div className="tit_area">
        <h2 className="banner_tit">Engineering the Future of Smart Energy</h2>
        <p className="txt">
          Join LS ELECTRIC and drive the energy transition in North America.
        </p>
      </div>
      <div className="btn_area">
        <a href="" className="btn-base btn-lv01 btn-lv01--line-solid">
          Contact Us
        </a>
        <a href="" className="btn-base btn-lv01 btn-lv01--line-solid">
          Go to Connect Portal
          <span className="icon_arrow-18" aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}
