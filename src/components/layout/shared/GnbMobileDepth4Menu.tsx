import Link from "next/link";
import GnbMobileBack from "@/components/layout/shared/GnbMobileBack";
import type { GnbMobileDepth4Data } from "@/data/gnb/mobileNavItems";

type GnbMobileDepth4MenuProps = {
  data: GnbMobileDepth4Data;
  backLabel: string;
  onBack: () => void;
  onItemNavigate?: () => void;
};

export default function GnbMobileDepth4Menu({
  data,
  backLabel,
  onBack,
  onItemNavigate,
}: GnbMobileDepth4MenuProps) {
  const { intro, products } = data;

  return (
    <div className="gnb_mobile_depth4">
      <GnbMobileBack label={backLabel} onBack={onBack} />
      <div className="gnb_mobile_depth4__body">
        <div className="gnb_mobile_depth4__intro">
          <Link
            href={intro.href}
            prefetch={false}
            className="gnb_mobile_depth4__head"
            onClick={onItemNavigate}
          >
            <span className="gnb_mobile_depth4__tit">{intro.panelTitle}</span>
            <span
              className="gnb_mobile_depth4__arrow"
              aria-hidden="true"
            />
          </Link>
          {intro.description.length > 0 ? (
            <div className="gnb_mobile_depth4__desc">
              <p>
                {intro.description.map((line, index) => (
                  <span key={`${intro.panelTitle}-desc-${index}`}>
                    {index > 0 ? <br /> : null}
                    {line}
                  </span>
                ))}
              </p>
            </div>
          ) : null}
        </div>
        {products.length > 0 ? (
          <div className="gnb_mobile_depth4__products">
            {products.map((product) => (
              <Link
                key={product.id}
                href={product.href}
                prefetch={false}
                className="gnb_mobile_depth4__product"
                onClick={onItemNavigate}
              >
                <div className="gnb_mobile_depth4__product-text">
                  <p className="gnb_mobile_depth4__product-tit">{product.title}</p>
                  {product.subtitle ? (
                    <p className="gnb_mobile_depth4__product-sub">
                      {product.subtitle}
                    </p>
                  ) : null}
                </div>
                <div className="gnb_mobile_depth4__product-img">
                  <img
                    loading="lazy"
                    decoding="async"
                    src={product.image}
                    alt=""
                  />
                </div>
              </Link>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
