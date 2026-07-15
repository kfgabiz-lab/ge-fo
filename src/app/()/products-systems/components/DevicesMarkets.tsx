import Link from "next/link";
import { motorControlMarkets } from "../data/motorControlContent";

export default function DevicesMarkets() {
  return (
    <section className="devices_markets">
      <div className="inner">
        <div className="devices_markets__head">
          <h2 className="section_tit">Markets</h2>
          <p className="section_desc">
            Discover how our real-time monitoring and precise control capabilities
            drive operational efficiency, ensure compliance,<br /> and maintain 24/7
            continuity across the most demanding global markets.
          </p>
        </div>
        <div className="devices_markets__grid">
          {motorControlMarkets.map((item) => (
            <Link key={item.id} href={item.href} className="item">
              <div className="img_area">
                <img loading="lazy" decoding="async" src={item.image} alt={item.title} />
                <span className="btn-icon-56" aria-hidden="true">
                  <span className="icon_arrow-20" />
                </span>
              </div>
              <div className="txt_area">
                <h3 className="tit">{item.title}</h3>
                <p className="tagline">{item.tagline}</p>
                <p className="desc">{item.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
