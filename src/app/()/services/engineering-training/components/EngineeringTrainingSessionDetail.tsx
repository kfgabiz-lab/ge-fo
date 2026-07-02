"use client";

import { useCallback, useEffect, useState } from "react";
import type { EngineeringTrainingSessionDetail } from "@/data/services/engineeringTrainingSessionDetailContent";
import {
  engineeringTrainingSessionAssets,
  engineeringTrainingSessionShareLinks,
  engineeringTrainingSessionTabs,
  type EngineeringTrainingSessionTabId,
} from "@/data/services/engineeringTrainingSessionDetailContent";
import EngineeringTrainingSessionCountdown from "./EngineeringTrainingSessionCountdown";
import EngineeringTrainingSessionDetailForm from "./EngineeringTrainingSessionDetailForm";
import { getLenisInstance } from "@/lib/lenisScroll";

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

function SessionMetaLabel({
  icon,
  iconMuted = false,
  children,
}: {
  icon: string;
  iconMuted?: boolean;
  children: string;
}) {
  return (
    <p className="support_service_training_session_detail__meta-label">
      <span
        className={`support_service_training_session_detail__meta-icon${
          iconMuted ? " support_service_training_session_detail__meta-icon--muted" : ""
        }`}
        aria-hidden
      >
        <img src={icon} alt="" width={18} height={18} loading="lazy" decoding="async" />
      </span>
      {children}
    </p>
  );
}

export default function EngineeringTrainingSessionDetail({
  session,
}: {
  session: EngineeringTrainingSessionDetail;
}) {
  const [activeTab, setActiveTab] = useState<EngineeringTrainingSessionTabId>("training");
  const { sidebar } = session;
  const { metaIcons } = engineeringTrainingSessionAssets;

  const handleRegister = useCallback(() => {
    setActiveTab("registration");
    scrollToSection("session-registration");
  }, []);

  useEffect(() => {
    const sectionIds = engineeringTrainingSessionTabs.map((tab) => `session-${tab.id}`);

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
          <div className="support_service_training_session_detail__title-wrap">
            <p className="support_service_training_session_detail__category">
              {session.category}
            </p>
            <div className="support_service_training_session_detail__title-row">
              <h1 className="support_service_training_session_detail__title">
                {session.title}
              </h1>
              <ul
                className="support_service_training_session_detail__share"
                aria-label="Share"
              >
                {engineeringTrainingSessionShareLinks.map((link) => (
                  <li key={link.id}>
                    <a
                      href={link.href}
                      className="support_service_training_session_detail__share-link"
                      aria-label={link.label}
                      {...(link.external
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                    >
                      <img src={link.icon} alt="" width={20} height={20} loading="lazy" decoding="async" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <hr className="support_service_training_session_detail__divider" />
        </header>

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
                      <span className="support_service_training_session_detail__tab-dot" aria-hidden />
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
              <div className="support_service_training_session_detail__table-wrap">
                <table className="support_service_training_session_detail__table">
                  <thead>
                    <tr>
                      <th scope="col">No</th>
                      <th scope="col">Time</th>
                      <th scope="col">Contents</th>
                      <th scope="col">Trainer</th>
                    </tr>
                  </thead>
                  <tbody>
                    {session.agenda.map((row) => (
                      <tr key={row.id}>
                        <td>{row.number}</td>
                        <td>{row.time}</td>
                        <td>
                          <p className="support_service_training_session_detail__table-tit">
                            {row.title}
                          </p>
                          {row.description ? (
                            <p className="support_service_training_session_detail__table-desc">
                              {row.description}
                            </p>
                          ) : null}
                        </td>
                        <td>{row.trainer ?? ""}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div
              id="session-registration"
              className="support_service_training_session_detail__block support_service_training_session_detail__block--registration"
            >
              <h2 className="support_service_training_session_detail__block-tit">
                Registration form
              </h2>
              <EngineeringTrainingSessionDetailForm session={session} />
            </div>

            <div className="support_service_training_session_detail__block support_service_training_session_detail__block--calendar">
              <h2 className="support_service_training_session_detail__block-tit">
                Add to Calendar
              </h2>
              <div className="support_service_training_session_detail__calendar-actions">
                <button
                  type="button"
                  className="btn-base btn-lv01 btn-lv01--line support_service_training_session_detail__calendar-btn"
                >
                  <img
                    src={engineeringTrainingSessionAssets.calendarIcons.google}
                    alt=""
                    width={18}
                    height={18}
                    loading="lazy"
                    decoding="async"
                    aria-hidden
                  />
                  {session.calendar.googleLabel}
                </button>
                <button
                  type="button"
                  className="btn-base btn-lv01 btn-lv01--line support_service_training_session_detail__calendar-btn"
                >
                  <span>{session.calendar.icalLabel}</span>
                  <img
                    src={engineeringTrainingSessionAssets.calendarIcons.ical}
                    alt=""
                    width={18}
                    height={18}
                    loading="lazy"
                    decoding="async"
                    aria-hidden
                  />
                </button>
              </div>
            </div>
          </div>

          <aside className="support_service_training_session_detail__aside">
            <EngineeringTrainingSessionCountdown />

            <div className="support_service_training_session_detail__meta">
              <div className="support_service_training_session_detail__meta-item">
                <SessionMetaLabel icon={metaIcons.date} iconMuted>
                  DATE
                </SessionMetaLabel>
                <p className="support_service_training_session_detail__meta-value">
                  {sidebar.date}
                </p>
              </div>

              <div className="support_service_training_session_detail__meta-item">
                <SessionMetaLabel icon={metaIcons.duration} iconMuted>
                  DURATION
                </SessionMetaLabel>
                <p className="support_service_training_session_detail__meta-value">
                  {sidebar.duration}
                </p>
              </div>

              <div className="support_service_training_session_detail__meta-item">
                <SessionMetaLabel icon={metaIcons.classSize}>CLASS SIZE</SessionMetaLabel>
                <p className="support_service_training_session_detail__meta-value">
                  {sidebar.classSize}
                </p>
              </div>

              <div className="support_service_training_session_detail__meta-item">
                <SessionMetaLabel icon={metaIcons.location}>
                  LOCATION INFORMATION
                </SessionMetaLabel>
                <p className="support_service_training_session_detail__meta-value">
                  {sidebar.location.name}
                </p>
                <ul className="support_service_training_session_detail__meta-bullets">
                  <li>{sidebar.location.address}</li>
                  <li>{sidebar.location.phone}</li>
                  <li>{sidebar.location.email}</li>
                </ul>
              </div>

              <div className="support_service_training_session_detail__meta-item">
                <SessionMetaLabel icon={metaIcons.products} iconMuted>
                  PRODUCTS COVERED
                </SessionMetaLabel>
                <p className="support_service_training_session_detail__meta-text">
                  {sidebar.productsCovered}
                </p>
              </div>
            </div>

            <button
              type="button"
              className="btn-base btn-lv01 btn-lv01--solid support_service_training_session_detail__register"
              onClick={handleRegister}
            >
              {sidebar.registerLabel}
            </button>
          </aside>
        </div>
      </div>
    </section>
  );
}
