const YOUTUBE_EMBED_ORIGINS = [
  "https://www.youtube.com",
  "https://www.youtube-nocookie.com",
] as const;

export function getYoutubeEmbedSrc(videoId: string) {
  const params = new URLSearchParams({
    autoplay: "0",
    mute: "1",
    controls: "0",
    disablekb: "1",
    fs: "0",
    iv_load_policy: "3",
    modestbranding: "1",
    playsinline: "1",
    rel: "0",
    enablejsapi: "1",
  });

  if (typeof window !== "undefined") {
    params.set("origin", window.location.origin);
  }

  return `https://www.youtube-nocookie.com/embed/${videoId}?${params.toString()}`;
}

export function getYoutubePosterSrc(videoId: string) {
  return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
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
