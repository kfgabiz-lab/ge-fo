# GE-FO 프로젝트 구조

> Next.js 기반 FO(Front Office) 프로젝트 — 포트 3002

---

## 레이아웃 영역 구조

```
┌─────────────────────────────────────────────────────┐
│  app/layout.tsx  (Root Layout)                      │
│  └─ <html>, <body> 전체 감싸기                        │
│     전역 CSS (reset, fonts, globals)                 │
│     공통 유틸 컴포넌트 (히스토리/스크롤 초기화)            │
│                                                     │
│  ┌───────────────────────────────────────────────┐  │
│  │  app/main/layout.tsx  (Main Layout)           │  │
│  │                                               │  │
│  │  ┌─────────────────────────────────────────┐  │  │
│  │  │  components/common/header.tsx           │  │  │
│  │  │  GNB + 메가메뉴 (최상단 고정 영역)          │  │  │
│  │  └─────────────────────────────────────────┘  │  │
│  │                                               │  │
│  │  ┌─────────────────────────────────────────┐  │  │
│  │  │  app/main/page.tsx  (메인 콘텐츠)         │  │  │
│  │  │  ┌────────────────────────────────────┐  │  │  │
│  │  │  │ MainVisual    (풀스크린 비주얼)       │  │  │  │
│  │  │  │ MainInfo      (소개 정보)            │  │  │  │
│  │  │  │ WhatWeDoSwiper (슬라이더)            │  │  │  │
│  │  │  │ HighlightNews  (뉴스)               │  │  │  │
│  │  │  │ MainCards      (카드 목록)           │  │  │  │
│  │  │  │ MainProducts   (제품 목록)           │  │  │  │
│  │  │  │ CommonBanner01 (배너)               │  │  │  │
│  │  │  │ IconCards      (아이콘 카드)          │  │  │  │
│  │  │  │ CommonBanner03Link (Contact 배너)   │  │  │  │
│  │  │  └────────────────────────────────────┘  │  │  │
│  │  └─────────────────────────────────────────┘  │  │
│  │                                               │  │
│  │  ┌─────────────────────────────────────────┐  │  │
│  │  │  components/common/footer.tsx           │  │  │
│  │  │  뉴스레터 구독 폼 + SNS + 법적고지 (최하단)  │  │  │
│  │  └─────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

---

## 전체 디렉토리 구조

```
fo/
├── docs/
│   └── fo-structure.md              # 프로젝트 구조 문서 (현재 파일)
│
├── public/                          # 정적 파일 (이미지, 아이콘, 폰트)
│
├── src/
│   ├── app/                         # Next.js App Router
│   │   ├── layout.tsx               # [Root Layout] 전역 CSS·메타데이터·공통 유틸 마운트
│   │   └── main/
│   │       ├── layout.tsx           # [Main Layout] Header + {children} + Footer 조합
│   │       └── page.tsx             # 메인 페이지 — 섹션 컴포넌트 조립
│   │
│   ├── components/
│   │   ├── common/                  # 전 페이지 공용 컴포넌트
│   │   │   ├── header.tsx           # 메인 헤더 — GNB + 메가메뉴 (최상단 고정)
│   │   │   ├── footer.tsx           # 메인 푸터 — 뉴스레터·SNS·법적고지 (최하단)
│   │   │   ├── guide-select.tsx     # MUI Select 래퍼 (푸터 셀렉트박스 공용)
│   │   │   ├── history-reload-on-navigate.tsx  # 브라우저 뒤로가기 시 하드 리로드 처리
│   │   │   ├── scroll-to-top-on-navigate.tsx   # 페이지 이동 시 스크롤 최상단 이동
│   │   │   │
│   │   │   ├── gnb/                 # GNB(상단 네비게이션) 관련 컴포넌트
│   │   │   │   ├── gnb-menu.tsx     # GNB 메인 컴포넌트 — 로고·네비·메가메뉴·모바일 메뉴
│   │   │   │   ├── gnb-breadcrumb.tsx  # GNB 하단 브레드크럼 + 바로가기 링크
│   │   │   │   └── mega/            # 메가 메뉴 패널 컴포넌트
│   │   │   │       ├── index.ts                    # 메가 패널 컴포넌트 맵 export
│   │   │   │       ├── types.ts                    # 메가 메뉴 타입 정의
│   │   │   │       ├── getMegaPanelClassName.ts    # 메가 패널 클래스명 계산 유틸
│   │   │   │       ├── GnbDevicesMegaPanel.tsx     # Devices & Systems 메가 패널
│   │   │   │       ├── GnbMarketsMegaPanel.tsx     # Markets 메가 패널
│   │   │   │       ├── GnbSupportMegaPanel.tsx     # Support 메가 패널
│   │   │   │       ├── GnbCompanyMegaPanel.tsx     # Company 메가 패널
│   │   │   │       ├── GnbServicesMegaPanel.tsx    # Services 메가 패널
│   │   │   │       ├── GnbCareersMegaPanel.tsx     # Careers 메가 패널
│   │   │   │       └── GnbMegaItemLink.tsx         # 메가 메뉴 아이템 링크 컴포넌트
│   │   │   │
│   │   │   ├── banners/             # 공용 배너 컴포넌트
│   │   │   │   ├── common-banner-01.tsx   # 전체 폭 단색 배너 (CTA 버튼 포함)
│   │   │   │   ├── common-banner-02.tsx   # 이미지 배경 배너
│   │   │   │   ├── common-banner-03.tsx   # 텍스트 + 이미지 배너
│   │   │   │   ├── common-banner-03-link.tsx  # Contact/WhereToBuy 링크 배너 (메인 하단)
│   │   │   │   └── common-banner-04.tsx   # 슬라이드 배너
│   │   │   │
│   │   │   └── content/             # 공용 콘텐츠 컴포넌트
│   │   │       └── highlight-news-section.tsx  # 뉴스 하이라이트 섹션 (variant로 스타일 분기)
│   │   │
│   │   └── main/                    # 메인 페이지 전용 섹션 컴포넌트
│   │       ├── main-visual.tsx      # [섹션 1] 풀스크린 비주얼 — VideoSwiper + BannerSwiper + 공지
│   │       ├── banner-swiper.tsx    # MainVisual 내부 — 배너 슬라이드
│   │       ├── video-swiper.tsx     # MainVisual 내부 — 배경 영상 슬라이드
│   │       ├── main-info.tsx        # [섹션 2] 브랜드 소개 텍스트 + 이미지
│   │       ├── what-we-do-swiper.tsx  # [섹션 3] What We Do 슬라이더
│   │       ├── main-cards.tsx       # [섹션 5] 마켓/솔루션 카드 목록
│   │       ├── main-products.tsx    # [섹션 6] 주요 제품 목록 (API 연동 예정)
│   │       └── icon-cards.tsx       # [섹션 8] 아이콘 + 텍스트 카드
│   │
│   ├── hooks/                       # 공용 커스텀 React Hook
│   │   ├── use-header-scroll.ts     # 스크롤 방향에 따른 헤더 상태 관리 (full/hidden/revealed)
│   │   └── use-media-query.ts       # CSS 미디어쿼리 반응형 감지 훅
│   │
│   ├── lib/                         # 순수 유틸리티 함수
│   │   ├── api.ts                   # API fetch 공통 유틸 — fetchApi<T>(endpoint, options)
│   │   ├── navigation/
│   │   │   ├── gnb-close-event.ts   # GNB 닫기 커스텀 이벤트 dispatch 유틸
│   │   │   ├── history-navigation.ts  # 브라우저 히스토리 네비게이션 판별·마킹 유틸
│   │   │   └── cross-section-nav.ts   # 섹션별 경로 판별 유틸 (isMainPath 등)
│   │   └── utils/
│   │       ├── format.ts            # 날짜·숫자 포맷 유틸 (formatDate, formatNumber)
│   │       └── string.ts            # 문자열 유틸 (isEmpty, truncate)
│   │
│   ├── data/                        # 정적 데이터 (API 연동 전 목업 포함)
│   │   ├── gnb/                     # GNB 네비게이션 메뉴 구조 데이터
│   │   │   ├── index.ts             # gnb 데이터 통합 export
│   │   │   ├── nav-items.ts         # 상단 메뉴 아이템 목록
│   │   │   ├── panel-ids.ts         # 메가 패널 ID 상수
│   │   │   ├── shared.ts            # 공통 타입·유틸
│   │   │   ├── types.ts             # GNB 타입 정의
│   │   │   └── mega/                # 메가 메뉴 패널별 데이터
│   │   │       ├── devices.ts       # Devices & Systems 메뉴 데이터
│   │   │       ├── markets.ts       # Markets 메뉴 데이터
│   │   │       ├── support.ts       # Support 메뉴 데이터
│   │   │       ├── company.ts       # Company 메뉴 데이터
│   │   │       ├── services.ts      # Services 메뉴 데이터
│   │   │       └── careers.ts       # Careers 메뉴 데이터
│   │   ├── highlight-news/          # 뉴스 하이라이트 목업 데이터
│   │   │   ├── index.ts             # 뉴스 데이터 통합 export
│   │   │   └── main.ts              # 메인 페이지용 뉴스 데이터 (API 연동 시 대체)
│   │   └── main/                    # 메인 페이지 목업 데이터
│   │       ├── index.ts             # 메인 데이터 통합 export
│   │       ├── types.ts             # 메인 데이터 타입 정의
│   │       └── mainSlides.dummy.ts  # 배너 슬라이드 더미 데이터 (API 연동 시 대체)
│   │
│   ├── types/                       # 전역 TypeScript 타입 정의
│   │
│   └── assets/
│       └── css/                     # 전역 스타일시트 (ls-publish 기준)
│           ├── reset.css            # CSS 초기화
│           ├── fonts.css            # 폰트 정의 (Jaka, Pretendard)
│           ├── globals.css          # 디자인 토큰 (CSS 변수) + 공통 유틸 클래스
│           ├── main.css             # 메인 페이지 전용 스타일
│           ├── markets.css          # Markets 페이지 스타일
│           ├── support.css          # Support 페이지 스타일
│           ├── company.css          # Company 페이지 스타일
│           ├── devices-systems.css  # Devices & Systems 페이지 스타일
│           └── components/
│               ├── gnb.css          # GNB 컴포넌트 스타일
│               ├── MainFooter.css   # 메인 푸터 스타일
│               ├── CommonFooter.css # 공통 푸터 스타일
│               └── SubFooter.css    # 서브 푸터 스타일
│
├── .env.local                       # 환경변수 (NEXT_PUBLIC_API_URL)
├── next.config.ts                   # Next.js 설정
├── tsconfig.json                    # TypeScript 설정
└── package.json                     # 의존성 (포트: 3002)
```

## 환경변수

| 변수명 | 값 | 설명 |
|-------|----|-----|
| `NEXT_PUBLIC_API_URL` | `http://localhost:8080` | BE API 서버 주소 |
