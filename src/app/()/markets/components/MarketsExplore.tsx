"use client";

import { useState } from "react";
import { industryTabs, type IndustryTab } from "../data/marketsContent";

function renderTitleWithBreaks(title: string) {
  return title.split(/<br\s*\/?>/i).map((part, index) => (
    <span key={`${part}-${index}`}>
      {index > 0 ? <br /> : null}
      {part.trim()}
    </span>
  ));
}

function stripHtml(text: string) {
  return text.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

type MarketsExploreProps = {
  tabs?: IndustryTab[];
  defaultTabId?: string;
  sectionDesc?: string;
  /** 5탭 등 긴 라벨 — 가로 스크롤 */
  layout?: "default" | "wide-tabs";
};

export default function MarketsExplore({
  tabs = industryTabs,
  defaultTabId,
  sectionDesc = "Proven solutions across industries, built to meet the unique demands of every sector.",
  layout = "default",
}: MarketsExploreProps) {
  const initialTabId = defaultTabId ?? tabs[0]?.id ?? "";
  const [activeTab, setActiveTab] = useState(initialTabId);
  const active = tabs.find((tab) => tab.id === activeTab) ?? tabs[0];

  if (!active) {
    return null;
  }

  return (
    <section
      className={
        layout === "wide-tabs"
          ? "markets_explore markets_explore--wide-tabs"
          : "markets_explore"
      }
    >
      <div className="inner">
        <div className="markets_explore__head">
          <h2 className="section_tit">Explore Industries</h2>
          <p className="section_desc">{sectionDesc}</p>
        </div>

        <div className="markets_explore__tabs" role="tablist" aria-label="Industries">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              id={`tab-${tab.id}`}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-controls={`panel-${tab.id}`}
              className={
                activeTab === tab.id
                  ? "markets_explore__tab is-active"
                  : "markets_explore__tab"
              }
              onClick={() => setActiveTab(tab.id)}
            >
              {renderTitleWithBreaks(tab.label)}
            </button>
          ))}
        </div>
      </div>

      <div
        id={`panel-${active.id}`}
        className="markets_explore__panel"
        role="tabpanel"
        aria-labelledby={`tab-${active.id}`}
      >
        <div className="inner markets_explore__panel_inner">
          <div className="markets_explore__txt">
            <h3 className="markets_explore__panel_tit">{renderTitleWithBreaks(active.title)}</h3>
            <p className="markets_explore__panel_desc">{active.description}</p>
          </div>
          <div className="markets_explore__img">
            <img
              loading="lazy"
              decoding="async"
              src={active.image}
              alt={stripHtml(active.title)}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
