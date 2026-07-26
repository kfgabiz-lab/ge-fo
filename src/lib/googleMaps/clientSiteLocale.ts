// 브라우저(클라이언트 번들) 전용 사이트 로케일 캐시.
// siteTime.ts의 SITE_LOCALE은 서버 컴포넌트 실행 컨텍스트에서만 채워지므로(서버/클라이언트 번들 분리),
// 루트 레이아웃(서버)에서 조회한 값을 SiteLocaleSync(클라이언트) 컴포넌트가 이 모듈에 주입해준다.
// Google Maps 로더처럼 브라우저에서만 동작하는 코드가 locale 값을 읽을 때 사용한다.

let clientSiteLocale = "en-US";

export function setClientSiteLocale(locale: string): void {
  if (locale) clientSiteLocale = locale;
}

export function getClientSiteLocale(): string {
  return clientSiteLocale;
}
