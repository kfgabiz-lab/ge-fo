import { useEffect } from "react";

/**
 * 모달 공통 닫기 동작 훅.
 * active 동안 body 스크롤을 잠그고 Escape 키 입력 시 onClose를 호출한다.
 * fixed 오버레이 모달에서만 활성화하고, 섹션 가이드 프리뷰(embedded)에서는
 * active=false(= open && !embedded)로 전달해 in-flow 배치를 유지한다.
 */
export function useModalDismiss(active: boolean, onClose?: () => void) {
  useEffect(() => {
    if (!active) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose?.();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [active, onClose]);
}
