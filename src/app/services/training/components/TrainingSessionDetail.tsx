"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { EngineeringTrainingSessionDetail } from "@/data/services/engineeringTrainingSessionDetailContent";
import {
  buildSessionTabs,
  engineeringTrainingSessionAssets,
  engineeringTrainingSessionShareLinks,
  type EngineeringTrainingSessionTabId,
} from "@/data/services/engineeringTrainingSessionDetailContent";
import type { TrainingVariant } from "../data/trainingContent";
import TrainingSessionDetailForm from "./TrainingSessionDetailForm";
import TrainingSessionDetailAside from "./TrainingSessionDetailAside";
import TrainingSessionDetailTableScroll from "./TrainingSessionDetailTableScroll";
import { getLenisInstance } from "@/lib/lenisScroll";
import {
  buildGoogleCalendarUrl,
  buildShareHref,
  downloadIcs,
  hasValidEventDate,
  type CalendarEvent,
} from "@/lib/eventShare";

const SESSION_TAB_SCROLL_OFFSET = 150;
const SESSION_TAB_SCROLL_DURATION_MS = 300;

function scrollToSection(id: string) {
  const target = document.getElementById(id);
  if (!target) return;

  const top = Math.max(
    0,
    target.getBoundingClientRect().top + window.scrollY - SESSION_TAB_SCROLL_OFFSET,
  );
  const immediate = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const lenis = getLenisInstance();

  if (lenis) {
    lenis.scrollTo(top, {
      immediate,
      duration: SESSION_TAB_SCROLL_DURATION_MS / 1000,
      programmatic: true,
      force: true,
    });
    return;
  }

  if (immediate) {
    window.scrollTo({ top, behavior: "auto" });
    return;
  }

  const start = window.scrollY;
  const distance = top - start;
  const startTime = performance.now();

  function step(currentTime: number) {
    const progress = Math.min((currentTime - startTime) / SESSION_TAB_SCROLL_DURATION_MS, 1);
    const eased = 1 - (1 - progress) ** 3;

    window.scrollTo(0, start + distance * eased);

    if (progress < 1) {
      requestAnimationFrame(step);
    }
  }

  requestAnimationFrame(step);
}

// 페이지 최상단(top 0)으로 스크롤 — content 비어 session-training 앵커가 없을 때 Agenda 탭 클릭 처리용.
function scrollToTop() {
  const immediate = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const lenis = getLenisInstance();
  if (lenis) {
    lenis.scrollTo(0, {
      immediate,
      duration: SESSION_TAB_SCROLL_DURATION_MS / 1000,
      programmatic: true,
      force: true,
    });
    return;
  }
  window.scrollTo({ top: 0, behavior: immediate ? "auto" : "smooth" });
}

export default function TrainingSessionDetail({
  session,
  variant,
}: {
  session: EngineeringTrainingSessionDetail;
  variant: TrainingVariant;
}) {
  // 본문(content) 유무 — 탭 노출/본문 섹션 노출/Agenda 탭 스크롤 분기의 단일 기준
  const hasContent = session.content.trim().length > 0;
  // 세션 탭 목록: variant(라벨) + content 유무(training 탭 노출)로 동적 구성
  const tabs = useMemo(
    () => buildSessionTabs(variant, hasContent),
    [variant, hasContent],
  );
  const [activeTab, setActiveTab] = useState<EngineeringTrainingSessionTabId>(
    tabs[0].id,
  );
  // 공유 링크에 주입할 현재 페이지 URL(마운트 후 window 접근 → SSR/CSR 안전)
  const [shareUrl, setShareUrl] = useState("");

  useEffect(() => {
    setShareUrl(window.location.href);
  }, []);

  const handleRegister = useCallback(() => {
    setActiveTab("registration");
    scrollToSection("session-registration");
  }, []);

  // Add to Calendar 이벤트: 세션 뷰모델 event(원본 날짜/시간) 사용
  const calendarEvent: CalendarEvent | null =
    session.event && hasValidEventDate(session.event) ? session.event : null;

  const handleGoogleCalendar = useCallback(() => {
    if (!calendarEvent) return;
    window.open(
      buildGoogleCalendarUrl(calendarEvent),
      "_blank",
      "noopener,noreferrer",
    );
  }, [calendarEvent]);

  const handleIcalDownload = useCallback(() => {
    if (!calendarEvent) return;
    downloadIcs(calendarEvent);
  }, [calendarEvent]);

  useEffect(() => {
    const onScroll = () => {
      const offset = window.scrollY + SESSION_TAB_SCROLL_OFFSET;
      // 기본 활성 탭 = 현재 노출된 첫 탭(content 없으면 training 탭이 없으므로 tabs[0])
      let current: EngineeringTrainingSessionTabId = tabs[0].id;

      // 삭제된 앵커(session-training 등)를 참조하지 않도록 노출된 탭만 순회
      for (const tab of tabs) {
        const element = document.getElementById(`session-${tab.id}`);
        if (element && element.offsetTop <= offset) {
          current = tab.id;
        }
      }

      setActiveTab(current);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => window.removeEventListener("scroll", onScroll);
  }, [tabs]);

  return (
    <section
      className="support_service_training_session_detail"
      id="engineering-training-session-detail"
    >
      <div className="inner">
                <header className="support_service_training_session_detail__head">
          <div className="support_service_training_session_detail__title-row">
            <div className="support_service_training_session_detail__title-wrap">
              {/* 카테고리: 부모 curriculum.product_category(P/A) 코드 → 라벨 (코스레벨, _fetchedRel8) */}
              <p
                className="support_service_training_session_detail__category"
                data-slugkey="_fetchedRel8.curriculum.product_category"
              >
                {session.category}
              </p>
              {/* 회차 제목: 이 행의 curriculum_detail2.title (부모 curriculum.title 아님) */}
              <h1
                className="support_service_training_session_detail__title"
                data-slugkey="curriculum_detail2.title"
              >
                {session.title}
              </h1>
            </div>
            <ul
              className="support_service_training_session_detail__share"
              aria-label="Share"
            >
              {engineeringTrainingSessionShareLinks.map((link) => (
                <li key={link.id}>
                  <a
                    href={
                      shareUrl
                        ? buildShareHref(link.id, shareUrl, session.title)
                        : link.href
                    }
                    className="support_service_training_session_detail__share-link"
                    aria-label={link.label}
                    {...(link.external
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                  >
                    <img
                      src={link.icon}
                      alt=""
                      width={20}
                      height={20}
                      loading="lazy"
                      decoding="async"
                    />
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <hr className="support_service_training_session_detail__divider" />
        </header>

        <TrainingSessionDetailAside
          session={session}
          variant="mo"
          onRegister={handleRegister}
        />

        <div className="support_service_training_session_detail__layout">
          <div className="support_service_training_session_detail__main">
            <nav
              className="support_service_training_session_detail__tabs"
              aria-label="Session sections"
            >
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    type="button"
                    className={`support_service_training_session_detail__tab${
                      isActive ? " is-active" : ""
                    }`}
                    onClick={() => {
                      setActiveTab(tab.id);
                      // content 없어 session-training 앵커가 없을 때, Agenda 는 최상단 섹션이므로 page top 0 으로 스크롤
                      if (tab.id === "agenda" && !hasContent) {
                        scrollToTop();
                      } else {
                        scrollToSection(`session-${tab.id}`);
                      }
                    }}
                  >
                    {tab.label}
                    {isActive ? (
                      <span
                        className="support_service_training_session_detail__tab-dot"
                        aria-hidden
                      />
                    ) : null}
                  </button>
                );
              })}
            </nav>

            {/* 세션 본문: curriculum_detail2.content(WYSIWYG HTML) 단일 블록.
                신뢰경계 = BO 관리자 입력·동일 오리진 → company blog/press/articles/events 및
                products GenericProductDetail 선례대로 sanitize 없이 dangerouslySetInnerHTML 직접 렌더.
                content 비어있으면 섹션(및 training 탭) 전체 비노출. */}
            {hasContent ? (
              <div
                id="session-training"
                className="support_service_training_session_detail__section-group"
              >
                <div className="support_service_training_session_detail__block">
                  <div
                    className="support_service_training_session_detail__content"
                    data-slugkey="content"
                    dangerouslySetInnerHTML={{ __html: session.content }}
                  />
                </div>
              </div>
            ) : null}

            <div
              id="session-agenda"
              className="support_service_training_session_detail__block support_service_training_session_detail__block--agenda"
            >
              <h2 className="support_service_training_session_detail__block-tit">Agenda</h2>
              <TrainingSessionDetailTableScroll>
                <table className="support_service_training_session_detail__table">
                  <thead>
                    <tr>
                      <th scope="col">No</th>
                      <th scope="col">Time</th>
                      <th scope="col">Contents</th>
                      {/* Trainer 컬럼: 모든 행 trainer 빈값이면 비노출(뷰모델 showTrainerColumn) */}
                      {session.showTrainerColumn ? (
                        <th scope="col">Trainer</th>
                      ) : null}
                    </tr>
                  </thead>
                  {/* Agenda = 이 회차 행의 training_schedule 배열 반복(단건 main 내부 중첩 다건).
                      No = index+1(태깅 불필요), Time = time_from~time_to 두 필드 조합이라 미태깅(STEP6 조합) */}
                  <tbody data-slug="training_schedule" data-slug-repeat="true">
                    {session.agenda.map((row) => (
                      <tr key={row.id} data-slug-item>
                        <td>{row.number}</td>
                        <td>{row.time}</td>
                        <td>
                          <p
                            className="support_service_training_session_detail__table-tit"
                            data-slugkey="title"
                          >
                            {row.title}
                          </p>
                          {row.description ? (
                            <p
                              className="support_service_training_session_detail__table-desc"
                              data-slugkey="description"
                            >
                              {row.description}
                            </p>
                          ) : null}
                        </td>
                        {session.showTrainerColumn ? (
                          <td data-slugkey="trainer">{row.trainer ?? ""}</td>
                        ) : null}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </TrainingSessionDetailTableScroll>
            </div>

            <div
              id="session-registration"
              className="support_service_training_session_detail__block support_service_training_session_detail__block--registration"
            >
              <h2 className="support_service_training_session_detail__block-tit">
                Registration form
              </h2>
              <TrainingSessionDetailForm session={session} />
            </div>

            <div className="support_service_training_session_detail__block support_service_training_session_detail__block--calendar">
              <h2 className="support_service_training_session_detail__block-tit">
                Add to Calendar
              </h2>
              <div className="support_service_training_session_detail__calendar-actions">
                <button
                  type="button"
                  className="btn-base btn-lv01 btn-lv01--line support_service_training_session_detail__calendar-btn"
                  onClick={handleGoogleCalendar}
                  disabled={!calendarEvent}
                >
                  <img
                    src={engineeringTrainingSessionAssets.calendarIcons.google}
                    alt=""
                    width={16}
                    height={16}
                    loading="lazy"
                    decoding="async"
                    aria-hidden
                  />
                  {session.calendar.googleLabel}
                </button>
                <button
                  type="button"
                  className="btn-base btn-lv01 btn-lv01--line support_service_training_session_detail__calendar-btn"
                  onClick={handleIcalDownload}
                  disabled={!calendarEvent}
                >
                  <span>{session.calendar.icalLabel}</span>
                  <img
                    src={engineeringTrainingSessionAssets.calendarIcons.ical}
                    alt=""
                    width={16}
                    height={16}
                    loading="lazy"
                    decoding="async"
                    aria-hidden
                  />
                </button>
              </div>
            </div>
          </div>

          <TrainingSessionDetailAside
            session={session}
            variant="pc"
            onRegister={handleRegister}
          />
        </div>
      </div>
    </section>
  );
}
