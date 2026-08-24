"use client";

import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import type {
  EngineeringTrainingAgendaRow,
  EngineeringTrainingSessionDetail,
} from "@/data/services/engineeringTrainingSessionDetailContent";
import {
  buildSessionTabs,
  engineeringTrainingSessionAssets,
  engineeringTrainingSessionShareLinks,
  type EngineeringTrainingSessionTabId,
} from "@/data/services/engineeringTrainingSessionDetailContent";
import type { TrainingVariant } from "../data/trainingContent";
import { seedBreadcrumbTitle } from "@/components/layout/shared/breadcrumbTitleStore";
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
import { stripHtmlText } from "@/lib/stripHtmlText";

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

type AgendaGroup = {
  date: string;
  label: string; 
  rows: EngineeringTrainingAgendaRow[];
};

function toAgendaGroups(rows: EngineeringTrainingAgendaRow[]): AgendaGroup[] {
  const groups: AgendaGroup[] = [];
  const indexByDate = new Map<string, number>();

  for (const row of rows) {
    const key = row.date ?? "";
    const existing = indexByDate.get(key);
    if (existing === undefined) {
      indexByDate.set(key, groups.length);
      groups.push({
        date: key,
        label: `Session ${groups.length + 1}`,
        rows: [{ ...row, number: "1" }],
      });
    } else {
      const target = groups[existing];
      target.rows.push({ ...row, number: String(target.rows.length + 1) });
    }
  }

  return groups;
}

export default function TrainingSessionDetail({
  session,
  variant,
}: {
  session: EngineeringTrainingSessionDetail;
  variant: TrainingVariant;
}) {
  const hasContent = stripHtmlText(session.content).length > 0;
  const tabs = useMemo(
    () => buildSessionTabs(variant, hasContent),
    [variant, hasContent],
  );
  const [activeTab, setActiveTab] = useState<EngineeringTrainingSessionTabId>(
    tabs[0].id,
  );
  const [shareUrl, setShareUrl] = useState("");

  const agendaGroups = useMemo(() => toAgendaGroups(session.agenda), [
    session.agenda,
  ]);
  const showAgendaSessions = agendaGroups.length > 1;
  const agendaRenderGroups: AgendaGroup[] =
    agendaGroups.length > 0
      ? agendaGroups
      : [{ date: "", label: "Session 1", rows: [] }];

  useEffect(() => {
    setShareUrl(window.location.href);
  }, []);

  useEffect(() => {
    seedBreadcrumbTitle(session.courseHref, "Course");
  }, [session.courseHref]);

  const handleRegister = useCallback(() => {
    setActiveTab("registration");
    scrollToSection("session-registration");
  }, []);

  const calendarEvent: CalendarEvent | null =
    session.event && hasValidEventDate(session.event)
      ? { ...session.event, url: shareUrl || undefined }
      : null;

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
      let current: EngineeringTrainingSessionTabId = tabs[0].id;

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
              <p
                className="support_service_training_session_detail__category"
                data-slugkey="_fetchedRel8.curriculum.product_category"
              >
                {session.category}
              </p>
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
              {engineeringTrainingSessionShareLinks.map((link) => {
                const href = shareUrl
                  ? buildShareHref(link.id, shareUrl, session.title)
                  : link.href;
                return (
                  <li key={link.id}>
                    <a
                      href={href}
                      className="support_service_training_session_detail__share-link"
                      aria-label={link.label}
                      {...(link.external
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                      {...(link.id === "x"
                        ? {
                            onClick: (event: React.MouseEvent<HTMLAnchorElement>) => {
                              event.preventDefault();
                              window.open(
                                href,
                                "",
                                "menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=500",
                              );
                            },
                          }
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
                );
              })}
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
              {agendaRenderGroups.map((group) => (
                <Fragment key={group.date || group.label}>
                  <div className="support_service_training_session_detail__block-head">
                    <h2 className="support_service_training_session_detail__block-tit">
                      {showAgendaSessions ? `Agenda / ${group.label}` : "Agenda"}
                    </h2>
                    {/*pub 임시날짜 */}
                    <p className="support_service_training_session_detail__block-date">
                      Jul 15,2026
                    </p>
                  </div>
                  <TrainingSessionDetailTableScroll>
                    <table className="support_service_training_session_detail__table">
                      <thead>
                        <tr>
                          <th scope="col">No</th>
                          <th scope="col">Time</th>
                          <th scope="col">Contents</th>
                          {session.showTrainerColumn ? (
                            <th scope="col">Trainer</th>
                          ) : null}
                        </tr>
                      </thead>
                      <tbody data-slug="training_schedule" data-slug-repeat="true">
                        {group.rows.map((row) => (
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
                  <ol className="support_service_training_session_detail__agenda-list">
                    {group.rows.map((row) => (
                      <li
                        key={row.id}
                        className="support_service_training_session_detail__agenda-item"
                      >
                        <span
                          className="support_service_training_session_detail__agenda-dot"
                          aria-hidden="true"
                        />
                        <div className="support_service_training_session_detail__agenda-body">
                          <p className="support_service_training_session_detail__agenda-time">
                            {row.time}
                          </p>
                          <div className="support_service_training_session_detail__agenda-copy">
                            <div className="support_service_training_session_detail__agenda-main">
                              <p className="support_service_training_session_detail__agenda-tit">
                                {row.title}
                              </p>
                              {row.description ? (
                                <p className="support_service_training_session_detail__agenda-desc">
                                  {row.description}
                                </p>
                              ) : null}
                            </div>
                            {row.trainer ? (
                              <p className="support_service_training_session_detail__agenda-trainer">
                                Trainer : {row.trainer}
                              </p>
                            ) : null}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ol>
                </Fragment>
              ))}
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
