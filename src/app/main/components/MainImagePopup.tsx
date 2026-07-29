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
  id: number;
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

const hideStorageKey = (id: number) => `${MAIN_POPUP_HIDE_STORAGE_KEY}:${id}`;

const isHiddenToday = (id: number) => {
  try {
    return (
      window.localStorage.getItem(hideStorageKey(id)) === localTodayString()
    );
  } catch {
    return false;
  }
};

function SinglePopup({
  data,
  embedded,
  hideToday,
  onHideTodayChange,
  onClose,
}: {
  data: PopupData;
  embedded: boolean;
  hideToday: boolean;
  onHideTodayChange: (checked: boolean) => void;
  onClose: () => void;
}) {
  const titleId = useId();
  const hideId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const canPortal = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  useModalFocusTrap(panelRef, !embedded);
  useModalDismiss(!embedded, onClose);

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
          href={data.url ?? "#"}
          className="main_image_popup__media"
          prefetch={false}
          onClick={onClose}
          data-slugkey="popup.url"
          data-slugkey-attr="href"
        >
          <img
            src={
              data.imageFileId != null ? PAGE_FILE_SRC(data.imageFileId) : ""
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
              onChange={(_, checked) => onHideTodayChange(checked)}
              inputProps={{
                "aria-label": mainImagePopupContent.hideTodayLabel,
              }}
            />
            <span className="main_image_popup__hide-label">
              {mainImagePopupContent.hideTodayLabel}
            </span>
          </label>
          <button type="button" className="main_image_popup__close" onClick={onClose}>
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

export default function MainImagePopup({
  open: openProp,
  onClose,
  embedded = false,
}: MainImagePopupProps) {
  const isControlled = openProp !== undefined;
  const [popups, setPopups] = useState<PopupData[]>([]);
  const [closedIds, setClosedIds] = useState<Set<number>>(new Set());
  const [hideTodayIds, setHideTodayIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (isControlled || embedded) return;
    let cancelled = false;
    fetchApi<PopupData[]>("/api/v1/fo/popup")
      .then((data) => {
        if (cancelled) return;
        setPopups(data.filter((popup) => !isHiddenToday(popup.id)));
      })
      .catch(() => {
      });
    return () => {
      cancelled = true;
    };
  }, [isControlled, embedded]);

  const visiblePopups = popups.filter((popup) => !closedIds.has(popup.id));

  const handleClose = useCallback(
    (id: number) => {
      if (hideTodayIds.has(id)) {
        try {
          window.localStorage.setItem(hideStorageKey(id), localTodayString());
        } catch {
        }
      }
      if (!isControlled) {
        setClosedIds((prev) => {
          const next = new Set(prev);
          next.add(id);
          return next;
        });
      }
      onClose?.();
    },
    [hideTodayIds, isControlled, onClose],
  );

  if (isControlled && !openProp) return null;
  if (visiblePopups.length === 0) return null;

  return (
    <>
      {visiblePopups.map((popup) => (
        <SinglePopup
          key={popup.id}
          data={popup}
          embedded={embedded}
          hideToday={hideTodayIds.has(popup.id)}
          onHideTodayChange={(checked) =>
            setHideTodayIds((prev) => {
              const next = new Set(prev);
              if (checked) next.add(popup.id);
              else next.delete(popup.id);
              return next;
            })
          }
          onClose={() => handleClose(popup.id)}
        />
      ))}
    </>
  );
}
