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
  /** Section guide preview — in-flow, no fixed overlay / auto-open */
  embedded?: boolean;
};

// BE 응답: GET /api/v1/fo/popup
// - 활성 팝업 있음: { exists: true,  url: "https://...", imageFileId: 496 }
// - 없음:          { exists: false, url: null,          imageFileId: null }
type PopupData = {
  exists: boolean;
  url: string | null;
  imageFileId: number | null;
};

// 파일ID → 업로드 미디어 스트리밍 엔드포인트(기존 FO page-files 프록시 패턴 재사용)
const PAGE_FILE_SRC = (fileId: number) => `/api/v1/fo/page-files/${fileId}`;

const emptySubscribe = () => () => undefined;

// "Don't show again today" 판정용 오늘 날짜 문자열 "YYYY-MM-DD"(브라우저 로컬 시간 기준).
// siteTime.ts(사이트 타임존=뉴욕)와는 개념이 다르므로 new Date()의 로컬 접근자로 직접 조립.
const localTodayString = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

/** Figma 8086:102342 — Main image popup */
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
  // 자동 오픈은 API 조회 결과(exists:true)에 따라 결정 → 초기값 false
  const [autoOpen, setAutoOpen] = useState(false);
  const [hideToday, setHideToday] = useState(false);
  const [popupData, setPopupData] = useState<PopupData | null>(null);

  // 활성 팝업 조회 → 있으면(exists:true) 데이터 저장 후 자동 오픈.
  // exists:false 또는 호출 실패 시 팝업을 열지 않는다(정상 흐름).
  // 제어(open prop) / embedded(가이드 프리뷰) 모드에서는 자동 오픈 로직 미적용.
  useEffect(() => {
    if (isControlled || embedded) return;
    let cancelled = false;
    fetchApi<PopupData>("/api/v1/fo/popup")
      .then((data) => {
        if (cancelled) return;
        if (!data.exists) return;
        // "Don't show again today" — 오늘 이미 닫았으면(저장 날짜 == 오늘) 자동 오픈하지 않음.
        // 읽기 실패(quota/시크릿모드)는 조용히 무시하고 기본 동작(정상 오픈)으로 폴백.
        try {
          const hiddenDate = window.localStorage.getItem(
            MAIN_POPUP_HIDE_STORAGE_KEY,
          );
          if (hiddenDate === localTodayString()) return;
        } catch {
          /* ignore quota / private mode → 정상 오픈으로 폴백 */
        }
        setPopupData(data);
        setAutoOpen(true);
      })
      .catch(() => {
        // 호출 실패 → 팝업 미오픈
      });
    return () => {
      cancelled = true;
    };
  }, [isControlled, embedded]);

  const open = isControlled ? Boolean(openProp) : autoOpen;

  const handleClose = useCallback(() => {
    // "Don't show again today" 체크 시 오늘 날짜 문자열을 저장(모든 닫기 경로가 이 함수를 경유).
    if (hideToday) {
      try {
        window.localStorage.setItem(
          MAIN_POPUP_HIDE_STORAGE_KEY,
          localTodayString(),
        );
      } catch {
        /* ignore quota / private mode */
      }
    }
    if (!isControlled) {
      setAutoOpen(false);
    }
    onClose?.();
  }, [hideToday, isControlled, onClose]);

  useModalFocusTrap(panelRef, open && !embedded);
  // Escape 키 닫기 + body 스크롤 잠금은 기존 공통 훅 재사용(인라인 useEffect 대체)
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
          {/* popup.image = imageFileId → FE에서 /api/v1/fo/page-files/{id} 프록시 변환(기존 page-files 패턴 재사용) */}
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
