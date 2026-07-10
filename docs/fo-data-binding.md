# GE-FO Data Binding 매핑표

> `fo/` 내 실제로 존재하는 tsx 파일과, BO `SlugRegistry`(위젯 빌더 연동용 slug 사전등록 — `bo-api/.../entity/SlugRegistry.java`)에서 발급될 `data slug` 값을 매핑하기 위한 표입니다.
> **본 표는 현재 fo/src에 실제로 존재하는 파일만 대상으로 합니다** (2026-07 기준, Glob/Read로 직접 확인). 과거 `ge-fo` 전체 반영본 기준으로 있었던 company/products-systems/search/services/support/guide 섹션과 그 하위 파일들은 현재 코드에 없어 표에서 제외했습니다 — 해당 메뉴가 fo-orchestrator 파이프라인으로 마이그레이션되면 그때 새 섹션으로 추가합니다.
> `설명`은 각 파일을 실제로 읽고 코드 내용(렌더링 구조·데이터·로직)에 근거해 작성했습니다.
> `data slug` 컬럼은 전부 **TODO**로 비워둔 상태이며, BO에서 slug가 등록되는 대로 채워 넣습니다.
> 본 표는 `app/` + `components/` 하위 **tsx 파일만** 대상으로 함 (`.ts` 유틸/타입/데이터 파일 제외)

---

## 1. app/ — 라우트 페이지

### 1-1. 루트

| 패널명 | tsx 파일 경로 | 설명 | data slug |
|---|---|---|---|
| Root 레이아웃 | `src/app/layout.tsx` | 루트 레이아웃 — 전역 CSS(reset/fonts/globals)와 메타데이터, 공통 유틸을 마운트하는 최상위 레이아웃 | TODO |

> 이전 버전에 있던 `src/app/page.tsx`(루트 인덱스), `(company,markets,products-systems,search,services,support)/layout.tsx`(route group 공통 레이아웃)는 현재 코드에 없습니다.

### 1-2. main (홈)

| 패널명 | tsx 파일 경로 | 설명 | data slug |
|---|---|---|---|
| Main 레이아웃 | `src/app/main/layout.tsx` | MainHeader(`components/layout/main/MainHeader`)와 MainFooter(`components/layout/main/MainFooter`)로 children을 감싸는 레이아웃 | TODO |
| Main 페이지 | `src/app/main/page.tsx` | 메인 홈페이지 — MainVisual, MainInfo, WhatWeDoSwiper, HighlightNewsSection(공통, variant="main"), MainCards, MainProducts, CommonBanner01(공통), IconCards, CommonBanner03Link(공통) 순으로 조립하는 페이지 | TODO |
| Main Visual | `src/app/main/components/MainVisual.tsx` | 히어로 영역(VideoSwiper+BannerSwiper)을 감싸고, 공지사항 배너 1줄(main_notic)을 렌더링하는 컴포넌트 (전용 데이터: `mainVisualData.ts` colocate) | banner-data - bannerPosition: INFORMATION (승인됨 — `fo/docs/dev/main/banner-data-information.md` 참고) |
| Video Swiper | `src/app/main/components/VideoSwiper.tsx` | 히어로 영상/이미지 슬라이드 3개를 자동 재생 Swiper로 보여주는 컴포넌트, 각 슬라이드에 "Explore" 버튼 | hero-data (승인됨 — `fo/docs/dev/main/hero-data.md` 참고) |
| Banner Swiper | `src/app/main/components/BannerSwiper.tsx` | 히어로 옆 사이드 배너 슬라이드 3개를 보여주는 컴포넌트 | banner-data - bannerPosition: HERO (승인됨 — `fo/docs/dev/main/banner-data-hero.md` 참고) |
| Main Info | `src/app/main/components/MainInfo.tsx` | 스크롤 진입 시 통계 숫자 3개를 카운트업 애니메이션으로 보여주는 컴포넌트 | TODO |
| What We Do Swiper | `src/app/main/components/WhatWeDoSwiper.tsx` | "What we do" 슬라이드 3개를 fade 효과 오토플레이 Swiper로 보여주는 컴포넌트 | TODO |
| Main Cards | `src/app/main/components/MainCards.tsx` | 산업분야 카드를 IntersectionObserver 기반 순차 페이드인 애니메이션과 함께 보여주는 "Industries We Serve" 섹션 컴포넌트 (`@/data/gnb/mega/markets` 데이터 재사용) | TODO |
| Main Products | `src/app/main/components/MainProducts.tsx` | New Arrivals/Best Sellers 탭 전환과 Swiper 슬라이더로 상품 카드를 보여주는 "Discover Our Products" 섹션 컴포넌트 | TODO |
| Icon Cards | `src/app/main/components/IconCards.tsx` | Connect Portal/Tech Hub/Download Center/Training 4개 아이콘 카드를 렌더링하는 "Explore More" 섹션 컴포넌트 | TODO |

### 1-3. markets

| 패널명 | tsx 파일 경로 | 설명 | data slug |
|---|---|---|---|
| Markets 레이아웃 | `src/app/markets/layout.tsx` | SubHeader(`components/layout/markets/SubHeader`)와 SubFooter(`components/layout/markets/SubFooter`)로 children을 감싸는 레이아웃 | TODO |
| Markets Data Center 페이지 | `src/app/markets/data-center/page.tsx` | Data Center 시장 페이지 — Hero, Intro, Stats, References(dataCenterReferences), Benefits, Solutions(맵), Why, Products, CommonBanner01, HighlightNewsSection, Faq 조합 | TODO |
| Markets Power Grid 페이지 | `src/app/markets/power-grid/page.tsx` | Power Grid 시장 페이지 — Hero(variant="key-visual"), Intro, Explore(layout="wide-tabs"), References(powerGridReferences), Benefits, Sustainability, SmartGrid, Why, Products(badgesType2Only), CommonBanner01, HighlightNewsSection, Faq 조합 | TODO |
| Markets Hero | `src/app/markets/components/MarketsHero.tsx` | 서브타이틀·타이틀·히어로 이미지·CTA 버튼을 표시하는 마켓 히어로 섹션. `variant="default"`(data-center, 기존 렌더링 유지)와 `variant="key-visual"`(power-grid, 스티키+ScrollDown+secondaryCta) 지원 | TODO |
| Markets Hero Scroll Down | `src/app/markets/components/MarketsHeroScrollDown.tsx` | 클릭 시 Lenis 스크롤로 히어로 다음 섹션까지 부드럽게 이동시키는 스크롤 다운 버튼 (key-visual 히어로 전용) | TODO |
| Markets Intro | `src/app/markets/components/MarketsIntro.tsx` | 타이틀 라인(`titleLines`)과 본문(`text` 단일 또는 `paragraphs` 다건)을 표시하는 마켓 인트로 섹션 | TODO |
| Markets Stats | `src/app/markets/components/MarketsStats.tsx` | 스크롤 인뷰 시 숫자가 카운트업되는 통계 지표(label/value/description) 그리드 섹션 | TODO |
| Markets Explore | `src/app/markets/components/MarketsExplore.tsx` | 탭 클릭으로 산업별(Industry) 콘텐츠를 전환하는 "Explore Industries" 탭 UI. `layout="wide-tabs"`로 넓은 탭 레이아웃 지원(power-grid) | TODO |
| Markets References | `src/app/markets/components/MarketsReferences.tsx` | `items` prop으로 받은 레퍼런스 카드 목록을 표시하고 클릭 시 MarketsReferencesModal을 여는 "References" 섹션. 기본값 `references`(marketsContent.ts)는 명시적 `items`를 넘기지 않는 호출이 없을 때의 안전한 폴백 | TODO |
| Markets References Modal | `src/app/markets/components/MarketsReferencesModal.tsx` | 이미지 스와이퍼 갤러리·프로젝트 개요·주요 정보 테이블을 보여주는 레퍼런스 상세 모달(단일/다중, portal/embedded 지원) | TODO |
| Markets Benefits | `src/app/markets/components/MarketsBenefits.tsx` | 이미지와 타이틀·설명·Capabilities 텍스트를 좌우 교차 레이아웃으로 나열하는 "Engineered Benefits" 섹션 | TODO |
| Markets Solutions | `src/app/markets/components/MarketsSolutions.tsx` | 데이터센터 맵 이미지 위 핫스팟(존) 클릭 시 우측/모바일 아코디언에 해당 존의 솔루션 제품 정보를 보여주는 인터랙티브 맵 섹션 (data-center 전용) | TODO |
| Markets Sustainability | `src/app/markets/components/MarketsSustainability.tsx` | 이미지·타이틀·불릿 리스트 카드들을 보여주는 "지속가능한 에너지 미래" 섹션(카드 없으면 렌더링 안 함, power-grid 전용) | TODO |
| Markets Smart Grid | `src/app/markets/components/MarketsSmartGrid.tsx` | BESS/마이크로그리드 유즈케이스 카드와 운영 특징 카드, 다이어그램을 표시하는 "Smart Grid & Energy Storage Solutions" 섹션(power-grid 전용) | TODO |
| Markets Smart Grid Diagram | `src/app/markets/components/MarketsSmartGridDiagram.tsx` | 마이크로그리드 시스템 구성도 이미지를 렌더링하는 다이어그램 컴포넌트 | TODO |
| Markets Why | `src/app/markets/components/MarketsWhy.tsx` | 배경 이미지 위에 아이콘·타이틀·설명 아이템들을 나열하는 "Why LS ELECTRIC?" 섹션 | TODO |
| Markets Products | `src/app/markets/components/MarketsProducts.tsx` | 관련 제품 목록을 그리드로 보여주고 수상 배지를 표시하는 "Relavant Products" 섹션. `badgesType2Only`로 뱃지 타입 제한(power-grid) | TODO |
| Markets Faq | `src/app/markets/components/MarketsFaq.tsx` | 공통 FAQ 컴포넌트(CommonFaq)에 마켓 전용 설명 문구와 FAQ 항목을 넘겨 렌더링하는 래퍼 | TODO |

> 이전 버전에 있던 `(markets)/commercial-residential`, `industrial`, `oil-gas-mining`, `public-infrastructure`, `references-modal`, `page.tsx`(리다이렉트), `MarketsSolutionsPanel`, `MarketsReferencesModalPageClient`, `MarketsReferencesModalPreview`는 현재 코드에 없습니다.

### 미마이그레이션 섹션 (참고)
company, products-systems, search, services, support, guide — 아직 fo에 마이그레이션되지 않았습니다. 필요 시 fo-orchestrator의 STEP 0-0(페이지 분석)부터 시작합니다.

### 잔여 파일 (정리 필요)
`src/app/()/products-systems/data/productDetailContent.ts` — 이름 없는 route group 폴더 아래 데이터 파일만 남아 있고 대응하는 페이지가 없습니다. 삭제 여부는 사용자 확인 필요.

---

## 2. components/ — 공용 컴포넌트

### 2-1. banners

| 패널명 | tsx 파일 경로 | 설명 | data slug |
|---|---|---|---|
| Common Banner01 | `src/components/banners/CommonBanner01.tsx` | 다크 배경 CTA 배너 섹션 (main/markets 공용) | TODO |
| Common Banner03 Link | `src/components/banners/CommonBanner03Link.tsx` | 여러 항목(title/description/href)을 호버 인터랙션과 함께 나열하는 링크형 배너 섹션 | TODO |

> `CommonBanner02`, `CommonBanner02CopyLink`, `CommonBanner03`, `CommonBanner04`는 현재 코드에 없습니다.

### 2-2. content

| 패널명 | tsx 파일 경로 | 설명 | data slug |
|---|---|---|---|
| Highlight News Section | `src/components/content/HighlightNewsSection.tsx` | 뉴스 하이라이트 섹션 (`variant`로 main/markets 스타일 분기) | TODO |

### 2-3. faq

| 패널명 | tsx 파일 경로 | 설명 | data slug |
|---|---|---|---|
| Common Faq | `src/components/faq/CommonFaq.tsx` | 질문/답변 아코디언 패널들을 펼치고 접을 수 있는 공통 FAQ 섹션 컴포넌트 | TODO |

### 2-4. layout

| 패널명 | tsx 파일 경로 | 설명 | data slug |
|---|---|---|---|
| Lenis Scroll Provider | `src/components/layout/LenisScrollProvider.tsx` | Lenis 라이브러리로 부드러운 스크롤을 앱 전체에 적용하는 프로바이더 | TODO |
| Scroll To Top Button | `src/components/layout/ScrollToTopButton.tsx` | 스크롤 400px 초과 시 나타나는 "맨 위로" 플로팅 버튼 | TODO |
| History Reload On Navigate | `src/components/layout/HistoryReloadOnNavigate.tsx` | 뒤로가기/앞으로가기나 특정 경로 이동 시 하드 리로드·네비게이션을 처리하는 컴포넌트 | TODO |
| Scroll To Top On Navigate | `src/components/layout/ScrollToTopOnNavigate.tsx` | 메인 경로 이동 시 스크롤을 최상단으로 이동시키는 컴포넌트 | TODO |
| Main Header | `src/components/layout/main/MainHeader.tsx` | 메인 페이지 전용 헤더 (GNB + 메가메뉴) | TODO |
| Main Footer | `src/components/layout/main/MainFooter.tsx` | 메인 페이지 전용 푸터 | TODO |
| Sub Header | `src/components/layout/markets/SubHeader.tsx` | markets 페이지 전용 헤더 — 스크롤에 따른 표시/숨김, 상단 고정, 메가메뉴/모바일메뉴 상태 관리, 브레드크럼 포함 | TODO |
| Sub Footer | `src/components/layout/markets/SubFooter.tsx` | markets 페이지 전용 푸터 | TODO |
| Gnb Global Menu | `src/components/layout/shared/GnbGlobalMenu.tsx` | 전역 GNB 메뉴 | TODO |
| Gnb Global Trigger | `src/components/layout/shared/GnbGlobalTrigger.tsx` | GNB 열기/닫기 트리거 | TODO |
| Gnb Mega Panel | `src/components/layout/shared/GnbMegaPanel.tsx` | GNB 메가메뉴에서 2뎁스 카테고리, 3뎁스 항목, 4뎁스 제품카드를 마우스오버로 전환하며 보여주는 패널 | TODO |
| Gnb Menu | `src/components/layout/shared/GnbMenu.tsx` | GNB 메인 컴포넌트 — 로고·네비·메가메뉴·모바일 메뉴 (main/markets 헤더가 공용으로 사용) | TODO |
| Gnb Search Panel | `src/components/layout/shared/GnbSearchPanel.tsx` | GNB 통합검색 패널 | TODO |
| Header Breadcrumb | `src/components/layout/shared/HeaderBreadcrumb.tsx` | 헤더 영역 브레드크럼 | TODO |
| Gnb Careers Mega Panel | `src/components/layout/shared/gnb-mega/GnbCareersMegaPanel.tsx` | Careers 메가 패널 | TODO |
| Gnb Company Mega Panel | `src/components/layout/shared/gnb-mega/GnbCompanyMegaPanel.tsx` | Company 메가 패널 | TODO |
| Gnb Devices Mega Panel | `src/components/layout/shared/gnb-mega/GnbDevicesMegaPanel.tsx` | Devices & Systems 메가 패널 | TODO |
| Gnb Markets Mega Panel | `src/components/layout/shared/gnb-mega/GnbMarketsMegaPanel.tsx` | Markets 메가 패널 | TODO |
| Gnb Mega Item Link | `src/components/layout/shared/gnb-mega/GnbMegaItemLink.tsx` | 메가 메뉴 아이템 링크 컴포넌트 | TODO |
| Gnb Services Mega Panel | `src/components/layout/shared/gnb-mega/GnbServicesMegaPanel.tsx` | Services 메가 패널 | TODO |
| Gnb Support Mega Panel | `src/components/layout/shared/gnb-mega/GnbSupportMegaPanel.tsx` | Support 메가 패널 | TODO |

> 이전 버전에 있던 `components/common/*`(header.tsx, footer.tsx, gnb/* kebab-case), `components/main/*`(kebab-case, app/main/components와 중복), `components/dev`, `components/form`, `components/guide`, `components/pagination`, `components/video`는 현재 코드에 없습니다 — 4절의 "중복/네이밍 불일치" 이슈는 그 중복 대상 자체가 사라져 더 이상 해당되지 않습니다.

### 2-5. modals

| 패널명 | tsx 파일 경로 | 설명 | data slug |
|---|---|---|---|
| Privacy Policy Modal | `src/components/modals/PrivacyPolicyModal.tsx` | 개인정보처리방침 내용을 모달(또는 embedded 인라인) 형태로 표시하고 ESC·배경클릭으로 닫는 컴포넌트 | TODO |

### 2-6. product

| 패널명 | tsx 파일 경로 | 설명 | data slug |
|---|---|---|---|
| Product Award Badge | `src/components/product/ProductAwardBadge.tsx` | 제품 카드 이미지 영역에 표시되는 수상 뱃지 아이콘 컴포넌트 | TODO |

### 2-7. swiper

| 패널명 | tsx 파일 경로 | 설명 | data slug |
|---|---|---|---|
| Banner Nav Buttons | `src/components/swiper/BannerNavButtons.tsx` | 배너 스와이퍼의 이전/다음 슬라이드 이동 버튼 컴포넌트 | TODO |
| Swiper Bar Controls | `src/components/swiper/SwiperBarControls.tsx` | SwiperBarPagination과 SwiperNavButtons를 묶어 variant별 바(bar) 형태 슬라이더 컨트롤을 구성 | TODO |
| Swiper Bar Pagination | `src/components/swiper/SwiperBarPagination.tsx` | variant별 클래스를 적용해 바(bar) 형태로 렌더링되는 탭형 슬라이더 페이지네이션 | TODO |
| Swiper Dot Pagination | `src/components/swiper/SwiperDotPagination.tsx` | 점(dot) 형태의 배너 슬라이더 페이지네이션 | TODO |
| Swiper Nav Buttons | `src/components/swiper/SwiperNavButtons.tsx` | variant별 클래스를 적용한 이전/다음 슬라이드 네비게이션 버튼 | TODO |

### 2-8. ui

| 패널명 | tsx 파일 경로 | 설명 | data slug |
|---|---|---|---|
| Faq Item | `src/components/ui/FaqItem.tsx` | 질문 클릭 시 답변 영역이 펼쳐지는 아코디언형 FAQ 아이템 컴포넌트 | TODO |
| Tab Button | `src/components/ui/TabButton.tsx` | role="tab" 접근성 속성을 가진 탭 전환용 버튼 공통 컴포넌트 | TODO |

> 이전 버전에 있던 `components/ui/BtnArrow.tsx`, `BtnFlat.tsx`는 현재 코드에 없습니다. `components/dev`(PageIndexTable 등), `components/video`(DevicesProductVideoPlayer)도 마찬가지로 없습니다.

---

## 참고

- 본 표는 `app/` + `components/` 하위 **tsx 파일만** 대상으로 함 (`.ts` 유틸/타입/데이터 파일 제외)
- `설명`은 각 파일을 Read로 직접 읽고 실제 코드(렌더링 구조·데이터·로직)에 근거해 작성함
- `data slug`는 BO `SlugRegistry`(slug 사전등록, type: `PAGE_DATA`/`PAGE_TEMPLATE`/`ETC`)에서 발급되는 값을 그대로 기입 예정
- 과거 `components/banners/*`(PascalCase)와 `components/common/banners/*`(kebab-case)의 재노출(re-export) 중복 이슈는, kebab-case 쪽 파일 자체가 현재 코드에 없어 더 이상 해당되지 않음
