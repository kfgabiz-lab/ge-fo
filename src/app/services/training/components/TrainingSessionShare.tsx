"use client";

import { ClickAwayListener } from "@mui/material";
import { useCallback, useEffect, useId, useState } from "react";
import { engineeringTrainingSessionShareLinks } from "@/data/services/engineeringTrainingSessionDetailContent";
import { buildShareHref } from "@/lib/eventShare";

type TrainingSessionShareProps = {
  shareUrl: string;
  title: string;
};

export default function TrainingSessionShare({
  shareUrl,
  title,
}: TrainingSessionShareProps) {
  const [open, setOpen] = useState(false);
  const popoverId = useId();

  const close = useCallback(() => {
    setOpen(false);
  }, []);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        close();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [close, open]);

  return (
    <div className="support_service_training_session_detail__share-wrap">
      <button
        type="button"
        className="support_service_training_session_detail__share-trigger"
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-controls={open ? popoverId : undefined}
        onClick={() => setOpen((current) => !current)}
      >
        <img
          src="/ico/ico_share_24.svg"
          alt=""
          width={24}
          height={24}
          loading="lazy"
          decoding="async"
        />
      </button>

      {open ? (
        <ClickAwayListener onClickAway={close}>
          <div
            id={popoverId}
            className="support_service_training_session_detail__share-popover"
            role="dialog"
            aria-label="Share"
          >
            <span
              className="support_service_training_session_detail__share-popover-arrow"
              aria-hidden
            />
            <div className="support_service_training_session_detail__share-popover-head">
              <p className="support_service_training_session_detail__share-popover-title">
                Share
              </p>
              <button
                type="button"
                className="support_service_training_session_detail__share-popover-close"
                aria-label="Close share menu"
                onClick={close}
              >
                <img
                  src="/ico/ico_share_popover_close_18.svg"
                  alt=""
                  width={18}
                  height={18}
                  loading="lazy"
                  decoding="async"
                />
              </button>
            </div>

            <ul
              className="support_service_training_session_detail__share"
              aria-label="Share options"
            >
              {engineeringTrainingSessionShareLinks.map((link) => {
                const href = shareUrl
                  ? buildShareHref(link.id, shareUrl, title)
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
                      onClick={(event) => {
                        if (link.id === "x") {
                          event.preventDefault();
                          close();
                          window.open(
                            href,
                            "",
                            "menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=500",
                          );
                          return;
                        }

                        close();
                      }}
                    >
                      <span className="support_service_training_session_detail__share-link-icon">
                        <img
                          src={link.popoverIcon}
                          alt=""
                          width={52}
                          height={52}
                          loading="lazy"
                          decoding="async"
                        />
                      </span>
                      <span className="support_service_training_session_detail__share-link-label">
                        {link.popoverLabel}
                      </span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </ClickAwayListener>
      ) : null}
    </div>
  );
}
