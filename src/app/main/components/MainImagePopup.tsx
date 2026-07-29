"use client";

import Checkbox from "@mui/material/Checkbox";
import Link from "next/link";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { createPortal } from "react-dom";
import {
  GuideCheckboxIcon,
  guideCheckboxIconsDefault,
} from "@/components/form/GuideFieldIcons";
import {
  mainImagePopupContent,
  MAIN_POPUP_HIDE_STORAGE_KEY,
} from "@/data/main/mainImagePopupContent";
import { fetchApi } from "@/lib/api";
import { useModalFocusTrap } from "@/lib/useModalFocusTrap";
import { useModalDismiss } from "@/lib/useModalDismiss";

type MainImagePopupProps = {
  open?: boolean;
  onClose?: () => void;
  embedded?: boolean;
};

type PopupData = {
  exists: boolean;
  url: string | null;
  imageFileId: number | null;
};

const PAGE_FILE_SRC = (fileId: number) => `/api/v1/fo/page-files/${fileId}`;

const emptySubscribe = () => () => undefined;

const localTodayString = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export default function MainImagePopup({
  open: openProp,
  onClose,
  embedded = false,
}: MainImagePopupProps) {
  const titleId = useId();
  const hideId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const canPortal = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
  const isControlled = openProp !== undefined;
  const [autoOpen, setAutoOpen] = useState(false);
  const [hideToday, setHideToday] = useState(false);
  const [popupData, setPopupData] = useState<PopupData | null>(null);

  useEffect(() => {
    if (isControlled || embedded) return;
    let cancelled = false;
    fetchApi<PopupData>("/api/v1/fo/popup")
      .then((data) => {
        if (cancelled) return;
        if (!data.exists) return;
        try {
          const hiddenDate = window.localStorage.getItem(
            MAIN_POPUP_HIDE_STORAGE_KEY,
          );
          if (hiddenDate === localTodayString()) return;
        } catch {
        }
        setPopupData(data);
        setAutoOpen(true);
      })
      .catch(() => {
      });
    return () => {
      cancelled = true;
    };
  }, [isControlled, embedded]);

  const open = isControlled ? Boolean(openProp) : autoOpen;

  const handleClose = useCallback(() => {
    if (hideToday) {
      try {
        window.localStorage.setItem(
          MAIN_POPUP_HIDE_STORAGE_KEY,
          localTodayString(),
        );
      } catch {
      }
    }
    if (!isControlled) {
      setAutoOpen(false);
    }
    onClose?.();
  }, [hideToday, isControlled, onClose]);

  useModalFocusTrap(panelRef, open && !embedded);
  useModalDismiss(open && !embedded, handleClose);

  if (!open) return null;

  const modalElement = (
    <div
      className={
        embedded
          ? "main_image_popup main_image_popup--embedded"
          : "main_image_popup"
      }
    >
      {!embedded ? <div className="main_image_popup__dim" aria-hidden /> : null}
      <div
        ref={panelRef}
        className="main_image_popup__panel"
        role="dialog"
        aria-modal={embedded ? undefined : true}
        aria-labelledby={titleId}
        data-slug="popup-data"
      >
        <h2 id={titleId} className="main_image_popup__title">
          {mainImagePopupContent.dialogLabel}
        </h2>
        <Link
          href={popupData?.url ?? "#"}
          className="main_image_popup__media"
          prefetch={false}
          onClick={handleClose}
          data-slugkey="popup.url"
          data-slugkey-attr="href"
        >
          <img
            src={
              popupData?.imageFileId != null
                ? PAGE_FILE_SRC(popupData.imageFileId)
                : ""
            }
            alt={mainImagePopupContent.imageAlt}
            width={400}
            height={560}
            decoding="async"
            data-slugkey="popup.image"
            data-slugkey-attr="src"
          />
        </Link>
        <div className="main_image_popup__bar">
          <label className="main_image_popup__hide" htmlFor={hideId}>
            <Checkbox
              id={hideId}
              className="guide_checkbox"
              checked={hideToday}
              disableRipple
              icon={<GuideCheckboxIcon {...guideCheckboxIconsDefault} />}
              checkedIcon={
                <GuideCheckboxIcon checked {...guideCheckboxIconsDefault} />
              }
              onChange={(_, checked) => setHideToday(checked)}
              inputProps={{
                "aria-label": mainImagePopupContent.hideTodayLabel,
              }}
            />
            <span className="main_image_popup__hide-label">
              {mainImagePopupContent.hideTodayLabel}
            </span>
          </label>
          <button
            type="button"
            className="main_image_popup__close"
            onClick={handleClose}
          >
            <span className="main_image_popup__close-label">
              {mainImagePopupContent.closeLabel}
            </span>
            <span className="main_image_popup__close-icon" aria-hidden>
              <img
                src="/ico/ico_clear_12_white.svg"
                alt=""
                width={12}
                height={12}
              />
            </span>
          </button>
        </div>
      </div>
    </div>
  );

  if (embedded || !canPortal) {
    return modalElement;
  }

  return createPortal(modalElement, document.body);
}
