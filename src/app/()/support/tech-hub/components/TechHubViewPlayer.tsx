"use client";

import DevicesProductVideoPlayer from "@/components/video/DevicesProductVideoPlayer";

type TechHubViewPlayerProps = {
  youtubeVideoId: string;
  title: string;
};

export default function TechHubViewPlayer({
  youtubeVideoId,
  title,
}: TechHubViewPlayerProps) {
  return (
    <div className="support_tech_hub_view__player">
      <DevicesProductVideoPlayer youtubeVideoId={youtubeVideoId} title={title} />
    </div>
  );
}
