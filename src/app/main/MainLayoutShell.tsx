"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

// 쿠키 설정은 모달 전용(풀스크린) 화면이므로 GNB 헤더/푸터를 숨긴다
const MODAL_ONLY_PATHS = new Set([
  "/main/cookie-setting",
  "/main/cookie-setting/preferences",
]);

type MainLayoutShellProps = {
  // 서버 컴포넌트(layout.tsx)에서 gnbMenuData를 주입해 렌더한 헤더/푸터를 전달받는다
  header: ReactNode;
  footer: ReactNode;
  children: ReactNode;
};

export default function MainLayoutShell({
  header,
  footer,
  children,
}: MainLayoutShellProps) {
  const pathname = usePathname();

  // 쿠키 설정 경로에서는 헤더/푸터 없이 모달만 노출
  if (MODAL_ONLY_PATHS.has(pathname)) {
    return <>{children}</>;
  }

  return (
    <>
      {header}
      {children}
      {footer}
    </>
  );
}
