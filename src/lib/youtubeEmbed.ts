const YOUTUBE_EMBED_ORIGINS = [
  "https://www.youtube.com",
  "https://www.youtube-nocookie.com",
] as const;

export function getYoutubeEmbedSrc(
  videoId: string,
  options?: { autoplay?: boolean; origin?: string },
) {
  const params = new URLSearchParams({
    autoplay: options?.autoplay ? "1" : "0",
    controls: "1",
    playsinline: "1",
    rel: "0",
    enablejsapi: "1",
  });

  if (options?.autoplay) {
    params.set("mute", "1");
  }

  if (options?.origin) {
    params.set("origin", options.origin);
  }

  return `https://www.youtube-nocookie.com/embed/${videoId}?${params.toString()}`;
}

export function getYoutubePosterSrc(videoId: string) {
  return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
}

// YouTube URL 문자열에서 videoId만 추출한다(watch?v= / youtu.be/ / /embed/ 3형식 지원).
// getYoutubeEmbedSrc가 bare id를 받으므로, product_etc.video 같은 전체 URL은 이 함수로 id를 먼저 뽑는다.
// 형식에 맞지 않으면 빈 문자열 반환(호출부 폴백 유도).
export function getYoutubeIdFromUrl(url: string): string {
  if (!url) return "";
  // https://www.youtube.com/watch?v=VIDEOID (&기타 파라미터 허용)
  const watchMatch = url.match(/[?&]v=([^&]+)/);
  if (watchMatch) return watchMatch[1];
  // https://youtu.be/VIDEOID
  const shortMatch = url.match(/youtu\.be\/([^?&/]+)/);
  if (shortMatch) return shortMatch[1];
  // https://www.youtube.com/embed/VIDEOID
  const embedMatch = url.match(/\/embed\/([^?&/]+)/);
  if (embedMatch) return embedMatch[1];
  return "";
}

function canUseYoutubeIframe(iframe: HTMLIFrameElement | null): iframe is HTMLIFrameElement {
  if (!iframe?.contentWindow) return false;

  const src = iframe.getAttribute("src") ?? "";
  return src.includes("youtube");
}

function postMessageToYoutube(iframe: HTMLIFrameElement, payload: object) {
  if (!canUseYoutubeIframe(iframe)) return;

  const target = iframe.contentWindow;
  if (!target) return;

  const message = JSON.stringify(payload);

  try {
    target.postMessage(message, "*");
  } catch {
    /* cross-origin: ignore */
  }
}

export function postYoutubeCommand(
  iframe: HTMLIFrameElement | null,
  func: "playVideo" | "pauseVideo",
) {
  if (!iframe) return;
  postMessageToYoutube(iframe, { event: "command", func, args: "" });
}

export function setupYoutubeIframe(iframe: HTMLIFrameElement) {
  if (!canUseYoutubeIframe(iframe)) return;

  postMessageToYoutube(iframe, {
    event: "listening",
    id: iframe.id,
    channel: "widget",
  });
  postMessageToYoutube(iframe, {
    event: "command",
    func: "addEventListener",
    args: ["onStateChange"],
  });
}

export function requestYoutubeProgress(iframe: HTMLIFrameElement | null) {
  if (!iframe) return;
  postMessageToYoutube(iframe, {
    event: "command",
    func: "getCurrentTime",
    args: [],
  });
  postMessageToYoutube(iframe, {
    event: "command",
    func: "getDuration",
    args: [],
  });
}

export function isYoutubeEmbedOrigin(origin: string) {
  return (YOUTUBE_EMBED_ORIGINS as readonly string[]).includes(origin);
}

export function isYoutubeMessageFromIframe(
  event: MessageEvent,
  iframe: HTMLIFrameElement | null,
) {
  if (!iframe?.contentWindow) return false;
  return event.source === iframe.contentWindow;
}

export function parseYoutubeMessage(data: unknown) {
  if (typeof data === "string") {
    try {
      return JSON.parse(data) as {
        event?: string;
        info?:
          | number
          | { currentTime?: number; duration?: number; playerState?: number };
      };
    } catch {
      return null;
    }
  }

  if (typeof data === "object" && data !== null && "event" in data) {
    return data as {
      event?: string;
      info?:
        | number
        | { currentTime?: number; duration?: number; playerState?: number };
    };
  }

  return null;
}

export const YOUTUBE_PLAYER_ENDED = 0;
export const YOUTUBE_PLAYER_PLAYING = 1;
export const YOUTUBE_PLAYER_PAUSED = 2;
