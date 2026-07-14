"use client";

import { useMemo } from "react";
import { getYoutubeEmbedSrc } from "@/lib/youtubeEmbed";

export type DevicesProductVideoPlayerProps = {
  youtubeVideoId: string;
  title?: string;
};

export default function DevicesProductVideoPlayer({
  youtubeVideoId,
  title = "Product video",
}: DevicesProductVideoPlayerProps) {
  const embedSrc = useMemo(
    () => getYoutubeEmbedSrc(youtubeVideoId),
    [youtubeVideoId],
  );

  return (
    <div className="devices_product_video__player">
      <div className="devices_product_video__embed">
        <iframe
          className="devices_product_video__iframe"
          src={embedSrc}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>
    </div>
  );
}
