"use client";

import { useEffect, useId, useRef } from "react";
import {
  contactUsViewResponseDetailSample,
  contactUsViewResponseModal,
} from "@/data/support/contactUsContent";
import { useModalFocusTrap } from "@/lib/useModalFocusTrap";
import type { ContactUsDetailResponse } from "../data/contactUsData";

// CTP가 내려주는 날짜 raw 문자열을 "yyyy-MM-dd HH:mm"로 통일 표시(포맷이 케이스마다 다름 확인됨).
// 인식 안 되는 형식은 원본 그대로 반환(데이터 유실 방지).
function formatCtpDate(value: string | null | undefined): string {
  if (!value) return "";
  const withTime = value.match(/^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})/);
  if (withTime) {
    const [, y, m, d, hh, mm] = withTime;
    return `${y}-${m}-${d} ${hh}:${mm}`;
  }
  const dateOnly = value.match(/^(\d{4})(\d{2})(\d{2})$/);
  if (dateOnly) {
    const [, y, m, d] = dateOnly;
    return `${y}-${m}-${d}`;
  }
  return value;
}

type ContactUsViewResponseDetailModalProps = {
  open: boolean;
  onClose: () => void;
  variant: "answered" | "pending";
  embedded?: boolean;
  /** 실제 CTP 조회 결과 — 있으면 하드코딩 샘플(contactUsViewResponseDetailSample) 대신 이 데이터를 사용 */
  detail?: ContactUsDetailResponse;
};

export default function ContactUsViewResponseDetailModal({
  open,
  onClose,
  variant,
  embedded = false,
  detail,
}: ContactUsViewResponseDetailModalProps) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const sample = detail
    ? {
        inquiryType: detail.type,
        submittedAt: formatCtpDate(detail.inquiryDate),
        respondedAt: formatCtpDate(detail.replyDate),
        productTrail: [
          "Inquiry products",
          ...(detail.productCategory ? detail.productCategory.split(" | ") : []),
        ],
        inquiryBody: detail.description ? detail.description.split("\n") : [],
        responseBody: detail.reply ? detail.reply.split("\n") : [],
        pendingTitle: contactUsViewResponseDetailSample.pendingTitle,
        pendingDescription: contactUsViewResponseDetailSample.pendingDescription,
      }
    : contactUsViewResponseDetailSample;

  useModalFocusTrap(panelRef, open && !embedded);

  useEffect(() => {
    if (!open || embedded) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [embedded, open, onClose]);

  if (!open) return null;

  // 실데이터(detail)일 때 pending은 아직 응답일시가 없으므로 표시하지 않는다
  // (샘플 데모는 기존 표시를 그대로 유지)
  const showResponseDate = !(detail && variant === "pending");
  const responseDate =
    variant === "answered" ? sample.respondedAt : sample.submittedAt;
  const responseDateTime = detail
    ? responseDate
    : variant === "answered"
      ? "2026-06-22T11:23"
      : "2026-06-19T16:25";

  const productTrail = (
    <nav
      className="support_contact_view_response_detail_modal__trail"
      aria-label="Inquiry products"
    >
      <span>{sample.productTrail[0]}</span>
      <span className="support_contact_view_response_detail_modal__trail-sep" aria-hidden>
        |
      </span>
      {sample.productTrail.slice(1).map((item, index) => (
        <span
          key={`${item}-${index}`}
          className="support_contact_view_response_detail_modal__trail-item"
        >
          {index > 0 ? (
            <span
              className="support_contact_view_response_detail_modal__trail-chevron"
              aria-hidden
            >
              &gt;
            </span>
          ) : null}
          <span>{item}</span>
        </span>
      ))}
    </nav>
  );

  return (
    <div
      className={
        embedded
          ? "common_modal common_modal--embedded support_contact_view_response_detail_modal"
          : "common_modal support_contact_view_response_detail_modal"
      }
    >
      {!embedded ? (
        <button
          type="button"
          className="common_modal__dim"
          aria-label="Close dialog"
          onClick={onClose}
        />
      ) : null}
      <div
        ref={panelRef}
        className="common_modal__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <header className="common_modal__head">
          <div className="common_modal__head-row">
            <h2 id={titleId} className="common_modal__tit">
              {contactUsViewResponseModal.title}
            </h2>
            <button
              type="button"
              className="common_modal__close"
              aria-label="Close"
              onClick={onClose}
            />
          </div>
          <hr className="common_modal__line" />
        </header>
        <div className="common_modal__body">
          <section className="support_contact_view_response_detail_modal__inquiry">
            <p className="support_contact_view_response_detail_modal__type">
              {sample.inquiryType}
            </p>
            <div className="support_contact_view_response_detail_modal__section-head">
              <div className="support_contact_view_response_detail_modal__section-head-main">
                <span className="support_contact_view_response_detail_modal__badge">Q</span>
                <h3 className="support_contact_view_response_detail_modal__section-tit">
                  Inquiry Details
                </h3>
              </div>
              <time
                className="support_contact_view_response_detail_modal__date"
                dateTime={detail ? sample.submittedAt : "2026-06-19T16:25"}
              >
                {sample.submittedAt}
              </time>
            </div>
            {productTrail}
            <div className="support_contact_view_response_detail_modal__text">
              {sample.inquiryBody.map((line, index) => (
                <p key={`${line}-${index}`}>{line}</p>
              ))}
            </div>
          </section>
          <hr className="support_contact_view_response_detail_modal__divider" />
          <section
            className={`support_contact_view_response_detail_modal__response${
              variant === "pending"
                ? " support_contact_view_response_detail_modal__response--pending"
                : ""
            }`}
          >
            <div className="support_contact_view_response_detail_modal__section-head">
              <div className="support_contact_view_response_detail_modal__section-head-main">
                <span className="support_contact_view_response_detail_modal__badge">A</span>
                <h3 className="support_contact_view_response_detail_modal__section-tit">
                  Response Details
                </h3>
              </div>
              {showResponseDate ? (
                <time
                  className="support_contact_view_response_detail_modal__date"
                  dateTime={responseDateTime}
                >
                  {responseDate}
                </time>
              ) : null}
            </div>
            {variant === "answered" ? (
              <>
                {productTrail}
                <div className="support_contact_view_response_detail_modal__text">
                  {sample.responseBody.map((line, index) =>
                    line ? (
                      <p key={`${line}-${index}`}>{line}</p>
                    ) : (
                      <p key={`spacer-${index}`} aria-hidden>&nbsp;</p>
                    ),
                  )}
                </div>
              </>
            ) : (
              <div className="support_contact_view_response_detail_modal__pending">
                <p className="support_contact_view_response_detail_modal__pending-tit">
                  {sample.pendingTitle}
                </p>
                <p className="support_contact_view_response_detail_modal__pending-desc">
                  {sample.pendingDescription}
                </p>
              </div>
            )}
          </section>
        </div>
        <footer className="common_modal__foot">
          <button
            type="button"
            className="btn-base btn-lv01 btn-lv01--solid support_contact_view_response_detail_modal__confirm"
            onClick={onClose}
          >
            {contactUsViewResponseModal.confirmLabel}
          </button>
        </footer>
      </div>
    </div>
  );
}
