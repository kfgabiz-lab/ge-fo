"use client";

import { setClientSiteLocale } from "@/lib/googleMaps/clientSiteLocale";

// 루트 레이아웃(서버)에서 조회한 사이트 로케일 값을 클라이언트 전용 캐시(clientSiteLocale)에 주입한다.
// Google Maps 로더처럼 브라우저에서만 동작하는 코드가 이 값을 읽는다. 마운트 시 1회 실행이면 충분해
// useEffect 없이 렌더 중 직접 호출한다(부수효과가 멱등하고, 클라이언트 컴포넌트라 매 렌더 실행돼도 안전).
export default function SiteLocaleSync({ locale }: { locale: string }) {
  setClientSiteLocale(locale);
  return null;
}
