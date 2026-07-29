"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

const MODAL_ONLY_PATHS = new Set([
  "/main/cookie-setting",
  "/main/cookie-setting/preferences",
]);

type MainLayoutShellProps = {
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
