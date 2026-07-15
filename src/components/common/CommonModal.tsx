"use client";

import { useRef, type ReactNode } from "react";
import { useModalFocusTrap } from "@/lib/useModalFocusTrap";
import { useModalDismiss } from "@/lib/useModalDismiss";

type CommonModalProps = {
  open: boolean;
  onClose?: () => void;
  /** 섹션 가이드 프리뷰 — fixed 오버레이 없이 in-flow 배치 */
  embedded?: boolean;
  /** aria-labelledby 연결용 id (caller의 useId 값) */
  titleId: string;
  title: ReactNode;
  /** 루트 식별 클래스 (예: privacy_policy_modal / cookie_preferences_modal) */
  className?: string;
  /** dim(배경) 버튼 aria-label */
  dimLabel?: string;
  /** common_modal__foot에 추가할 클래스 */
  footerClassName?: string;
  /** 푸터 버튼 영역 (없으면 푸터 미출력) */
  footer?: ReactNode;
  /** 모달 본문 (common_modal__body 내부 콘텐츠) */
  children: ReactNode;
};

/**
 * common_modal 마크업 뼈대(오버레이 + dim + 패널 + 헤더/본문/푸터)와
 * 포커스 트랩·ESC/스크롤잠금 동작을 공통 제공하는 셸 컴포넌트.
 * 제목/본문/푸터 등 콘텐츠는 props와 children으로 주입한다.
 */
export default function CommonModal({
  open,
  onClose,
  embedded = false,
  titleId,
  title,
  className,
  dimLabel = "Close dialog",
  footerClassName,
  footer,
  children,
}: CommonModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const active = open && !embedded;

  useModalFocusTrap(panelRef, active);
  useModalDismiss(active, onClose);

  if (!open) return null;

  const rootClassName = ["common_modal", embedded && "common_modal--embedded", className]
    .filter(Boolean)
    .join(" ");
  const footClassName = ["common_modal__foot", footerClassName]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={rootClassName}>
      {!embedded ? (
        <button
          type="button"
          className="common_modal__dim"
          aria-label={dimLabel}
          onClick={() => onClose?.()}
        />
      ) : null}
      <div
        ref={panelRef}
        className="common_modal__panel"
        role="dialog"
        aria-modal={!embedded}
        aria-labelledby={titleId}
      >
        <header className="common_modal__head">
          <div className="common_modal__head-row">
            <h2 id={titleId} className="common_modal__tit">
              {title}
            </h2>
            <button
              type="button"
              className="common_modal__close"
              aria-label="Close"
              onClick={() => onClose?.()}
            />
          </div>
          <hr className="common_modal__line" />
        </header>
        <div className="common_modal__body">{children}</div>
        {footer ? <footer className={footClassName}>{footer}</footer> : null}
      </div>
    </div>
  );
}
