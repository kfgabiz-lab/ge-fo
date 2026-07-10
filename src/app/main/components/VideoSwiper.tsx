"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { usePathname } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { A11y, Autoplay, EffectFade } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/effect-fade";
import { isMainPath } from "@/lib/navigation/crossSectionNav";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import type { HeroItem } from "./mainVisualData";
import {
  getYoutubeEmbedSrc,
  isYoutubeEmbedOrigin,
  isYoutubeMessageFromIframe,
  parseYoutubeMessage,
  postYoutubeCommand,
  requestYoutubeProgress,
  setupYoutubeIframe,
  YOUTUBE_PLAYER_ENDED,
} from "@/lib/youtubeEmbed";

const IMAGE_AUTOPLAY_DELAY = 5000;
const YOUTUBE_MIN_PLAY_MS = 3000;
const SWIPER_START_DELAY_MS = 600;
const YOUTUBE_PLAYER_PLAYING = 1;

// 업로드 미디어 스트리밍 엔드포인트(fo 오리진 상대경로 → next.config rewrites 로 bo-api:8080 프록시)
const PAGE_FILE_SRC = (mediaId: number) => `/api/v1/fo/page-files/${mediaId}`;

type VideoSource = {
  src: string;
  type: string;
};

type SlideContent = {
  subtit: string;
  titLines: string[];
  link: {
    href: string;
    label: string;
  };
};

type MainSlide = SlideContent &
  (
    | {
        id: string;
        type: "video";
        sources: VideoSource[];
        poster?: string;
        alt?: string;
      }
    | {
        id: string;
        type: "youtube";
        youtubeId: string;
        alt?: string;
      }
    | {
        id: string;
        type: "image";
        src: string;
        alt?: string;
      }
  );

const mainSlides: MainSlide[] = [
  {
    id: "slide-2",
    type: "image",
    src: "/img/main_sample.png",
    alt: "Clean Energy Solutions",
    subtit: "Sustainable Power Infrastructure",
    titLines: ["Clean Energy", "for a Greener Future"],
    link: { href: "", label: "Explore" },
  },
  {
    id: "slide-video-1",
    type: "video",
    sources: [{ src: "/img/video1.mp4", type: "video/mp4" }],
    alt: "Powering the World, Lightening the Future",
    subtit: "with Reliable Energy & Automation Solutions",
    titLines: ["Powering the World, Lightening the Future"],
    link: { href: "", label: "Explore" },
  },
  {
    id: "slide-3",
    type: "image",
    src: "/img/main_sample_03.jpg",
    alt: "Smart Factory & Automation",
    subtit: "Digital Transformation",
    titLines: ["Smart Factory", "& Automation"],
    link: { href: "", label: "Explore" },
  },
];

const MAIN_VISUAL_MOBILE_MQ = "(max-width: 780px)";

function getVideoProgress(video: HTMLVideoElement) {
  const { duration, currentTime } = video;
  if (!duration || !Number.isFinite(duration)) return 0;
  return Math.min(100, (currentTime / duration) * 100);
}

function isMediaSlide(
  slide: MainSlide | undefined,
): slide is Extract<MainSlide, { type: "video" } | { type: "youtube" }> {
  return slide?.type === "video" || slide?.type === "youtube";
}

interface VideoSwiperProps {
  heroItems: HeroItem[];
}

export default function VideoSwiper({ heroItems }: VideoSwiperProps) {
  const pathname = usePathname();
  const isMobileVisual = useMediaQuery(MAIN_VISUAL_MOBILE_MQ);
  const prevPathnameRef = useRef<string | null>(null);
  const [swiperKey, setSwiperKey] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const swiperRef = useRef<SwiperType | null>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const youtubeIframeRefs = useRef<(HTMLIFrameElement | null)[]>([]);
  const youtubeHasPlayedRef = useRef(false);
  const youtubePlayStartedAtRef = useRef(0);
  const youtubeEndedAllowedRef = useRef(false);
  const youtubeCurrentTimeRef = useRef(0);
  const youtubeDurationRef = useRef(0);
  const videoListenersCleanupRef = useRef<(() => void) | null>(null);
  const isInViewRef = useRef(true);
  const isVideoPlayingRef = useRef(true);
  const isSlideReadyRef = useRef(false);
  const startTimerRef = useRef<number | null>(null);
  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(
    null,
  );
  const progressStartRef = useRef(0);
  const autoplayProgressRef = useRef(0);
  const activeIndexRef = useRef(0);
  const isClient = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const [autoplayProgress, setAutoplayProgress] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);

  // 실데이터(heroItems) 기반 슬라이드 구성.
  //  - item.mediaId 가 있으면: 해당 슬라이드를 "이미지" 타입으로 강제하고
  //    src 를 업로드 미디어 스트리밍 엔드포인트(/api/v1/fo/page-files/{mediaId})로 설정.
  //    (실제 파일이 이미지/영상인지 mime 으로 판단하기 어려워 우선 이미지로 렌더링. 영상 미처리 — 문서 비고 참고)
  //  - item.mediaId 가 없으면(null): 기존 정적 목업(mainSlides)을 index 순환으로 유지.
  //  - 텍스트/링크(sub/titleText/btnUrl/btnText)는 항상 실데이터로 교체.
  const slides = useMemo<MainSlide[]>(() => {
    if (heroItems.length === 0) return mainSlides; // 조회 0건 시 목업 폴백
    return heroItems.map((item, index) => {
      const media = mainSlides[index % mainSlides.length];
      const base = {
        id: `hero-${item.id}`,
        subtit: item.sub,
        titLines: item.titleText ? [item.titleText] : media.titLines,
        link: {
          href: item.btnUrl || media.link.href,
          label: item.btnText || media.link.label,
        },
      };

      if (item.mediaId != null) {
        // 실 업로드 미디어를 이미지 슬라이드로 렌더링
        return {
          ...base,
          type: "image",
          src: PAGE_FILE_SRC(item.mediaId),
          alt: item.titleText || media.alt,
        } as MainSlide;
      }

      // 미디어ID 없음 → 기존 목업 미디어(type/src/sources/youtubeId/poster) 유지
      return {
        ...media,
        ...base,
      } as MainSlide;
    });
  }, [heroItems]);

  // 콜백들이 최신 slides 를 참조하도록 ref 로 보관(콜백 의존성 배열 변경 최소화 목적)
  const slidesRef = useRef<MainSlide[]>(slides);
  slidesRef.current = slides;

  const activeSlide = slidesRef.current[activeIndex];
  const isActiveVideo = isMediaSlide(activeSlide);
  const showPlaybackControl = isMobileVisual || isActiveVideo;

  const setProgress = useCallback((value: number) => {
    autoplayProgressRef.current = value;
    setAutoplayProgress(value);
  }, []);

  const applySwiperIndex = useCallback((swiper: SwiperType) => {
    const index = swiper.realIndex;
    activeIndexRef.current = index;
    setActiveIndex(index);
  }, []);

  const clearStartTimer = useCallback(() => {
    if (startTimerRef.current !== null) {
      clearTimeout(startTimerRef.current);
      startTimerRef.current = null;
    }
  }, []);

  const clearProgressTimer = useCallback(() => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  }, []);

  const clearVideoListeners = useCallback(() => {
    videoListenersCleanupRef.current?.();
    videoListenersCleanupRef.current = null;
  }, []);

  const resetYoutubePlaybackState = useCallback(() => {
    youtubeHasPlayedRef.current = false;
    youtubePlayStartedAtRef.current = 0;
    youtubeEndedAllowedRef.current = false;
  }, []);

  const getYoutubeIframe = useCallback((index: number) => {
    return youtubeIframeRefs.current[index] ?? null;
  }, []);

  const canAdvanceFromYoutube = useCallback(() => {
    if (!youtubeHasPlayedRef.current) return false;
    return Date.now() - youtubePlayStartedAtRef.current >= YOUTUBE_MIN_PLAY_MS;
  }, []);

  const markYoutubePlaying = useCallback(() => {
    if (youtubeHasPlayedRef.current) return;
    youtubeHasPlayedRef.current = true;
    youtubePlayStartedAtRef.current = Date.now();
  }, []);

  const goToNextSlideOrFirst = useCallback((swiper: SwiperType) => {
    if (swiper.animating) return;

    if (swiper.realIndex >= slidesRef.current.length - 1) {
      swiper.slideTo(0);
      return;
    }
    swiper.slideNext();
  }, []);

  const startYoutubeProgressPoll = useCallback(
    (index: number) => {
      clearProgressTimer();

      progressIntervalRef.current = setInterval(() => {
        const swiper = swiperRef.current;
        if (!swiper || swiper.animating) return;
        if (swiper.realIndex !== index) return;

        const slide = slidesRef.current[index];
        if (slide?.type !== "youtube" || !isVideoPlayingRef.current) return;

        requestYoutubeProgress(getYoutubeIframe(index));

        const duration = youtubeDurationRef.current;
        const current = youtubeCurrentTimeRef.current;
        if (!duration || duration <= 0) return;

        if (current >= 1) {
          youtubeEndedAllowedRef.current = true;
          markYoutubePlaying();
        }

        setProgress(Math.min(100, (current / duration) * 100));
      }, 500);
    },
    [clearProgressTimer, getYoutubeIframe, markYoutubePlaying, setProgress],
  );

  const playYoutubeAt = useCallback(
    (index: number) => {
      const iframe = getYoutubeIframe(index);
      if (!iframe) return;

      isVideoPlayingRef.current = true;
      setIsVideoPlaying(true);
      setupYoutubeIframe(iframe);
      postYoutubeCommand(iframe, "playVideo");
      startYoutubeProgressPoll(index);
    },
    [getYoutubeIframe, startYoutubeProgressPoll],
  );

  const pauseAllYoutube = useCallback(() => {
    const swiper = swiperRef.current;
    if (!swiper) return;

    const index = swiper.realIndex;
    const slide = slidesRef.current[index];
    if (slide?.type !== "youtube") return;

    postYoutubeCommand(getYoutubeIframe(index), "pauseVideo");
  }, [getYoutubeIframe]);

  const handleYoutubeIframeLoad = useCallback(
    (index: number, iframe: HTMLIFrameElement) => {
      youtubeIframeRefs.current[index] = iframe;
      setupYoutubeIframe(iframe);

      const swiper = swiperRef.current;
      if (
        !swiper ||
        swiper.realIndex !== index ||
        !isSlideReadyRef.current ||
        !isVideoPlayingRef.current
      ) {
        return;
      }

      postYoutubeCommand(iframe, "playVideo");
      window.setTimeout(() => {
        requestYoutubeProgress(iframe);
        startYoutubeProgressPoll(index);
      }, 300);
    },
    [startYoutubeProgressPoll],
  );

  const pauseYoutube = useCallback(() => {
    pauseAllYoutube();
    clearProgressTimer();
    isVideoPlayingRef.current = false;
    setIsVideoPlaying(false);
  }, [clearProgressTimer, pauseAllYoutube]);

  const handleYoutubeEnded = useCallback(() => {
    const swiper = swiperRef.current;
    if (!swiper) return;

    const slide = slidesRef.current[swiper.realIndex];
    if (slide?.type !== "youtube") return;
    if (!youtubeEndedAllowedRef.current) return;
    if (!canAdvanceFromYoutube()) return;

    if (
      youtubeDurationRef.current > 0 &&
      youtubeCurrentTimeRef.current < 1
    ) {
      return;
    }

    clearProgressTimer();
    setProgress(100);
    resetYoutubePlaybackState();
    goToNextSlideOrFirst(swiper);
  }, [
    canAdvanceFromYoutube,
    clearProgressTimer,
    goToNextSlideOrFirst,
    resetYoutubePlaybackState,
    setProgress,
  ]);

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (!isYoutubeEmbedOrigin(event.origin)) {
        return;
      }

      const data = parseYoutubeMessage(event.data);
      if (!data?.event) return;

      const swiper = swiperRef.current;
      if (!swiper) return;

      const index = swiper.realIndex;
      const slide = slidesRef.current[index];
      if (slide?.type !== "youtube") return;

      const activeIframe = getYoutubeIframe(index);
      if (!isYoutubeMessageFromIframe(event, activeIframe)) return;

      if (data.event === "onStateChange" && typeof data.info === "number") {
        if (data.info === YOUTUBE_PLAYER_PLAYING && isVideoPlayingRef.current) {
          startYoutubeProgressPoll(index);
        }

        if (data.info === YOUTUBE_PLAYER_ENDED && isVideoPlayingRef.current) {
          handleYoutubeEnded();
        }
        return;
      }

      if (data.event !== "infoDelivery" || !data.info || typeof data.info !== "object") {
        return;
      }

      const { playerState, currentTime, duration } = data.info;

      if (typeof currentTime === "number") {
        youtubeCurrentTimeRef.current = currentTime;
      }
      if (typeof duration === "number" && duration > 0) {
        youtubeDurationRef.current = duration;
      }

      if (
        playerState === YOUTUBE_PLAYER_ENDED &&
        isVideoPlayingRef.current
      ) {
        handleYoutubeEnded();
        return;
      }

      if (
        isVideoPlayingRef.current &&
        typeof currentTime === "number" &&
        typeof duration === "number" &&
        duration > 0
      ) {
        if (currentTime >= 1) {
          youtubeEndedAllowedRef.current = true;
          markYoutubePlaying();
        }
        setProgress(Math.min(100, (currentTime / duration) * 100));
      }
    };

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [
    getYoutubeIframe,
    handleYoutubeEnded,
    markYoutubePlaying,
    setProgress,
    startYoutubeProgressPoll,
  ]);

  const startImageProgressTimer = useCallback(
    (fromProgress = 0) => {
      clearProgressTimer();
      progressStartRef.current =
        Date.now() - (fromProgress / 100) * IMAGE_AUTOPLAY_DELAY;

      progressIntervalRef.current = setInterval(() => {
        const swiper = swiperRef.current;
        if (!swiper || swiper.animating) return;

        const slide = slidesRef.current[swiper.realIndex];
        if (slide?.type !== "image") return;
        if (!isVideoPlayingRef.current) return;

        const elapsed = Date.now() - progressStartRef.current;
        const progress = Math.min(
          100,
          (elapsed / IMAGE_AUTOPLAY_DELAY) * 100,
        );
        setProgress(progress);

        if (progress >= 100) {
          clearProgressTimer();
          goToNextSlideOrFirst(swiper);
        }
      }, 16);
    },
    [clearProgressTimer, goToNextSlideOrFirst, setProgress],
  );

  const bindVideoProgress = useCallback(
    (video: HTMLVideoElement, index: number) => {
      clearVideoListeners();

      const handleTimeUpdate = () => {
        if (swiperRef.current?.realIndex !== index) return;
        if (!isVideoPlayingRef.current) return;
        setProgress(getVideoProgress(video));
      };

      const handleEnded = () => {
        const swiper = swiperRef.current;
        if (!swiper || swiper.realIndex !== index) return;
        setProgress(100);
        goToNextSlideOrFirst(swiper);
      };

      const handleLoadedMetadata = () => {
        if (swiperRef.current?.realIndex !== index) return;
        setProgress(getVideoProgress(video));
      };

      video.addEventListener("timeupdate", handleTimeUpdate);
      video.addEventListener("ended", handleEnded);
      video.addEventListener("loadedmetadata", handleLoadedMetadata);

      videoListenersCleanupRef.current = () => {
        video.removeEventListener("timeupdate", handleTimeUpdate);
        video.removeEventListener("ended", handleEnded);
        video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      };

      if (video.readyState >= 1) {
        setProgress(getVideoProgress(video));
      }
    },
    [clearVideoListeners, goToNextSlideOrFirst, setProgress],
  );

  const pauseAll = useCallback(
    (reset = true) => {
      videoRefs.current.forEach((video) => {
        if (!video) return;
        video.pause();
        if (reset) video.currentTime = 0;
      });
      pauseAllYoutube();
      clearProgressTimer();
    },
    [clearProgressTimer, pauseAllYoutube],
  );

  const playActiveVideo = useCallback(
    (index: number) => {
      const slide = slidesRef.current[index];
      if (!slide || slide.type !== "video") return;

      const video = videoRefs.current[index];
      if (!video) return;

      video.currentTime = 0;
      setProgress(0);
      bindVideoProgress(video, index);
      if (!isInViewRef.current) return;
      void video.play().catch(() => {});
    },
    [bindVideoProgress, setProgress],
  );

  const syncSlideMedia = useCallback(
    (swiper: SwiperType) => {
      if (!isSlideReadyRef.current || !isInViewRef.current) return;

      const index = swiper.realIndex;
      const slide = slidesRef.current[index];

      clearProgressTimer();
      clearVideoListeners();
      pauseAll(true);
      setProgress(0);

      if (slide?.type === "video") {
        isVideoPlayingRef.current = true;
        setIsVideoPlaying(true);
        swiper.autoplay.stop();
        playActiveVideo(index);
        return;
      }

      if (slide?.type === "youtube") {
        resetYoutubePlaybackState();
        youtubeCurrentTimeRef.current = 0;
        youtubeDurationRef.current = 0;
        playYoutubeAt(index);
        return;
      }

      if (slide?.type === "image") {
        isVideoPlayingRef.current = true;
        setIsVideoPlaying(true);
        startImageProgressTimer(0);
      }
    },
    [
      clearProgressTimer,
      clearVideoListeners,
      pauseAll,
      playActiveVideo,
      playYoutubeAt,
      resetYoutubePlaybackState,
      setProgress,
      startImageProgressTimer,
    ],
  );

  const onSlideSettled = useCallback(
    (swiper: SwiperType) => {
      applySwiperIndex(swiper);
      syncSlideMedia(swiper);
    },
    [applySwiperIndex, syncSlideMedia],
  );

  const scheduleInitialStart = useCallback(() => {
    clearStartTimer();
    isSlideReadyRef.current = false;
    pauseAll(true);
    resetYoutubePlaybackState();
    setProgress(0);
    isVideoPlayingRef.current = true;
    setIsVideoPlaying(true);

    const swiper = swiperRef.current;
    if (swiper) {
      if (swiper.realIndex !== 0) {
        swiper.slideTo(0, 0);
      }
      swiper.update();
      swiper.updateSlidesClasses();
      applySwiperIndex(swiper);
    }

    startTimerRef.current = window.setTimeout(() => {
      startTimerRef.current = null;
      isSlideReadyRef.current = true;
      const current = swiperRef.current;
      if (!current) return;
      onSlideSettled(current);
    }, SWIPER_START_DELAY_MS);
  }, [
    applySwiperIndex,
    clearStartTimer,
    onSlideSettled,
    pauseAll,
    resetYoutubePlaybackState,
    setProgress,
  ]);

  const resumeVisibleSlide = useCallback(() => {
    const swiper = swiperRef.current;
    if (!swiper || !isInViewRef.current || !isSlideReadyRef.current) return;
    onSlideSettled(swiper);
  }, [onSlideSettled]);

  useEffect(
    () => () => {
      clearProgressTimer();
      clearVideoListeners();
      clearStartTimer();
    },
    [clearProgressTimer, clearVideoListeners, clearStartTimer],
  );

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isIntersecting = entry?.isIntersecting ?? false;
        isInViewRef.current = isIntersecting;

        if (!isIntersecting) {
          clearProgressTimer();
          pauseAll(false);
          swiperRef.current?.autoplay.stop();
          return;
        }

        resumeVisibleSlide();
      },
      { threshold: 0.2 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [clearProgressTimer, pauseAll, resumeVisibleSlide]);

  const handleSwiper = useCallback(
    (swiper: SwiperType) => {
      swiperRef.current = swiper;
      scheduleInitialStart();
    },
    [scheduleInitialStart],
  );

  const remountSwiper = useCallback(() => {
    clearStartTimer();
    clearProgressTimer();
    clearVideoListeners();
    isSlideReadyRef.current = false;
    swiperRef.current = null;
    activeIndexRef.current = 0;
    setActiveIndex(0);
    setAutoplayProgress(0);
    setIsVideoPlaying(true);
    setSwiperKey((key) => key + 1);
  }, [clearProgressTimer, clearStartTimer, clearVideoListeners]);

  useEffect(() => {
    if (!isMainPath(pathname)) {
      prevPathnameRef.current = pathname;
      return;
    }

    if (
      prevPathnameRef.current !== null &&
      prevPathnameRef.current !== pathname
    ) {
      remountSwiper();
    }

    prevPathnameRef.current = pathname;
  }, [pathname, remountSwiper]);

  const handleRealIndexChange = useCallback(
    (swiper: SwiperType) => {
      applySwiperIndex(swiper);
    },
    [applySwiperIndex],
  );

  const handleSlideChangeTransitionEnd = useCallback(
    (swiper: SwiperType) => {
      applySwiperIndex(swiper);
      if (!isSlideReadyRef.current) return;
      syncSlideMedia(swiper);
    },
    [applySwiperIndex, syncSlideMedia],
  );

  const handlePaginationClick = (index: number) => {
    const swiper = swiperRef.current;
    if (!swiper || swiper.realIndex === index) return;

    clearProgressTimer();
    resetYoutubePlaybackState();
    setProgress(0);
    swiper.slideTo(index);
  };

  const toggleVideoPlayback = () => {
    const swiper = swiperRef.current;
    if (!swiper) return;

    const index = swiper.realIndex;
    const slide = slidesRef.current[index];
    if (!slide) return;

    if (slide.type === "image") {
      if (isVideoPlayingRef.current) {
        clearProgressTimer();
        isVideoPlayingRef.current = false;
        setIsVideoPlaying(false);
        return;
      }

      isVideoPlayingRef.current = true;
      setIsVideoPlaying(true);
      startImageProgressTimer(autoplayProgressRef.current);
      return;
    }

    if (!isMediaSlide(slide)) return;

    if (slide.type === "video") {
      const video = videoRefs.current[index];
      if (!video) return;

      if (isVideoPlayingRef.current) {
        video.pause();
        isVideoPlayingRef.current = false;
        setIsVideoPlaying(false);
        setProgress(getVideoProgress(video));
        return;
      }

      if (!isInViewRef.current) {
        isVideoPlayingRef.current = true;
        setIsVideoPlaying(true);
        bindVideoProgress(video, index);
        return;
      }

      void video.play().catch(() => {});
      isVideoPlayingRef.current = true;
      setIsVideoPlaying(true);
      bindVideoProgress(video, index);
      return;
    }

    if (isVideoPlayingRef.current) {
      pauseYoutube();
      return;
    }

    if (!isInViewRef.current) {
      isVideoPlayingRef.current = true;
      setIsVideoPlaying(true);
      return;
    }

    playYoutubeAt(index);
  };

  return (
    <div
      ref={sectionRef}
      className="video-swiper-section"
      aria-label="메인 비주얼 슬라이드"
    >
      <Swiper
        key={swiperKey}
        className="video-swiper"
        data-slug="hero-data"
        data-slug-repeat="true"
        modules={[A11y, Autoplay, EffectFade]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        slidesPerView={1}
        speed={600}
        loop={false}
        autoplay={false}
        observer
        observeParents
        watchSlidesProgress
        initialSlide={0}
        onSwiper={handleSwiper}
        onRealIndexChange={handleRealIndexChange}
        onSlideChangeTransitionEnd={handleSlideChangeTransitionEnd}
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={slide.id} data-slug-item>
            <div className="video-slide">
              {slide.type === "youtube" ? (
                isClient ? (
                  <iframe
                    ref={(el) => {
                      youtubeIframeRefs.current[index] = el;
                    }}
                    key={slide.youtubeId}
                    className={
                      activeIndex === index
                        ? "video-slide__media video-slide__youtube-iframe is-active"
                        : "video-slide__media video-slide__youtube-iframe"
                    }
                    src={getYoutubeEmbedSrc(slide.youtubeId, {
                      origin: window.location.origin,
                    })}
                    title={slide.alt ?? slide.titLines.join(" ")}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                    onLoad={(event) =>
                      handleYoutubeIframeLoad(index, event.currentTarget)
                    }
                  />
                ) : null
              ) : slide.type === "video" ? (
                <video
                  ref={(el) => {
                    videoRefs.current[index] = el;
                  }}
                  className="video-slide__media"
                  poster={slide.poster}
                  muted
                  playsInline
                  preload="metadata"
                >
                  {slide.sources.map((source) => (
                    <source
                      key={source.src}
                      src={source.src}
                      type={source.type}
                    />
                  ))}
                </video>
              ) : (
                <Image
                  className="video-slide__media video-slide__image"
                  src={slide.src}
                  alt={slide.alt ?? slide.titLines.join(" ")}
                  fill
                  sizes="100vw"
                  priority={index === 0}
                />
              )}
              <div className="sl_dim" aria-hidden="true" />
              <div className="sl_content">
                <h2 className="sl_subtit" data-slugKey="sub">{slide.subtit}</h2>
                <h2 className="sl_tit" data-slugKey="titleText">
                  {slide.titLines.map((line, lineIndex) => (
                    <span key={line}>
                      {lineIndex > 0 && <br />}
                      {line}
                    </span>
                  ))}
                </h2>
                <a
                  href={slide.link.href}
                  className="btn-base btn-lv01 btn-lv01--line-solid"
                  data-slugKey="btnUrl"
                  data-slugKey-attr="href"
                >
                  <span data-slugKey="btnText">{slide.link.label}</span>
                </a>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="video-pagination" aria-label="슬라이드 페이지네이션">
        <div
          className={
            isMobileVisual
              ? "video-pagination__numbers video-pagination__numbers--mobile"
              : "video-pagination__numbers"
          }
        >
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              type="button"
              className={
                activeIndex === index
                  ? "video-pagination__num is-active"
                  : "video-pagination__num"
              }
              aria-label={`${index + 1}번 슬라이드`}
              aria-current={activeIndex === index ? "true" : undefined}
              onClick={() => handlePaginationClick(index)}
            >
              {String(index + 1).padStart(2, "0")}
            </button>
          ))}
        </div>
        <div
          className="video-pagination__bar"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(autoplayProgress)}
          aria-label={
            isActiveVideo ? "영상 재생 진행률" : "슬라이드 자동재생 진행률"
          }
        >
          <span
            className="video-pagination__bar-fill"
            style={{ width: `${autoplayProgress}%` }}
          />
        </div>
        {showPlaybackControl ? (
          <button
            type="button"
            className="video-pagination__control"
            aria-label={isVideoPlaying ? "슬라이드 정지" : "슬라이드 재생"}
            aria-pressed={isVideoPlaying}
            onClick={toggleVideoPlayback}
          >
            {isVideoPlaying ? (
              <span className="video-pagination__icon video-pagination__icon--pause" />
            ) : (
              <span className="video-pagination__icon video-pagination__icon--play" />
            )}
          </button>
        ) : null}
      </div>
    </div>
  );
}
