"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { marketsSolutionZones } from "../data/marketsSolutions";

const DEFAULT_ACTIVE_ID = "C";

export default function MarketsSolutions() {
  const panelId = useId();
  const panelRef = useRef<HTMLElement>(null);
  const itemRefs = useRef<Partial<Record<string, HTMLElement>>>({});
  const [activeId, setActiveId] = useState(DEFAULT_ACTIVE_ID);

  const handleZoneSelect = (id: string) => {
    setActiveId(id);
  };

  useEffect(() => {
    const scrollActiveIntoPanel = () => {
      const panel = panelRef.current;
      const item = itemRefs.current[activeId];
      if (!panel || !item) return;

      const panelRect = panel.getBoundingClientRect();
      const itemRect = item.getBoundingClientRect();
      const isFullyVisible =
        itemRect.top >= panelRect.top && itemRect.bottom <= panelRect.bottom;

      if (!isFullyVisible) {
        item.scrollIntoView({ block: "nearest", behavior: "smooth" });
      }
    };

    const frame = requestAnimationFrame(() => {
      requestAnimationFrame(scrollActiveIntoPanel);
    });

    return () => cancelAnimationFrame(frame);
  }, [activeId]);

  return (
    <section className="markets_solutions" id="markets-solutions">
      <div className="inner markets_solutions__head">
        <h2 className="section_tit">
          End-to-End Data Center Solutions by LS ELECTRIC
        </h2>
      </div>

      <div className="markets_solutions__stage">
        <div className="markets_solutions__map">
          <img loading="lazy" decoding="async"
            className="markets_solutions__map-bg"
            src="/img/markets/solutions/bg_datacenter.png"
            alt=""
            width={1920}
            height={978}
          />
          <div className="markets_solutions__hotspots">
            {marketsSolutionZones.map((zone) => {
              const isActive = activeId === zone.id;

              return (
                <button
                  key={zone.id}
                  type="button"
                  className={`markets_solutions__hotspot${
                    isActive ? " is-active" : ""
                  }`}
                  style={{ left: `${zone.mapX}%`, top: `${zone.mapY}%` }}
                  aria-label={zone.label}
                  aria-pressed={isActive}
                  aria-controls={`${panelId}-${zone.id}`}
                  onMouseEnter={() => handleZoneSelect(zone.id)}
                  onFocus={() => handleZoneSelect(zone.id)}
                >
                  <span className="markets_solutions__hotspot-badge">{zone.id}</span>
                  <span className="markets_solutions__hotspot-label">{zone.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <aside
          ref={panelRef}
          className="markets_solutions__panel"
          aria-label="Data center zones"
        >
          {marketsSolutionZones.map((zone) => {
            const isActive = activeId === zone.id;
            const bodyId = `${panelId}-${zone.id}`;

            return (
              <article
                key={zone.id}
                ref={(node) => {
                  if (node) itemRefs.current[zone.id] = node;
                  else delete itemRefs.current[zone.id];
                }}
                className={`markets_solutions__item${
                  isActive ? " is-active" : ""
                }`}
              >
                <h3 className="markets_solutions__item-heading">
                  <button
                    type="button"
                    className="markets_solutions__item-head"
                    aria-expanded={isActive}
                    aria-controls={bodyId}
                    id={`${panelId}-trigger-${zone.id}`}
                    onClick={() => handleZoneSelect(zone.id)}
                  >
                    <span className="markets_solutions__item-badge">{zone.id}</span>
                    <span className="markets_solutions__item-tit">{zone.label}</span>
                  </button>
                </h3>

                <div
                  id={bodyId}
                  className="markets_solutions__item-body"
                  role="region"
                  aria-labelledby={`${panelId}-trigger-${zone.id}`}
                  hidden={!isActive}
                >
                  <p className="markets_solutions__item-desc">{zone.description}</p>
                  {zone.products && zone.products.length > 0 ? (
                    <ul className="markets_solutions__products">
                      {zone.products.map((product, index) => (
                        <li key={product.id}>
                          {index > 0 ? (
                            <span
                              className="markets_solutions__products-sep"
                              aria-hidden="true"
                            />
                          ) : null}
                          <Link
                            href={product.href}
                            className="markets_solutions__product"
                          >
                            <img loading="lazy" decoding="async"
                              src={product.image}
                              alt=""
                              width={80}
                              height={80}
                            />
                            <div className="markets_solutions__product-text">
                              <strong>{product.title}</strong>
                              <p>{product.description}</p>
                            </div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </article>
            );
          })}
        </aside>
      </div>
    </section>
  );
}
