"use client";

import Link from "next/link";
import { useEffect, type ReactNode } from "react";
import { articleDetailClass } from "@/app/company/articleDetailClass";
import DevicesProductVideoPlayer from "@/components/video/DevicesProductVideoPlayer";
import { incrementViewCount } from "@/lib/pageDataApi";

export type CompanyArticleDetailVariant = "blog" | "press" | "events" | "articles";

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
  // prev/next 는 인접 레코드가 없을 수 있어 선택값(맨 처음/끝이면 해당 방향 미노출)
  prev?: CompanyArticleDetailPagerLink;
  next?: CompanyArticleDetailPagerLink;
  listHref: string;
  children: ReactNode;
  embedded?: boolean;
  // 조회수(count) +1 대상 식별자 — 실제 상세([id]) 진입 시에만 전달.
  // slug: page_data data_slug(예: "blog-data"), recordId: page_data.id
  // 정적 미리보기 페이지(/company/*/detail)는 실제 레코드가 없어 미전달 → 증가 호출 안 함.
  slug?: string;
  recordId?: string | number;
};

type CompanyArticleDetailBlogArticlesProps = CompanyArticleDetailBaseProps & {
  variant: "blog" | "articles";
  date: string;
  category?: string;
  detailMeta?: never;
  eventsMeta?: never;
};

type CompanyArticleDetailPressProps = CompanyArticleDetailBaseProps & {
  variant: "press";
  date?: string;
  detailMeta?: CompanyArticleDetailEventsMeta;
  category?: never;
  eventsMeta?: never;
};

type CompanyArticleDetailEventsProps = CompanyArticleDetailBaseProps & {
  variant: "events";
  eventsMeta: CompanyArticleDetailEventsMeta;
  date?: never;
  detailMeta?: never;
  category?: never;
};

export type CompanyArticleDetailProps =
  | CompanyArticleDetailBlogArticlesProps
  | CompanyArticleDetailPressProps
  | CompanyArticleDetailEventsProps;

export { articleDetailClass } from "@/app/company/articleDetailClass";

function EventsMetaItem({ label, value }: { label: string; value: string }) {
  return (
    <span className={articleDetailClass("meta-group")}>
      <span className={articleDetailClass("meta-label")}>{label}</span>
      <span className={articleDetailClass("meta-value")}>{value}</span>
    </span>
  );
}

function DetailMetaRow({ venue, dates }: CompanyArticleDetailEventsMeta) {
  return (
    <div className={articleDetailClass("meta")}>
      <EventsMetaItem label="Venue" value={venue} />
      <span className={articleDetailClass("meta-sep")} aria-hidden="true" />
      <EventsMetaItem label="Dates" value={dates} />
    </div>
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
    embedded = false,
    slug,
    recordId,
  } = props;

  // 마운트 시 1회 조회수(count) +1 — CSR 전용 fire-and-forget.
  // - 이 컴포넌트는 "use client" 라 useEffect 는 실제 브라우저 마운트 시점에만 실행됨.
  //   → 상세 page.tsx(서버 컴포넌트) 직접 호출/Link 프리페치로 인한 과다 증가 위험 없음.
  // - slug/recordId 가 모두 있을 때만(실제 [id] 상세) 호출. 정적 미리보기 페이지는 미호출.
  useEffect(() => {
    if (!slug || recordId == null) return;
    void incrementViewCount(slug, recordId);
  }, [slug, recordId]);

  const pageModifier =
    variant === "blog"
      ? "company-page--blog-detail"
      : variant === "press"
        ? "company-page--press-detail"
        : variant === "articles"
          ? "company-page--articles-detail"
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
            <DetailMetaRow {...props.eventsMeta} />
          ) : variant === "press" && props.detailMeta ? (
            <DetailMetaRow {...props.detailMeta} />
          ) : props.date ? (
            <p className={articleDetailClass("date")}>{props.date}</p>
          ) : null}
        </header>

        <article className="company-article-detail__article tiptap ProseMirror">
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
          {children}
        </article>

        <nav className={articleDetailClass("pager")} aria-label={pagerAriaLabel}>
          {prev ? (
            <Link
              href={prev.href}
              className={`${articleDetailClass("pager-item")} ${articleDetailClass("pager-item", "prev")}`}
              prefetch={false}
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
          ) : null}
          {next ? (
            <Link href={next.href} className={articleDetailClass("pager-item")} prefetch={false}>
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
          ) : null}
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
    return (
      <div className={`company-page ${pageModifier}`} id={pageId}>
        {section}
      </div>
    );
  }

  return (
    <main className={`company-page ${pageModifier}`} id={pageId}>
      {section}
    </main>
  );
}
