"use client";

import DevicesProductVideoPlayer from "@/components/video/DevicesProductVideoPlayer";

type DevicesProductVideoProps = {
  youtubeVideoId: string;
  title?: string;
};

export default function DevicesProductVideo({
  youtubeVideoId,
  title = "Product video",
}: DevicesProductVideoProps) {
  return (
    <section className="devices_product_video" id="product-video">
      <div className="inner">
        <h2 className="section_tit">Video</h2>
        <DevicesProductVideoPlayer youtubeVideoId={youtubeVideoId} title={title} />
      </div>
    </section>
  );
}
