import { useCallback, useEffect, useRef, type RefObject } from "react";
import { postYoutubeCommand } from "@/lib/youtubeEmbed";

function entryVisibleRatio(element: HTMLElement) {
  const rect = element.getBoundingClientRect();
  if (rect.height <= 0 || rect.width <= 0) return 0;

  const viewportHeight =
    window.innerHeight || document.documentElement.clientHeight;
  const visibleHeight =
    Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0);

  return Math.max(0, visibleHeight) / rect.height;
}

type UseYoutubeInViewPlaybackOptions = {
  enabled?: boolean;
  /** Visible ratio before autoplay (default 0.35) */
  threshold?: number;
  rootMargin?: string;
};

/**
 * Mount/play YouTube iframe when the section enters the viewport; pause when it leaves.
 * Manual pause is respected until the user presses play again.
 */
export function useYoutubeInViewPlayback(
  sectionRef: RefObject<HTMLElement | null>,
  iframeRef: RefObject<HTMLIFrameElement | null>,
  {
    onEnterView,
    onLeaveView,
  }: {
    onEnterView: () => void;
    onLeaveView: () => void;
  },
  {
    enabled = true,
    threshold = 0.35,
    rootMargin = "0px",
  }: UseYoutubeInViewPlaybackOptions = {},
) {
  const userPausedRef = useRef(false);

  useEffect(() => {
    if (!enabled) return;

    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!userPausedRef.current) {
            onEnterView();
          }
          return;
        }

        postYoutubeCommand(iframeRef.current, "pauseVideo");
        onLeaveView();
      },
      { threshold, rootMargin },
    );

    observer.observe(section);

    const runInitialCheck = () => {
      const ratio = entryVisibleRatio(section);
      if (ratio >= threshold && !userPausedRef.current) {
        onEnterView();
      }
    };

    runInitialCheck();
    const rafId = window.requestAnimationFrame(runInitialCheck);

    return () => {
      window.cancelAnimationFrame(rafId);
      observer.disconnect();
    };
  }, [
    enabled,
    iframeRef,
    onEnterView,
    onLeaveView,
    rootMargin,
    sectionRef,
    threshold,
  ]);

  const markUserPaused = useCallback(() => {
    userPausedRef.current = true;
  }, []);

  const markUserPlaying = useCallback(() => {
    userPausedRef.current = false;
  }, []);

  const resetUserPause = useCallback(() => {
    userPausedRef.current = false;
  }, []);

  return { markUserPaused, markUserPlaying, resetUserPause };
}
