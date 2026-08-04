"use client";

import Link from "next/link";
import { useState } from "react";
import {
  getYoutubeIdFromUrl,
  getYoutubePosterSrc,
} from "@/lib/youtubeEmbed";
import { formatDisplayDate } from "@/lib/formatDate";
import TechHubViewPlayer from "./TechHubViewPlayer";
import type { TechHubDetail } from "@/data/support/techHubData";

type TechHubViewProps = {
  detail: TechHubDetail;
};

function posterOf(videoUrl: string | null): string | undefined {
  if (!videoUrl) return undefined;
  const id = getYoutubeIdFromUrl(videoUrl);
  return id ? getYoutubePosterSrc(id) : undefined;
}

export default function TechHubView({ detail }: TechHubViewProps) {
  const chapters = detail.chapters;
  const isSeries = detail.versionCount >= 2;

  const [currentVersionId, setCurrentVersionId] = useState<number | null>(
    chapters[0]?.versionId ?? null,
  );
  const current =
    chapters.find((c) => c.versionId === currentVersionId) ?? chapters[0];
  const currentVideoId = current?.videoUrl
    ? getYoutubeIdFromUrl(current.videoUrl)
    : "";
  const currentChapterLabel =
    isSeries && current?.chapterName ? `Chapter ${current.chapterName}` : "";

  const hasRelated = !isSeries && detail.relatedVideos.length > 0;

  return (
    <section className="support_tech_hub_view" id="support-tech-hub-view">
      <div className="inner">
        <header className="support_tech_hub_view__head">
          <div className="support_tech_hub_view__head-main">
            <div className="support_tech_hub_view__title-group">
              {currentChapterLabel ? (
                <span className="support_tech_hub_view__chapter">
                  {currentChapterLabel}
                </span>
              ) : null}
              <h1 className="support_tech_hub_view__title">{detail.title}</h1>
            </div>
            {detail.sourceUpdatedAt ? (
              <p className="support_tech_hub_view__date">
                {formatDisplayDate(detail.sourceUpdatedAt)}
              </p>
            ) : null}
          </div>
          <hr className="support_tech_hub_view__divider" />
        </header>

        <div className="support_tech_hub_view__body">
          <div className="support_tech_hub_view__main">
            <TechHubViewPlayer
              youtubeVideoId={currentVideoId}
              title={detail.title}
            />
          </div>

          {isSeries ? (
            <>
              <div
                className="support_tech_hub_view__series-divider"
                aria-hidden
              />
              <aside className="support_tech_hub_view__series">
                <h2 className="support_tech_hub_view__series-heading">
                  More in This Series
                </h2>
                <ul className="support_tech_hub_view__series-list">
                  {chapters.map((ch) => {
                    const active = ch.versionId === currentVersionId;
                    return (
                      <li
                        key={ch.versionId}
                        className="support_tech_hub_view__series-row"
                      >
                        {/* 챕터 클릭 = 페이지 이동 없이 현재 재생 영상만 클라이언트 전환. 현재 항목 하이라이트. */}
                        <button
                          type="button"
                          onClick={() => setCurrentVersionId(ch.versionId)}
                          aria-current={active ? "true" : undefined}
                          className={
                            active
                              ? "support_tech_hub_view__series-item support_tech_hub_view__series-item--active"
                              : "support_tech_hub_view__series-item"
                          }
                        >
                          <span
                            className="support_tech_hub_view__series-thumb"
                            aria-hidden
                          >
                            <img
                              src={posterOf(ch.videoUrl) || undefined}
                              alt=""
                              loading="lazy"
                              decoding="async"
                            />
                          </span>
                          <span className="support_tech_hub_view__series-meta">
                            <span className="support_tech_hub_view__chapter">
                              Chapter {ch.chapterName}
                            </span>
                            <span className="support_tech_hub_view__series-tit">
                              <span className="support_tech_hub_view__series-tit-line">
                                {detail.title}
                              </span>
                            </span>
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </aside>
            </>
          ) : hasRelated ? (
            <>
              <div
                className="support_tech_hub_view__series-divider"
                aria-hidden
              />
              <aside className="support_tech_hub_view__series">
                <h2 className="support_tech_hub_view__series-heading">
                  Related Video
                </h2>
                <ul className="support_tech_hub_view__series-list">
                  {detail.relatedVideos.map((rv) => (
                    <li
                      key={rv.id}
                      className="support_tech_hub_view__series-row"
                    >
                      {/* Related Video 는 각자 상세로 이동(Chapter 표기 없음). */}
                      <Link
                        href={`/support/tech-hub/view/${rv.id}`}
                        className="support_tech_hub_view__series-item"
                      >
                        <span
                          className="support_tech_hub_view__series-thumb"
                          aria-hidden
                        >
                          <img
                            src={posterOf(rv.videoUrl) || undefined}
                            alt=""
                            loading="lazy"
                            decoding="async"
                          />
                        </span>
                        <span className="support_tech_hub_view__series-meta">
                          <span className="support_tech_hub_view__series-tit">
                            <span className="support_tech_hub_view__series-tit-line">
                              {rv.title}
                            </span>
                          </span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </aside>
            </>
          ) : null}
        </div>

        <div className="support_tech_hub_view__actions">
          <Link
            href="/support/tech-hub"
            className="btn-base btn-lv01 btn-lv01--solid support_tech_hub_view__list-btn"
          >
            LIST
          </Link>
        </div>
      </div>
    </section>
  );
}
