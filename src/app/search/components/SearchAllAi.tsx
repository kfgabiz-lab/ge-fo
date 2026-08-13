"use client";

import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { searchAllPage } from "@/data/search/searchAllContent";

const AI_SKELETON_LINE_COUNT = 9;
/** CSS collapsed 높이와 동일 */
const COLLAPSED_HEIGHT = 460;

type SearchAllAiProps = {
  children: ReactNode;
  /** 챗봇 keyword 이벤트 전(스트리밍 시작 전) — 스켈레톤 표시 */
  loading?: boolean;
  /** 스트리밍 완료 — 이때부터 높이 측정(clamp 판정) 시작 */
  settled?: boolean;
};

function SearchAllAiSkeleton({ label = "Loading AI summary" }: { label?: string }) {
  return (
    <div
      className="search_all__ai search_all__ai--skeleton"
      aria-busy="true"
      aria-label={label}
    >
      <div className="search_all__ai-content">
        <div className="search_all__ai-head">
          <span
            className="search_all__ai-skel search_all__ai-skel--badge"
            aria-hidden
          />
          <span
            className="search_all__ai-skel search_all__ai-skel--tit"
            aria-hidden
          />
          <span
            className="search_all__ai-skel search_all__ai-skel--note"
            aria-hidden
          />
        </div>
        <div className="search_all__ai-body">
          <ul className="search_all__ai-list">
            {Array.from({ length: AI_SKELETON_LINE_COUNT }, (_, index) => (
              <li key={index}>
                <span className="search_all__ai-skel-line" aria-hidden>
                  <span className="search_all__ai-skel search_all__ai-skel--bullet" />
                  <span className="search_all__ai-skel search_all__ai-skel--bar" />
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

/**
 * AI 답변 텍스트가 스트리밍으로 계속 자라나기 때문에, 스트리밍 중에는
 * 높이 측정(clamp 판정)을 미루고 텍스트를 있는 그대로 보여준다.
 * 스트리밍이 끝난(settled) 뒤에만 ResizeObserver로 scrollHeight를 재서
 * 460px를 넘으면 접힌 상태(Read more)로 전환한다.
 */
export default function SearchAllAi({
  children,
  loading = false,
  settled = false,
}: SearchAllAiProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const expandedRef = useRef(false);
  const [aiExpanded, setAiExpanded] = useState(false);
  const [aiNeedsMore, setAiNeedsMore] = useState(false);
  const [aiChecked, setAiChecked] = useState(false);

  expandedRef.current = aiExpanded;

  useLayoutEffect(() => {
    if (!settled) {
      setAiNeedsMore(false);
      setAiChecked(false);
      return;
    }

    const root = rootRef.current;
    const content = contentRef.current;
    const inner = innerRef.current;
    if (!root || !content || !inner) {
      return;
    }

    setAiChecked(false);

    const checkScrollHeight = () => {
      if (expandedRef.current) {
        return;
      }

      const head = content.querySelector<HTMLElement>(".search_all__ai-head");
      const styles = getComputedStyle(root);
      const padY =
        parseFloat(styles.paddingTop) + parseFloat(styles.paddingBottom);
      const borderY =
        parseFloat(styles.borderTopWidth) + parseFloat(styles.borderBottomWidth);
      const headH = head?.offsetHeight ?? 0;
      const headMb = head
        ? parseFloat(getComputedStyle(head).marginBottom) || 0
        : 0;

      const natural = headH + headMb + inner.scrollHeight + padY + borderY;
      const needsMore = natural > COLLAPSED_HEIGHT;
      setAiNeedsMore((prev) => (prev === needsMore ? prev : needsMore));
      setAiChecked(true);
    };

    checkScrollHeight();

    const observer = new ResizeObserver(checkScrollHeight);
    observer.observe(inner);

    const images = inner.querySelectorAll("img");
    const onImgLoad = () => checkScrollHeight();
    images.forEach((img) => {
      if (!img.complete) {
        img.addEventListener("load", onImgLoad);
        img.addEventListener("error", onImgLoad);
      }
    });

    window.addEventListener("resize", checkScrollHeight);

    return () => {
      observer.disconnect();
      images.forEach((img) => {
        img.removeEventListener("load", onImgLoad);
        img.removeEventListener("error", onImgLoad);
      });
      window.removeEventListener("resize", checkScrollHeight);
    };
  }, [settled]);

  if (loading) {
    return <SearchAllAiSkeleton />;
  }

  const isCollapsed = settled && aiChecked && !aiExpanded && aiNeedsMore;

  return (
    <div
      ref={rootRef}
      className={[
        "search_all__ai",
        aiExpanded ? "is-expanded" : null,
        isCollapsed ? "is-clamped" : null,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div ref={contentRef} className="search_all__ai-content">
        <div className="search_all__ai-head">
          <img
            className="search_all__ai-badge"
            src="/img/search/search_all_ai_badge.png"
            alt=""
            width={58}
            height={58}
            decoding="async"
            aria-hidden
          />
          <h2 className="search_all__ai-tit">{searchAllPage.aiTitle}</h2>
          <p className="search_all__ai-note">{searchAllPage.aiDisclaimer}</p>
        </div>
        <div id="search-all-ai-body" className="search_all__ai-body">
          <ul className="search_all__ai-list">
            <li>
              <div ref={innerRef} className="search_all__ai-list-text">
                {children}
              </div>
            </li>
          </ul>
        </div>
      </div>
      {isCollapsed ? <div className="search_all__ai-fade" aria-hidden /> : null}
      {settled && aiChecked && aiNeedsMore ? (
        <div className="search_all__ai-more">
          <span className="search_all__ai-more-line" aria-hidden />
          <button
            type="button"
            className="search_all__ai-more-btn"
            aria-expanded={aiExpanded}
            aria-controls="search-all-ai-body"
            onClick={() => setAiExpanded((prev) => !prev)}
          >
            {aiExpanded ? "Read less" : "Read more"}
            <span className="search_all__ai-more-icon" aria-hidden />
          </button>
        </div>
      ) : null}
    </div>
  );
}
