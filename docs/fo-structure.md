# GE-FO 프로젝트 구조

> Next.js(App Router) 기반 FO(Front Office) 프로젝트 — 포트 3002
> **본 문서는 fo/src 하위에 실제로 존재하는 파일·구조만 기준으로 작성됨** (2026-07 기준, Glob/Read로 직접 확인)
> `ge-fo`(https://github.com/kfgabiz-lab/ge-fo) 전체 반영본 기준의 대규모 구조는 현재 코드에 없음 — 지금은 `main` + `markets`(data-center, power-grid) 2개 메뉴만 마이그레이션된 상태
> 전체 tsx 파일별 목록·data slug 매핑은 [`fo-data-binding.md`](./fo-data-binding.md) 참고

---

## 1. 라우트 구조 개요

현재 `src/app` 하위에 실제로 존재하는 라우트는 `main`(홈)과 `markets`(data-center, power-grid) 뿐입니다. company/products-systems/search/services/support/guide 등 다른 메뉴는 아직 마이그레이션되지 않았습니다.

```
src/app/
├── layout.tsx                  # [Root Layout] 전역 CSS·메타데이터 마운트
│                                # ※ src/app/page.tsx(루트 페이지)는 존재하지 않음
│
├── main/                       # 홈(메인)
│   ├── layout.tsx               # MainHeader + {children} + MainFooter
│   ├── page.tsx                 # 메인 페이지 — 섹션 컴포넌트 조립
│   └── components/              # 메인 페이지 전용 섹션 8개
│       ├── MainVisual.tsx, VideoSwiper.tsx, BannerSwiper.tsx
│       ├── MainInfo.tsx, WhatWeDoSwiper.tsx
│       ├── MainCards.tsx, MainProducts.tsx, IconCards.tsx
│       └── mainVisualData.ts    # MainVisual 전용 데이터 (컴포넌트 폴더에 colocate)
│
└── markets/                    # 산업분야별 솔루션 (route group 괄호 없음)
    ├── layout.tsx               # SubHeader + {children} + SubFooter
    ├── components/              # markets 공용 섹션 컴포넌트 15개
    │   ├── MarketsHero.tsx (variant: "default" | "key-visual")
    │   ├── MarketsIntro.tsx, MarketsExplore.tsx, MarketsStats.tsx
    │   ├── MarketsReferences.tsx, MarketsReferencesModal.tsx
    │   ├── MarketsBenefits.tsx, MarketsSolutions.tsx
    │   ├── MarketsSustainability.tsx, MarketsSmartGrid.tsx, MarketsSmartGridDiagram.tsx
    │   ├── MarketsWhy.tsx, MarketsProducts.tsx, MarketsFaq.tsx
    │   └── MarketsHeroScrollDown.tsx
    ├── data/                    # route 전용 정적 데이터 — 페이지별로 분리
    │   ├── marketsContent.ts          # 공용 타입 + 공용 references 등
    │   ├── marketsDataCenterContent.ts
    │   ├── marketsPowerGridContent.ts
    │   └── marketsSolutions.ts
    ├── lib/
    │   └── scrollToMarketsHeroNextSection.ts
    ├── data-center/page.tsx      # 조립: Hero, Intro, Stats, References, Benefits, Solutions, Why, Products, CommonBanner01, HighlightNewsSection, Faq
    └── power-grid/page.tsx       # 조립: Hero(key-visual), Intro, Explore(wide-tabs), References, Benefits, Sustainability, SmartGrid, Why, Products(badgesType2Only), CommonBanner01, HighlightNewsSection, Faq

# 잔여 파일 (정리 필요, 사용자 확인 대상)
src/app/()/products-systems/data/productDetailContent.ts
  # 이름 없는 route group "()" 아래 데이터 파일만 남아있음 — 대응하는 page.tsx 없음
```

markets 하위 2개 페이지(`data-center`, `power-grid`)는 위 공용 컴포넌트를 공유하되, 컴포넌트마다 `variant`/`items`/`layout` 등 **props로 페이지별 차이를 흡수**하는 패턴을 씁니다 (예: `MarketsHero`의 `variant="default"`(data-center, 변경 없음) vs `variant="key-visual"`(power-grid, 신규)). 새 markets 메뉴를 추가할 때는 이 패턴을 우선 검토합니다.

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

### markets (data-center / power-grid)
```
app/markets/layout.tsx
 ├─ components/layout/markets/SubHeader
 ├─ {children}  # data-center/page.tsx 또는 power-grid/page.tsx
 └─ components/layout/markets/SubFooter
```

두 레이아웃 모두 GNB/메가메뉴는 `components/layout/shared/` 하위 공용 컴포넌트(`GnbMenu`, `GnbMegaPanel`, `gnb-mega/*` 등)를 가져다 씁니다.

---

## 3. 전체 디렉토리 구조 (폴더 레벨)

```
fo/
├── docs/
│   ├── fo-structure.md              # 프로젝트 구조 문서 (현재 파일)
│   └── fo-data-binding.md           # tsx 파일 ↔ BO data slug 매핑표
│
├── public/                          # 정적 파일 (이미지, 아이콘, 폰트)
│
├── src/
│   ├── app/                         # Next.js App Router — 상세는 1절 참고
│   │
│   ├── components/                  # 공용 컴포넌트 (실제 존재하는 카테고리만)
│   │   ├── banners/                  # CommonBanner01, CommonBanner03Link (PascalCase)
│   │   ├── content/                  # HighlightNewsSection
│   │   ├── faq/                      # CommonFaq
│   │   ├── layout/                   # LenisScrollProvider, ScrollToTop*, HistoryReloadOnNavigate
│   │   │   ├── main/                  # MainHeader, MainFooter
│   │   │   ├── markets/               # SubHeader, SubFooter
│   │   │   └── shared/                # GnbMenu, GnbMegaPanel, GnbGlobalMenu/Trigger, GnbSearchPanel, HeaderBreadcrumb
│   │   │       └── gnb-mega/           # GnbCareersMegaPanel 등 6개 도메인별 메가패널 + GnbMegaItemLink
│   │   ├── modals/                   # PrivacyPolicyModal
│   │   ├── product/                  # ProductAwardBadge
│   │   ├── swiper/                   # BannerNavButtons, SwiperBar/DotPagination, SwiperNavButtons
│   │   └── ui/                       # FaqItem, TabButton
│   │
│   ├── hooks/                       # useCountUp, useInView, useMediaQuery
│   │
│   ├── lib/                         # 순수 유틸리티 함수
│   │   ├── api.ts                    # API fetch 공통 유틸
│   │   ├── navigation/                # crossSectionNav, gnbCloseEvent, historyNavigation
│   │   ├── createThrottledScrollHandler.ts
│   │   ├── lenisScroll.ts / lenisOptions.ts / gnbScrollState.ts   # Lenis 부드러운 스크롤 연동
│   │   ├── youtubeEmbed.ts           # 유튜브 임베드 유틸
│   │   ├── productBadge.ts           # 제품 수상 뱃지 로직
│   │   └── useModalFocusTrap.ts      # 모달 포커스 트랩
│   │
│   ├── data/                        # 전역 정적 데이터 (route 전용 데이터는 각 app/{route}/data/ 참고)
│   │   ├── gnb/                       # GNB 메뉴 구조 + 메가메뉴 데이터(mega/)
│   │   ├── highlightNews/             # 뉴스 하이라이트 (index/main/markets)
│   │   ├── services/                  # 엔지니어링 트레이닝 상세 콘텐츠
│   │   ├── search/                    # 통합검색 콘텐츠
│   │   ├── support/                   # Connect Portal/Download Center 콘텐츠
│   │   └── breadcrumbConfig.ts, commonAssets.ts, footerAffiliateOptions.ts, privacyPolicyContent.ts, gnbExploreAllProducts.ts
│   │
│   ├── types/                       # 전역 TypeScript 타입 (highlightNews.ts)
│   │
│   └── assets/css/                  # 전역 스타일시트
│       ├── reset.css / fonts.css / globals.css   # 초기화·폰트·디자인 토큰
│       ├── main.css / markets.css                # 마이그레이션된 페이지별 스타일 (support/services/company 등은 없음)
│       └── components/                # product-award-badge.css, MainFooter.css, gnb.css
│
├── .env.local                       # 환경변수 (NEXT_PUBLIC_API_URL)
├── next.config.ts                   # Next.js 설정 (이미지 remotePatterns 등)
├── tsconfig.json                    # TypeScript 설정 — path alias `@/*` → `src/*`
└── package.json                     # 의존성 (포트: 3002)
```

> `data/`, `services/` 등 전역 폴더와 별개로, markets처럼 **route 전용 데이터는 `app/{route}/data/`에 분리 배치**하는 패턴이 새로 생겼습니다(main은 `mainVisualData.ts` 하나만 컴포넌트 폴더에 colocate). 새 메뉴를 마이그레이션할 때 데이터 위치는 이 두 패턴 중 어느 쪽을 따를지 확인 후 결정합니다.

---

## 4. 재사용 패턴 — markets 공용 컴포넌트의 variant/props 분기

`markets/components/*`는 data-center·power-grid 두 페이지가 공유하되, 페이지별 차이는 **props로만 흡수**하고 기존 분기(예: data-center용 `"default"`)는 절대 변경하지 않는 방식으로 확장합니다.

| 컴포넌트 | 분기 방식 | data-center | power-grid |
|---|---|---|---|
| `MarketsHero` | `variant` prop | `"default"`(변경 없음) | `"key-visual"`(스티키 래퍼, `MarketsHeroScrollDown`, `secondaryCta`) |
| `MarketsIntro` | `titleLines`/`text`/`paragraphs` prop | `titleLines` + `text` | `titleLines` + `paragraphs`(여러 단락) |
| `MarketsExplore` | `layout` prop | (미사용) | `layout="wide-tabs"` |
| `MarketsProducts` | `badgesType2Only` prop | 미지정(기본) | `badgesType2Only`(수상 뱃지 타입2만 표시) |
| `MarketsReferences` | `items` prop | `dataCenterReferences` | `powerGridReferences` |

신규 markets 메뉴를 추가할 때는 이 표의 컴포넌트부터 재사용 가능 여부를 확인하고, 필요한 차이만 새 prop으로 추가합니다(새 파일 생성 지양).

---

## 5. 주요 의존성 (package.json 기준)

| 패키지 | 용도 |
|---|---|
| `lenis` | 부드러운 스크롤(smooth scroll) 처리 |
| `swiper` | 슬라이더/캐러셀 (배너, 비주얼, What We Do 등) |
| `@mui/material`, `@mui/x-date-pickers`, `@mui/x-data-grid` | UI 컴포넌트 (Select, DatePicker 등) |
| `dayjs` | 날짜 처리 |

---

## 환경변수

| 변수명 | 값 | 설명 |
|-------|----|-----|
| `NEXT_PUBLIC_API_URL` | `http://localhost:8080` | BE API 서버 주소 |
