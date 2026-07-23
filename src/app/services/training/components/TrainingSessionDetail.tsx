"use client";

import { useCallback, useEffect, useState } from "react";
import type { EngineeringTrainingSessionDetail } from "@/data/services/engineeringTrainingSessionDetailContent";
import {
  engineeringTrainingSessionAssets,
  engineeringTrainingSessionShareLinks,
  engineeringTrainingSessionTabs,
  type EngineeringTrainingSessionTabId,
} from "@/data/services/engineeringTrainingSessionDetailContent";
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

export default function TrainingSessionDetail({
  session,
}: {
  session: EngineeringTrainingSessionDetail;
}) {
  const [activeTab, setActiveTab] = useState<EngineeringTrainingSessionTabId>("training");
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
      let current: EngineeringTrainingSessionTabId = "training";

      for (const tab of engineeringTrainingSessionTabs) {
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
  }, []);

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
              {engineeringTrainingSessionTabs.map((tab) => {
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
                      scrollToSection(`session-${tab.id}`);
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

            <div
              id="session-training"
              className="support_service_training_session_detail__section-group"
            >
              <div className="support_service_training_session_detail__block">
                <h2 className="support_service_training_session_detail__block-tit">
                  Who should attend?
                </h2>
                <ul className="support_service_training_session_detail__bullets">
                  {session.whoShouldAttend.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="support_service_training_session_detail__block">
                <h2 className="support_service_training_session_detail__block-tit">Meals</h2>
                <p className="support_service_training_session_detail__text">{session.meals}</p>
              </div>
            </div>

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
                      <th scope="col">Trainer</th>
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
                        <td data-slugkey="trainer">{row.trainer ?? ""}</td>
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
