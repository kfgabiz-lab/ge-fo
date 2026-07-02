"use client";

import type Lenis from "lenis";
import { ReactLenis, useLenis } from "lenis/react";
import { useLayoutEffect, useMemo, useRef } from "react";
import { createLenisOptions } from "@/lib/lenisOptions";
import { setLenisInstance } from "@/lib/lenisScroll";
import "lenis/dist/lenis.css";

function LenisInstanceBridge({
  lenisRef,
}: {
  lenisRef: React.MutableRefObject<Lenis | null>;
}) {
  const lenis = useLenis();

  lenisRef.current = lenis ?? null;

  useLayoutEffect(() => {
    setLenisInstance(lenis ?? null);
    return () => setLenisInstance(null);
  }, [lenis]);

  return null;
}

export default function LenisScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const lenisRef = useRef<Lenis | null>(null);
  const options = useMemo(
    () => createLenisOptions(() => lenisRef.current),
    [],
  );

  return (
    <ReactLenis root options={options}>
      <LenisInstanceBridge lenisRef={lenisRef} />
      {children}
    </ReactLenis>
  );
}
