# GE-FO 프로젝트 구조

> Next.js(App Router) 기반 FO(Front Office) 프로젝트 — 포트 3002
> **본 문서는 fo/src 하위에 실제로 존재하는 파일·구조만 기준으로 작성됨** (2026-07-15 기준, Glob/Read로 직접 확인해 전면 갱신 — pull로 반영된 motor-control/where-to-buy/warranty-policy 포함)
> `ge-fo`(https://github.com/kfgabiz-lab/ge-fo) 전체 반영본 기준의 대규모 구조는 현재 코드에 없음 — 지금은 main / markets(6개) / company / services(service-center, warranty-policy) / support(connect-portal, contact-us, where-to-buy) / products-systems(motor-control)까지 마이그레이션된 상태
> 전체 tsx 파일별 목록·data slug 매핑은 [`fo-data-binding.md`](./fo-data-binding.md) 참고

---

## 1. 라우트 구조 개요

현재 `src/app` 하위에 실제로 존재하는 라우트는 아래와 같습니다.

```
src/app/
├── layout.tsx                  # [Root Layout] 전역 CSS·메타데이터 마운트
│                                # ※ src/app/page.tsx(루트 페이지)는 존재하지 않음
│
├── main/                       # 홈(메인)
│   ├── layout.tsx               # MainHeader + {children} + MainFooter
│   ├── page.tsx                 # 메인 페이지 — 섹션 컴포넌트 조립
│   ├── components/              # 메인 페이지 전용 섹션 9개 + 데이터 (VideoSwiper/BannerSwiper는 MainVisual 내부에 캡슐화)
│   │   ├── MainVisual.tsx(+mainVisualData.ts, 내부에서 VideoSwiper+BannerSwiper 조립), MainInfo.tsx, WhatWeDoSwiper.tsx
│   │   ├── MainCards.tsx
│   │   ├── MainProducts.tsx, MainProductsClient.tsx(+mainProductsData.ts)
│   │   └── IconCards.tsx
│   └── data/                    # ⚠ 존재하지만 파일 0개(빈 디렉토리) — main 데이터는 실제로 components/ 하위에 colocate됨
│
├── markets/                    # 산업분야별 솔루션 (route group 괄호 없음) — 6개 페이지
│   ├── layout.tsx               # SubHeader + {children} + SubFooter
│   ├── page.tsx                  # markets 인덱스(허브) 페이지
│   ├── components/              # markets 공용 섹션 컴포넌트 13개
│   │   ├── MarketsHero.tsx (variant: "default" | "key-visual"), MarketsHeroScrollDown.tsx
│   │   ├── MarketsIntro.tsx, MarketsExplore.tsx, MarketsStats.tsx
│   │   ├── MarketsReferences.tsx, MarketsReferencesModal.tsx
│   │   ├── MarketsBenefits.tsx, MarketsSolutions.tsx, MarketsSolutionsPanel.tsx
│   │   ├── MarketsSustainability.tsx, MarketsSmartGrid.tsx, MarketsSmartGridDiagram.tsx
│   │   └── MarketsWhy.tsx, MarketsProducts.tsx, MarketsFaq.tsx
│   ├── data/                    # route 전용 정적 데이터 — 페이지별 Content/Solutions(Panel) 분리
│   ├── lib/scrollToMarketsHeroNextSection.ts
│   ├── data-center/page.tsx, power-grid/page.tsx, oil-gas-mining/page.tsx
│   └── public-infrastructure/page.tsx, industrial/page.tsx, commercial-residential/page.tsx
│
├── company/                    # 회사소개·미디어(press/blog/articles/events 등)
│   ├── layout.tsx                # SubHeader + {children} + SubFooter (markets와 동일 컴포넌트 재사용)
│   ├── components/               # CompanyXxxPage 조립 컴포넌트 + Feed(press/blog 공용 리스트) 컴포넌트 22개
│   ├── data/                     # 페이지별 Content/List/Detail 데이터 24개 + fetchPressList/fetchBlogList/fetchArticlesList/fetchEventsList
│   ├── press/page.tsx, press/detail/[id]/page.tsx
│   ├── blog/page.tsx, blog/detail/page.tsx, blog/detail/[id]/page.tsx
│   ├── articles/page.tsx, articles/detail/page.tsx, articles/detail/[id]/page.tsx
│   ├── events/page.tsx, events/detail/[id]/page.tsx
│   ├── esg/page.tsx, ls-electric/page.tsx, ls-electric-america/page.tsx, affiliate-in-america/page.tsx
│   # ⚠ blog/detail/page.tsx·articles/detail/page.tsx: [id] 없는 정적 목업(하드코딩 데이터)이 [id]/page.tsx(실 API 연동)와 동시 존재.
│   #    라우팅 충돌은 없으나(각기 다른 URL) 목업 페이지 정리 대상인지 원 담당자 확인 필요
│
├── services/                   # 서비스 — 2개 메뉴
│   ├── layout.tsx                # SubHeader + {children} + SubFooter
│   ├── service-center/page.tsx + components/(Banner/Cards/Flow/Gics/Offering/Title 6개)
│   └── warranty-policy/page.tsx + components/(FeatureCards/Apply/Banner/Coverage/Extension/Title 6개) + data/warrantyPolicyData.ts
│
├── support/                     # 고객지원 — 3개 메뉴
│   ├── layout.tsx                # SubHeader + {children} + SubFooter
│   ├── components/SupportPageTitle.tsx   # support 하위 페이지 공용 타이틀
│   ├── connect-portal/page.tsx + components/(Detail/Features/Title/Video 4개)
│   ├── contact-us/page.tsx + components/(Title/Form/TermsModal/ModalsHubPage/ViewResponseModal/ViewResponseDetailModal 6개) + terms-modal/page.tsx
│   └── where-to-buy/page.tsx + no-data/page.tsx + components/(Banner/Contents/Controls/Empty/LocationCard/Map/MapPlaceholder/MapPopup/Search/Title/ViewToggle 11개)
│       # Google Maps JS API 사용(9절 참고) — 검색/지도·리스트 뷰 전환
│
└── ()/products-systems/                # route group(괄호) — 제품카테고리 1depth
    ├── components/(DevicesHelp/DevicesHero/DevicesMarkets/DevicesProducts 4개)
    ├── data/(motorControlContent.ts, productDetailContent.ts — 후자는 대응 page.tsx 아직 없음)
    └── motor-control/page.tsx        # 1개 카테고리만 구현, 나머지 제품카테고리는 미이관
```

`company`/`services`/`support`/`markets` 4개 라우트 그룹 모두 레이아웃이 **완전히 동일**합니다(`SubHeader` + `{children}` + `SubFooter`, `fetchGnbMenuData()` 호출 포함, 바이트 단위로 동일). `products-systems`는 route group `()`이라 별도 layout.tsx 없이 `app/layout.tsx`만 적용됩니다. 즉 `components/layout/markets/{SubHeader,SubFooter}`는 폴더명과 달리 markets 전용이 아니라 **main·products-systems을 제외한 모든 서브 페이지의 공용 레이아웃 컴포넌트**입니다.

---

## 2. 레이아웃 영역 구조

### main
```
┌─────────────────────────────────────────────┐
│  app/layout.tsx (Root Layout)                │
│  └─ <html>, <body> 전체 감싸기, 전역 CSS       │
│                                               │
│  ┌─────────────────────────────────────────┐ │
│  │ app/main/layout.tsx                     │ │
│  │  ┌───────────────────────────────────┐  │ │
│  │  │ components/layout/main/MainHeader │  │ │
│  │  └───────────────────────────────────┘  │ │
│  │  ┌───────────────────────────────────┐  │ │
│  │  │ app/main/page.tsx                 │  │ │
│  │  │  MainVisual → MainInfo →          │  │ │
│  │  │  WhatWeDoSwiper →                 │  │ │
│  │  │  HighlightNewsSection(variant     │  │ │
│  │  │   ="main") → MainCards →          │  │ │
│  │  │  MainProducts → CommonBanner01 →  │  │ │
│  │  │  IconCards → CommonBanner03Link   │  │ │
│  │  └───────────────────────────────────┘  │ │
│  │  ┌───────────────────────────────────┐  │ │
│  │  │ components/layout/main/MainFooter │  │ │
│  │  └───────────────────────────────────┘  │ │
│  └─────────────────────────────────────────┘ │
└───────────────────────────────────────────────┘
```

### markets / company / services / support (공용 서브 레이아웃)
```
app/{markets,company,services,support}/layout.tsx
 ├─ components/layout/markets/SubHeader   (fetchGnbMenuData() 결과 주입)
 ├─ {children}  # 각 라우트그룹의 개별 page.tsx
 └─ components/layout/markets/SubFooter
```

### products-systems (route group `()`, 전용 레이아웃 없음)
```
app/layout.tsx (Root)
 └─ app/()/products-systems/motor-control/page.tsx
```

두 서브 레이아웃 모두 GNB/메가메뉴는 `components/layout/shared/` 하위 공용 컴포넌트(`GnbMenu`, `GnbGlobalMenu`, `GnbMegaPanel`, `GnbMobileDepth1~4Menu`, `GnbSearchPanel`, `HeaderBreadcrumb`, `gnb-mega/*` 6종 패널)를 가져다 씁니다.

---

## 3. 전체 디렉토리 구조 (폴더 레벨)

```
fo/
├── docs/
│   ├── fo-structure.md              # 프로젝트 구조 문서 (현재 파일)
│   ├── fo-data-binding.md           # tsx 파일 ↔ BO data slug 매핑표
│   ├── fo-data-binding-가이드.md     # 마크업 태깅 규칙 + 조회조건 규칙 + STEP0(페이지 머지) 근거
│   ├── FO-RULE.md                   # FO 실행명령어 분류(#FO소스머지/#FO데이터바인딩/#FO화면개발수정) + STEP·에이전트 규칙
│   └── dev/                         # STEP3 산출물(작업 단위 설계문서) — company/main/markets/services 등 섹션별
│
├── public/                          # 정적 파일 (이미지, 아이콘, 폰트) — CSS/TSX가 참조하는 경로와 반드시 1:1로 존재해야 함(6절 참고)
│
├── src/
│   ├── app/                         # Next.js App Router — 상세는 1절 참고
│   │
│   ├── components/                  # 공용 컴포넌트 (실제 존재하는 카테고리만)
│   │   ├── banners/                  # CommonBanner01, CommonBanner03Link, CommonBanner04
│   │   ├── content/                  # HighlightNewsSection
│   │   ├── faq/                      # CommonFaq
│   │   ├── form/                     # GuideSelect, GuideFieldIcons, guideFieldMobileProps
│   │   ├── layout/                   # LenisScrollProvider, ScrollToTop*, HistoryReloadOnNavigate
│   │   │   ├── main/                  # MainHeader, MainFooter
│   │   │   ├── markets/               # SubHeader, SubFooter (markets 전용 아님 — 2절 참고)
│   │   │   └── shared/                # GnbGlobalMenu/Trigger, GnbMegaPanel, GnbMenu, GnbMobileBack,
│   │   │       │                       # GnbMobileDepth1~4Menu, GnbMobileGlobalSelect/MenuPanel, GnbSearchPanel, HeaderBreadcrumb, useHeaderScroll
│   │   │       └── gnb-mega/           # GnbCareers/Company/Devices/Markets/Services/SupportMegaPanel + GnbMegaItemLink/CloseButton
│   │   ├── modals/                   # PrivacyPolicyModal
│   │   ├── pagination/               # PageNumbering
│   │   ├── product/                  # ProductAwardBadge
│   │   ├── swiper/                   # BannerNavButtons, SwiperBar/DotPagination, SwiperNavButtons, swiperControls.classes.ts
│   │   ├── ui/                       # FaqItem, TabButton
│   │   └── video/                    # DevicesProductVideoPlayer
│   │
│   ├── hooks/                       # useCountUp, useInView, useMediaQuery
│   │
│   ├── lib/                         # 순수 유틸리티 함수
│   │   ├── api.ts                    # API fetch 공통 유틸 (X-Site-Id 헤더 주입 포함)
│   │   ├── pageData.ts               # PageData 조회 공통 유틸
│   │   ├── googleMaps/loadGoogleMaps.ts   # Google Maps JS API 부트스트랩 로더 (where-to-buy 전용, 신규)
│   │   ├── navigation/                # crossSectionNav, gnbCloseEvent, historyNavigation
│   │   ├── createThrottledScrollHandler.ts
│   │   ├── lenisScroll.ts / lenisOptions.ts / gnbScrollState.ts   # Lenis 부드러운 스크롤 연동
│   │   ├── youtubeEmbed.ts, productBadge.ts, statNumber.ts
│   │   └── useModalFocusTrap.ts
│   │
│   ├── data/                        # 전역 정적 데이터 (route 전용 데이터는 각 app/{route}/data/ 참고)
│   │   ├── gnb/                       # GNB 메뉴 구조 + 메가메뉴 데이터(mega/)
│   │   ├── highlightNews/             # 뉴스 하이라이트 실데이터 fetch
│   │   ├── services/                  # 엔지니어링 트레이닝 상세 + 서비스센터 콘텐츠
│   │   ├── search/                    # 통합검색 콘텐츠 (대응 라우트 없음)
│   │   ├── support/                   # Connect Portal/Contact Us/Where to Buy/Download Center 콘텐츠
│   │   └── breadcrumbConfig.ts, commonAssets.ts, footerAffiliateOptions.ts, privacyPolicyContent.ts, gnbExploreAllProducts.ts
│   │
│   ├── types/                       # 전역 TypeScript 타입 (highlightNews.ts, google-maps.d.ts)
│   │
│   └── assets/css/                  # 전역 스타일시트
│       ├── reset.css / fonts.css / globals.css   # 초기화·폰트·디자인 토큰
│       ├── main.css / markets.css / company.css / company-feed.css / services.css / support.css / devices-systems.css
│       └── components/                # gnb.css, MainFooter.css, product-award-badge.css
│
├── next.config.ts                   # 이미지 remotePatterns + rewrites(/api/v1/fo/:path* → BE 프록시, 7절 참고)
├── tsconfig.json                    # TypeScript 설정 — path alias `@/*` → `src/*`
└── package.json                     # 의존성 (포트: 3002)
```

> `data/`, `services/` 등 전역 폴더와 별개로, markets/company처럼 **route 전용 데이터는 `app/{route}/data/`에 분리 배치**하는 패턴이 정착되어 있습니다(main은 컴포넌트 폴더에 colocate). 새 메뉴를 마이그레이션할 때 데이터 위치는 이 두 패턴 중 어느 쪽을 따를지 확인 후 결정합니다.

---

## 4. 재사용 패턴 — markets 공용 컴포넌트의 variant/props 분기

`markets/components/*`는 6개 페이지(data-center, power-grid, oil-gas-mining, public-infrastructure, industrial, commercial-residential)가 공유하되, 페이지별 차이는 **props로만 흡수**하는 방식으로 확장합니다. 단, 실제로는 아래처럼 **4가지 서로 다른 조립 패턴**이 존재합니다 — "6개가 전부 같은 패턴"이라고 가정하지 말고, 새 markets 메뉴를 추가할 때는 ③(oil-gas-mining 등) 표준 패턴을 기본 템플릿으로 참고합니다.

| 컴포넌트 | 분기 방식 | ① data-center | ② power-grid | ③ oil-gas-mining/public-infra/industrial(표준) | ④ commercial-residential |
|---|---|---|---|---|---|
| `MarketsHero` | `variant` prop | `key-visual` | `key-visual` | `key-visual` | `key-visual`(+`titleLines`, `secondaryCta`) |
| `MarketsIntro` | `text`/`paragraphs`/`titleLines`만 | `titleLines`+`text` | `titleLines`+`paragraphs` | `text` 또는 `paragraphs`(페이지별 상이) | `titleLines`만 |
| `MarketsStats` | 사용 여부 | 사용 | 미사용 | 미사용(3개 전부) | 사용 |
| `MarketsExplore` | 미사용/`layout`/`defaultTabId` | 미사용 | 사용(`layout="wide-tabs"`) | 사용(`tabs` 커스텀 등 페이지별 상이) | 사용(`defaultTabId="commercial"`, `sectionDesc` 커스텀) |
| 솔루션 섹션 | 컴포넌트 자체가 다름 | `MarketsSolutions`(고유 인터랙티브 맵, 무props) | `MarketsSustainability`+`MarketsSmartGrid`(고유 조합) | `MarketsSolutionsPanel`(`{...xxxSolutionsPanel}` spread) | `MarketsSolutionsPanel`(spread) |
| `MarketsWhy` | `items`/`description` 유무 | `items`+`description` | `items`만 | `items`만 | **props 없음**(공용 기본값) |
| `MarketsProducts` | `badgesType2Only` prop | 미지정(기본) | 지정 | 지정(3개 전부) | 지정 |
| `MarketsReferences` | `items` prop | `dataCenterReferences` | `powerGridReferences` | 페이지별 `xxxReferences` | `commercialResidentialReferences` |
| `MarketsFaq` / `HighlightNewsSection` | 공통 — `MARKETS_FAQ_CODE`로 market별 필터링 | `fetchMarketsFaqItems`/`fetchMarketHighlightNews`에 각 페이지의 market 코드(001~006) 전달, 6개 페이지 완전히 동일한 패턴 | | | |

---

## 5. 주요 의존성 (package.json 기준)

| 패키지 | 용도 |
|---|---|
| `lenis` | 부드러운 스크롤(smooth scroll) 처리 |
| `swiper` | 슬라이더/캐러셀 (배너, 비주얼, What We Do 등) |
| `@mui/material`, `@mui/icons-material`, `@mui/x-date-pickers`, `@mui/x-data-grid` | UI 컴포넌트 (Select, Checkbox, DatePicker, DataGrid 등) |
| `@emotion/react`, `@emotion/styled` | MUI 스타일링 엔진(peer dependency) |
| `dayjs` | 날짜 처리 |
| `jscpd`(devDependency) | 중복 코드 탐지 — `npm run dup-check` (`#FO소스머지` STEP0-2 공통화 판단 근거) |
| `next` `16.2.6` / `react`·`react-dom` `19.2.4` | 프레임워크 버전(실측) |

> Google Maps JS API는 npm 패키지가 아니라 `src/lib/googleMaps/loadGoogleMaps.ts`의 자체 부트스트랩 스크립트 로더로 연동합니다(`NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` 필요, 환경변수 절 참고).

---

## 6. 정적 자산(public) 이관 시 주의사항

ls-publish → fo 페이지 이관 시 CSS/TSX 코드는 정상 복사됐지만 **실제 참조 이미지 파일이 `public/`에 누락**되는 사고가 반복적으로 발생했습니다(2026-07-15, support/contact-us 및 main 하단 배너·footer 이관 시 라디오/체크박스 아이콘 4개, 배너·footer 배경이미지 3개 누락 확인 — 이후 별도 세션의 이관 작업에서 동일 파일들이 재확인·반영됨). 체크리스트는 `FO-RULE.md`의 `#FO소스머지` 관련 절 및 `fo-data-binding-가이드.md`의 STEP0 설명 참고.

---

## 7. API 연동 방식(실측) — 프록시 rewrites

fo 저장소에 `.env.local` 파일이 **존재하지 않습니다**(확인 완료). BE 직접 호출용 `NEXT_PUBLIC_API_URL` 환경변수는 쓰지 않으며, 대신 `next.config.ts`의 `rewrites()`가 `/api/v1/fo/:path*` 요청을 `API_PROXY_TARGET`(기본값 `http://localhost:8080`)로 프록시합니다. `src/lib/api.ts`는 이 프록시 경유 호출에 `X-Site-Id` 헤더를 공통으로 주입합니다. 자세한 공통 규칙은 `docs/ge_guide/fo/fo-api연동가이드.md` 참고.

---

## 8. 병렬 세션 작업 충돌 이력 (참고)

2026-07-15, 같은 날 서로 다른 세션에서 `support/contact-us` 이관 작업이 **중복 진행**된 사례가 있었습니다. 한쪽 세션은 contact-us만 좁은 스코프로(terms-modal/ModalsHubPage 제외) 이관했고, 다른 세션은 같은 시각 motor-control/contact-us(전체, terms-modal 포함)/where-to-buy/warranty-policy까지 더 넓은 스코프로 이관해 먼저 push했습니다. 뒤늦게 pull한 세션은 로컬 변경분을 `git stash`로 보존한 뒤 원격(더 넓은 스코프) 버전으로 정리했습니다. **여러 세션이 동시에 같은 영역을 작업할 가능성이 있는 프로젝트이므로, 큰 이관 작업 시작 전 `git fetch` + `git log HEAD..origin/master`로 원격에 이미 진행된 작업이 없는지 먼저 확인하는 것을 권장합니다.**

---

## 9. GNB 메뉴 ↔ 실제 라우트 매핑 상태

이번 pull로 `products-systems/motor-control`, `support/where-to-buy`가 새로 생기면서 과거 버전에서 지적됐던 GNB 데드링크(`Products & Systems`, "Where to buy") 두 건은 **해소된 것으로 보입니다**(`src/data/gnb/navItems.ts`의 href와 실제 라우트 직접 대조 완료). 다만 `products-systems`는 motor-control 1개 카테고리만 구현되어 있어, GNB 메가메뉴에 다른 제품카테고리 링크가 있다면 여전히 개별 확인이 필요합니다.

---

## 환경변수

| 변수명 | 값 | 설명 |
|-------|----|-----|
| `API_PROXY_TARGET` | 기본값 `http://localhost:8080` | `next.config.ts` rewrites가 프록시할 BE 주소 |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | (미확인) | `support/where-to-buy` 지도 렌더링에 필요 — `.env.local`이 저장소에 없어 로컬에 실제 설정됐는지는 직접 확인 필요 |
