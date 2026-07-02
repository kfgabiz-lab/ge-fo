"use client";

import Link from "next/link";
import DevicesProductVideoPlayer from "@/components/video/DevicesProductVideoPlayer";
import { connectPortalPage } from "@/data/support/connectPortalContent";

export default function ConnectPortalVideo() {
  const { video } = connectPortalPage;

  return (
    <section className="support_connect_video" id="support-connect-video">
      <div className="inner support_connect_video__inner">
        <div className="support_connect_video__media">
          <DevicesProductVideoPlayer
            youtubeVideoId={video.youtubeVideoId}
            title={video.title}
          />
        </div>

        <div className="support_connect_video__content">
          <h2 className="support_connect_video__tit">
            {video.headingLines.map((line) => (
              <span key={line} className="support_connect_video__tit-line">
                {line}
              </span>
            ))}
          </h2>
          <p className="support_connect_video__desc">{video.text}</p>
          <Link
            href={video.ctaHref}
            className="btn-base btn-lv01 btn-lv01--solid support_connect_video__cta"
            target="_blank"
            rel="noopener noreferrer"
          >
            {video.ctaLabel}
            <span className="icon_link-14" aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
}
