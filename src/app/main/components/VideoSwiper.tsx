"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
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
import {
  getYoutubeEmbedSrc,
  getYoutubePosterSrc,
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
    id: "slide-1",
    type: "youtube",
    youtubeId: "JkbrdaEio2k",
    alt: "『 The Guardian's Power 』LS AI 광고 영상",
    subtit: "with Reliable Energy & Automation Solutions",
    titLines: ["Powering the World,", "Lightening the Future"],
    link: { href: "/main", label: "Explore" },
  },
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
    id: "slide-3",
    type: "youtube",
    youtubeId: "1xeeefxlxKg",
    alt: "Smart Factory & Automation",
    subtit: "Digital Transformation",
    titLines: ["Smart Factory", "& Automation"],
    link: { href: "", label: "Explore" },
  },
];

const LAST_SLIDE_INDEX = mainSlides.length - 1;

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

export default function VideoSwiper() {
  const pathname = usePathname();
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

  const activeSlide = mainSlides[activeIndex];
  const isActiveVideo = isMediaSlide(activeSlide);

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

    if (swiper.realIndex >= LAST_SLIDE_INDEX) {
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

        const slide = mainSlides[index];
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
    const slide = mainSlides[index];
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

    const slide = mainSlides[swiper.realIndex];
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
      const slide = mainSlides[index];
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

        const slide = mainSlides[swiper.realIndex];
        if (slide?.type !== "image") return;

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
      const slide = mainSlides[index];
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
      const slide = mainSlides[index];

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

      isVideoPlayingRef.current = false;
      setIsVideoPlaying(false);
      startImageProgressTimer(0);
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
    const slide = mainSlides[index];
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
        {mainSlides.map((slide, index) => (
          <SwiperSlide key={slide.id}>
            <div className="video-slide">
              {slide.type === "youtube" ? (
                isClient && activeIndex === index ? (
                  <>
                    <iframe
                      ref={(el) => {
                        youtubeIframeRefs.current[index] = el;
                      }}
                      key={slide.youtubeId}
                      className="video-slide__media video-slide__youtube-iframe is-active"
                      src={getYoutubeEmbedSrc(slide.youtubeId)}
                      title={slide.alt ?? slide.titLines.join(" ")}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      referrerPolicy="strict-origin-when-cross-origin"
                      allowFullScreen
                      onLoad={(event) =>
                        handleYoutubeIframeLoad(index, event.currentTarget)
                      }
                    />
                    <div
                      className="video-slide__youtube-mask video-slide__youtube-mask--top"
                      aria-hidden="true"
                    />
                    <div
                      className="video-slide__youtube-mask video-slide__youtube-mask--bottom"
                      aria-hidden="true"
                    />
                  </>
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    loading={index === 0 ? "eager" : "lazy"}
                    decoding="async"
                    className="video-slide__media video-slide__poster"
                    src={getYoutubePosterSrc(slide.youtubeId)}
                    alt={slide.alt ?? slide.titLines.join(" ")}
                  />
                )
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
                <h2 className="sl_subtit">{slide.subtit}</h2>
                <h2 className="sl_tit">
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
                >
                  {slide.link.label}
                </a>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="video-pagination" aria-label="슬라이드 페이지네이션">
        <div className="video-pagination__numbers">
          {mainSlides.map((slide, index) => (
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
        {isActiveVideo ? (
          <button
            type="button"
            className="video-pagination__control"
            aria-label={isVideoPlaying ? "영상 정지" : "영상 재생"}
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
