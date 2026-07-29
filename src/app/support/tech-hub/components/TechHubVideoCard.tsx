import Link from "next/link";
import { getYoutubeIdFromUrl, getYoutubePosterSrc } from "@/lib/youtubeEmbed";
import type { TechHubCard } from "@/data/support/techHubData";

type TechHubVideoCardProps = {
  item: TechHubCard;
};

export default function TechHubVideoCard({ item }: TechHubVideoCardProps) {
  const videoId = item.videoUrl ? getYoutubeIdFromUrl(item.videoUrl) : "";
  const poster = videoId ? getYoutubePosterSrc(videoId) : undefined;
  const viewHref = `/support/tech-hub/view/${item.id}`;
  const label = item.title ?? "";

  return (
    <article className="support_tech_hub_card">
      <Link
        href={viewHref}
        className="support_tech_hub_card__media"
        aria-label={`Play video: ${label}`}
      >
        <span className="support_tech_hub_card__thumb" aria-hidden>
          {/* poster 없으면 src 미설정(undefined) — 빈 문자열 src 로 인한 재다운로드 경고 방지 */}
          <img src={poster || undefined} alt="" loading="lazy" decoding="async" />
        </span>
      </Link>
      <h2 className="support_tech_hub_card__tit">
        <Link href={viewHref} className="support_tech_hub_card__tit-line">
          {label}
        </Link>
      </h2>
    </article>
  );
}
