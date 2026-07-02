"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { articleDetailClass } from "@/app/()/company/articleDetailClass";
import DevicesProductVideoPlayer from "@/components/video/DevicesProductVideoPlayer";

export type CompanyArticleDetailVariant = "blog" | "press" | "events" | "media";

export type CompanyArticleDetailPagerLink = {
  href: string;
  title: string;
};

export type CompanyArticleDetailEventsMeta = {
  venue: string;
  dates: string;
};

type CompanyArticleDetailBaseProps = {
  pageId: string;
  title: ReactNode;
  heroImage?: { src: string; alt: string };
  heroVideo?: { youtubeVideoId: string; title: string };
  pagerAriaLabel: string;
  prev: CompanyArticleDetailPagerLink;
  next: CompanyArticleDetailPagerLink;
  listHref: string;
  children: ReactNode;
  /** 히어로 이미지 바로 아래 (예: devices_product_video__player) */
  afterHero?: ReactNode;
  embedded?: boolean;
};

type CompanyArticleDetailBlogPressProps = CompanyArticleDetailBaseProps & {
  variant: "blog" | "press" | "media";
  date: string;
  category?: string;
  eventsMeta?: never;
};

type CompanyArticleDetailEventsProps = CompanyArticleDetailBaseProps & {
  variant: "events";
  eventsMeta: CompanyArticleDetailEventsMeta;
  date?: never;
  category?: never;
};

export type CompanyArticleDetailProps =
  | CompanyArticleDetailBlogPressProps
  | CompanyArticleDetailEventsProps;

export { articleDetailClass } from "@/app/()/company/articleDetailClass";

function EventsMetaItem({ label, value }: { label: string; value: string }) {
  return (
    <span className={articleDetailClass("meta-group")}>
      <span className={articleDetailClass("meta-label")}>{label}</span>
      <span className={articleDetailClass("meta-value")}>{value}</span>
    </span>
  );
}

export default function CompanyArticleDetail(props: CompanyArticleDetailProps) {
  const {
    variant,
    pageId,
    title,
    heroImage,
    heroVideo,
    pagerAriaLabel,
    prev,
    next,
    listHref,
    children,
    afterHero,
    embedded = false,
  } = props;

  const pageModifier =
    variant === "blog"
      ? "company-page--blog-detail"
      : variant === "press"
        ? "company-page--press-detail"
        : variant === "media"
          ? "company-page--media-detail"
          : "company-page--events-detail";

  const section = (
    <section
      className={`company-article-detail company-article-detail--${variant}`}
      id={embedded ? pageId : undefined}
    >
      <div className="inner">
        <header className={articleDetailClass("head")}>
          {variant === "blog" && props.category ? (
            <p className={articleDetailClass("category")}>{props.category}</p>
          ) : null}
          <h1 className={articleDetailClass("title")}>{title}</h1>
          {variant === "events" ? (
            <div className={articleDetailClass("meta")}>
              <EventsMetaItem label="Venue" value={props.eventsMeta.venue} />
              <span className={articleDetailClass("meta-sep")} aria-hidden="true" />
              <EventsMetaItem label="Dates" value={props.eventsMeta.dates} />
            </div>
          ) : (
            <p className={articleDetailClass("date")}>{props.date}</p>
          )}
        </header>

        <article className={articleDetailClass("article")}>
          {heroImage ? (
            <img
              src={heroImage.src}
              alt={heroImage.alt}
              className={articleDetailClass("hero-img")}
            />
          ) : null}
          {heroVideo ? (
            <DevicesProductVideoPlayer
              youtubeVideoId={heroVideo.youtubeVideoId}
              title={heroVideo.title}
            />
          ) : null}
          {afterHero}
          {children}
        </article>

        <nav className={articleDetailClass("pager")} aria-label={pagerAriaLabel}>
          <Link
            href={prev.href}
            className={`${articleDetailClass("pager-item")} ${articleDetailClass("pager-item", "prev")}`}
          >
            <span className={articleDetailClass("pager-dir")}>
              <span className={articleDetailClass("pager-leading")}>
                <span className={articleDetailClass("pager-label")}>PREV</span>
                <img
                  src="/ico/ico_arrow_pager_14.svg"
                  alt=""
                  aria-hidden="true"
                  width={14}
                  height={14}
                  className={`${articleDetailClass("pager-chev")} ${articleDetailClass("pager-chev", "up")}`}
                />
              </span>
              <span className={articleDetailClass("pager-sep")} aria-hidden="true" />
            </span>
            <span className={articleDetailClass("pager-title")}>{prev.title}</span>
          </Link>
          <Link href={next.href} className={articleDetailClass("pager-item")}>
            <span className={articleDetailClass("pager-dir")}>
              <span className={articleDetailClass("pager-leading")}>
                <span className={articleDetailClass("pager-label")}>NEXT</span>
                <img
                  src="/ico/ico_arrow_pager_14.svg"
                  alt=""
                  aria-hidden="true"
                  width={14}
                  height={14}
                  className={`${articleDetailClass("pager-chev")} ${articleDetailClass("pager-chev", "down")}`}
                />
              </span>
              <span className={articleDetailClass("pager-sep")} aria-hidden="true" />
            </span>
            <span className={articleDetailClass("pager-title")}>{next.title}</span>
          </Link>
        </nav>

        <div className={articleDetailClass("btn-wrap")}>
          <Link href={listHref} className="btn-base btn-lv01 btn-lv01--solid">
            LIST
          </Link>
        </div>
      </div>
    </section>
  );

  if (embedded) {
    return section;
  }

  return (
    <main className={`company-page ${pageModifier}`} id={pageId}>
      {section}
    </main>
  );
}

