import Link from "next/link";
import { CONNECT_PORTAL_EXTERNAL_URL } from "@/data/support/connectPortalContent";

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
        <Link href="/support/contact-us" className="btn-base btn-lv01 btn-lv01--line-solid">
          Contact Us
        </Link>        <a
          href={CONNECT_PORTAL_EXTERNAL_URL}
          className="btn-base btn-lv01 btn-lv01--line-solid"
          target="_blank"
          rel="noopener noreferrer"
        >
          Go to Connect Portal
          <span className="icon_arrow-18" aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}
