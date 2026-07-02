"use client";

import Link from "next/link";
import { Fragment, useEffect, useMemo, useState } from "react";
import {
  marketsSolutionMobileOrder,
  marketsSolutionZones,
} from "../data/marketsSolutions";
import type { SolutionProduct, SolutionZone } from "../data/marketsSolutions";

const PANEL_FADE_MS = 450;

const MAP_BG_PC = "/img/markets/solutions/bg_datacenter.png";
const MAP_BG_MO = "/img/markets/solutions/bg_datacenter_mo.png";

function SolutionProductRow({ product }: { product: SolutionProduct }) {
  return (
    <Link href={product.href} className="markets_solutions__product">
      <span className="markets_solutions__product-img">
        {product.image ? (
          <img
            loading="lazy"
            decoding="async"
            src={product.image}
            alt=""
            width={80}
            height={80}
          />
        ) : null}
      </span>
      <div className="markets_solutions__product-text">
        <strong>{product.title}</strong>
        {product.description ? <p>{product.description}</p> : null}
      </div>
    </Link>
  );
}

function ZonePanelBody({
  zone,
  title,
}: {
  zone: SolutionZone;
  title?: string;
}) {
  const heading = title ?? zone.label;
  return (
    <>
      <div className="markets_solutions__panel-intro">
        <h3 className="markets_solutions__panel-tit">{heading}</h3>
        <p className="markets_solutions__panel-desc">{zone.description}</p>
      </div>
      {zone.products && zone.products.length > 0 ? (
        <ul className="markets_solutions__products">
          {zone.products.map((product, index) => (
            <Fragment key={product.id}>
              {index > 0 ? (
                <li className="markets_solutions__products-sep" aria-hidden="true" />
              ) : null}
              <li className="markets_solutions__products-item">
                <SolutionProductRow product={product} />
              </li>
            </Fragment>
          ))}
        </ul>
      ) : null}
    </>
  );
}

export default function MarketsSolutions() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [displayZoneId, setDisplayZoneId] = useState<string | null>(null);
  const isPanelOpen = activeId !== null;

  useEffect(() => {
    if (activeId) {
      setDisplayZoneId(activeId);
      return;
    }

    const timer = window.setTimeout(() => setDisplayZoneId(null), PANEL_FADE_MS);
    return () => window.clearTimeout(timer);
  }, [activeId]);

  const zoneById = useMemo(
    () => new Map(marketsSolutionZones.map((zone) => [zone.id, zone])),
    [],
  );

  const mobileZones = useMemo(
    () =>
      marketsSolutionMobileOrder
        .map((id) => zoneById.get(id))
        .filter((zone): zone is SolutionZone => zone !== undefined),
    [zoneById],
  );

  const activeZone = useMemo(() => {
    if (!displayZoneId) return null;
    return zoneById.get(displayZoneId) ?? marketsSolutionZones[0];
  }, [displayZoneId, zoneById]);

  const toggleZone = (zoneId: string) => {
    setActiveId((current) => (current === zoneId ? null : zoneId));
  };

  return (
    <section className="markets_solutions" id="markets-solutions">
      <div className="inner markets_solutions__head">
        <h2 className="section_tit">
          End-to-End Data Center Solutions by LS ELECTRIC
        </h2>
      </div>

      <div
        className={`markets_solutions__stage${
          isPanelOpen ? " markets_solutions__stage--open" : ""
        }`}
      >
        <div className="markets_solutions__map">
          <img
            loading="lazy"
            decoding="async"
            className="markets_solutions__map-bg markets_solutions__map-bg--pc"
            src={MAP_BG_PC}
            alt=""
            width={1920}
            height={978}
          />
          <img
            loading="lazy"
            decoding="async"
            className="markets_solutions__map-bg markets_solutions__map-bg--mo"
            src={MAP_BG_MO}
            alt=""
            width={375}
            height={280}
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
                  style={{
                    left: `${zone.mapX}%`,
                    top: `${zone.mapY}%`,
                    ["--mo-x" as string]: `${zone.mobileMapX ?? zone.mapX}%`,
                    ["--mo-y" as string]: `${zone.mobileMapY ?? zone.mapY}%`,
                  }}
                  aria-label={zone.label}
                  aria-pressed={isActive}
                  onClick={() => toggleZone(zone.id)}
                >
                  <span className="markets_solutions__hotspot-pin" aria-hidden="true" />
                  <span className="markets_solutions__hotspot-label">{zone.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <aside
          className="markets_solutions__panel markets_solutions__panel--desktop"
          aria-label="Data center zone details"
          aria-live="polite"
          aria-hidden={!isPanelOpen}
        >
          <div className="markets_solutions__panel-card">
            {activeZone ? <ZonePanelBody zone={activeZone} /> : null}
          </div>
        </aside>

        <div
          className="markets_solutions__accordion"
          aria-label="Data center zones"
        >
          <ul className="markets_solutions__accordion-list">
            {mobileZones.map((zone) => {
              const isOpen = activeId === zone.id;
              const mobileTitle = zone.mobileLabel ?? zone.label;

              return (
                <li
                  key={zone.id}
                  className={`markets_solutions__accordion-item${
                    isOpen ? " is-open" : ""
                  }`}
                >
                  <button
                    type="button"
                    className="markets_solutions__accordion-trigger"
                    aria-expanded={isOpen}
                    onClick={() => toggleZone(zone.id)}
                  >
                    {mobileTitle}
                  </button>
                  {isOpen ? (
                    <div className="markets_solutions__accordion-panel">
                      <ZonePanelBody zone={zone} title={mobileTitle} />
                    </div>
                  ) : null}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
