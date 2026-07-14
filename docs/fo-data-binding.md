# GE-FO Data Binding 매핑표

> `fo/` 내 실제로 존재하는 tsx 파일과, BO `SlugRegistry`(위젯 빌더 연동용 slug 사전등록 — `bo-api/.../entity/SlugRegistry.java`)에서 발급될 `data slug` 값을 매핑하기 위한 표입니다.
> **본 표는 현재 fo/src에 실제로 존재하는 파일만 대상으로 합니다** (2026-07 기준, Glob/Read로 직접 확인). 과거 `ge-fo` 전체 반영본 기준으로 있었던 products-systems/search/services/support/guide 섹션과 그 하위 파일들은 현재 코드에 없어 표에서 제외했습니다 — 해당 메뉴가 fo-orchestrator 파이프라인으로 마이그레이션되면 그때 새 섹션으로 추가합니다(company는 이번에 마이그레이션되어 아래 1-4 섹션으로 추가됨).
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

### 1-4. company

| 패널명 | tsx 파일 경로 | 설명 | data slug |
|---|---|---|---|
| Company 레이아웃 | `src/app/company/layout.tsx` | markets와 동일하게 SubHeader(gnbMenuData 주입)·SubFooter로 children을 감싸는 레이아웃. `fetchGnbMenuData()`로 GNB 트리를 조회하며 실패 시 빈 배열로 폴백 | TODO |
| Company LS ELECTRIC 페이지 | `src/app/company/ls-electric/page.tsx` | CompanyLsElectricPage를 렌더하고 company.css를 로드하는 About Us > LS ELECTRIC 라우트 진입점 | TODO |
| Company LS ELECTRIC America 페이지 | `src/app/company/ls-electric-america/page.tsx` | CompanyAmericaPage를 렌더하고 company.css를 로드하는 About Us > LS ELECTRIC America 라우트 진입점 | TODO |
| Company Affiliate in America 페이지 | `src/app/company/affiliate-in-america/page.tsx` | CompanyAffiliateAmericaPage를 렌더하고 company.css를 로드하는 About Us > Affiliate in America 라우트 진입점 | TODO |
| Company ESG 페이지 | `src/app/company/esg/page.tsx` | CompanyEsgPage를 렌더하고 company.css를 로드하는 About Us > ESG 라우트 진입점 | TODO |
| Company Blog 목록 페이지 | `src/app/company/blog/page.tsx` | CompanyBlogPage를 렌더하는 블로그 목록 라우트 진입점 | blog-data (승인됨 — `fo/docs/dev/company/blog-data.md` 참고) |
| Company Blog 상세 페이지 | `src/app/company/blog/detail/page.tsx` | CompanyArticleDetail(variant="blog")에 blogDetailContent 데이터(히어로·문단·불릿·본문 이미지·태그·이전/다음)를 넘겨 블로그 상세를 조립하는 클라이언트 페이지 | blog-data (승인됨 — `fo/docs/dev/company/blog-data.md` 참고) |
| Company Press 목록 페이지 | `src/app/company/press/page.tsx` | 공통 CompanyFeedPage(variant="press")를 렌더하는 보도자료 목록 라우트 진입점 | TODO |
| Company Press 상세 페이지 | `src/app/company/press/detail/page.tsx` | CompanyArticleDetail(variant="press")에 pressDetailContent와 DevicesProductVideoPlayer(유튜브 영상)를 넘겨 보도자료 상세를 조립하는 클라이언트 페이지 | TODO |
| Company Articles 목록 페이지 | `src/app/company/articles/page.tsx` | 공통 CompanyFeedPage(variant="articles")를 렌더하는 미디어 아티클 목록 라우트 진입점 | TODO |
| Company Articles 상세 페이지 | `src/app/company/articles/detail/page.tsx` | CompanyArticleDetail(variant="articles")에 mediaArticleDetailContent 데이터를 넘겨 미디어 아티클 상세를 조립하는 클라이언트 페이지 | TODO |
| Company Events 목록 페이지 | `src/app/company/events/page.tsx` | CompanyEventsPage를 렌더하는 이벤트 목록 라우트 진입점 | TODO |
| Company Events 상세 페이지 | `src/app/company/events/detail/page.tsx` | CompanyArticleDetail(variant="events")에 eventsDetailContent(개최지/일정 메타·히어로·불릿·이전/다음)를 넘겨 이벤트 상세를 조립하는 클라이언트 페이지 | TODO |
| Company LS ELECTRIC Page | `src/app/company/components/CompanyLsElectricPage.tsx` | About Us > LS ELECTRIC 페이지 본문 — Title/Intro/Highlights(카운트업)/Business/Global(지도+카운트업)/PTT/R&D/History 타임라인/Mission 섹션 조립. `previewSection` prop으로 개별 섹션 단독 렌더 지원 | TODO |
| Company America Page | `src/app/company/components/CompanyAmericaPage.tsx` | About Us > LS ELECTRIC America 페이지 본문 — Title/Intro(+통계)/Shaping/Business/Careers 배너(CommonBanner04)/Operate(지점 지도·연락처 카드)/Leaders/Mission/Follow 섹션 조립. `previewSection` 단독 렌더 지원 | TODO |
| Company Affiliate America Page | `src/app/company/components/CompanyAffiliateAmericaPage.tsx` | About Us > Affiliate in America 페이지 본문 — Title/Intro/Affiliate 리스트(로고·설립연도·웹사이트·사업영역·주소) 조립. `previewSection` 단독 렌더 지원 | TODO |
| Company ESG Page | `src/app/company/components/CompanyEsgPage.tsx` | About Us > ESG 페이지 본문 — Title/Intro(+CTA)/Vision(미션·비전 이미지)/Climate 로드맵/Policies(다운로드 카드) 섹션 조립. `previewSection` 단독 렌더 지원 | TODO |
| Company About Title Section | `src/app/company/components/CompanyAboutTitleSection.tsx` | About Us 공통 상단 타이틀 섹션 — h1 타이틀과 설명 문구를 표시하는 프레젠테이셔널 컴포넌트 | TODO |
| Company About Section Head | `src/app/company/components/CompanyAboutSectionHead.tsx` | About Us 공통 섹션 헤더 — section_tit 타이틀과 선택적 section_desc 설명을 표시 | TODO |
| Company About Intro Section | `src/app/company/components/CompanyAboutIntroSection.tsx` | About Us 공통 인트로 섹션 — 히어로 이미지·헤드라인·문단·선택적 CTA를 표시하고 heroImagePosition/headlineSize/paddingBottom/withStats 옵션과 children(통계 밴드 등)으로 변형 | TODO |
| Company Mission Section | `src/app/company/components/CompanyMissionSection.tsx` | About Us 공통 Mission 섹션 — 경영이념 엠블럼·Mission·Core Value(값 원형+커넥터) 블록을 표시(LS ELECTRIC·America 페이지 공용) | TODO |
| Company LS ELECTRIC CountUp Stats | `src/app/company/components/CompanyLsElectricCountUpStats.tsx` | LS ELECTRIC 페이지의 Highlights/Global 통계를 useInView 진입 시 useCountUp으로 카운트업하는 두 컴포넌트(CompanyLsElectricHighlightsStats/CompanyLsElectricGlobalStats)를 export | TODO |
| Company America Intro Stats | `src/app/company/components/CompanyAmericaIntroStats.tsx` | America 인트로 하단 통계 밴드 — "1,000+" 항목은 진입 시 카운트업, 나머지는 정적 값으로 표시 | TODO |
| Company Follow Section | `src/app/company/components/CompanyFollowSection.tsx` | America 페이지 하단 Follow us 소셜 링크 목록(아이콘+라벨, 새 탭) 섹션 | TODO |
| Company Article Detail | `src/app/company/components/CompanyArticleDetail.tsx` | Blog/Press/Articles/Events 상세 공통 레이아웃 — variant별 카테고리·날짜·이벤트 메타·히어로 이미지·영상(afterHero)·본문(children)·이전/다음 페이저·LIST 버튼을 렌더(embedded 모드 지원) | TODO |
| Company Blog Page | `src/app/company/components/CompanyBlogPage.tsx` | Blog 목록 페이지 본문 — 타이틀·Featured 카드·툴바(CompanyBlogListToolbar)·리스트+PageNumbering, empty 시 CompanyFeedEmpty 표시 | blog-data (승인됨 — `fo/docs/dev/company/blog-data.md` 참고) |
| Company Blog List Toolbar | `src/app/company/components/CompanyBlogListToolbar.tsx` | Blog 목록 필터 툴바 — 카테고리 GuideSelect·검색 입력·정렬 GuideSelect(MUI 기반) | TODO |
| Company Events Page | `src/app/company/components/CompanyEventsPage.tsx` | Events 목록 페이지 본문 — CompanyFeedTitle(variant="press")·Featured 슬라이더·Events Calendar·Past Events 조립 | TODO |
| Company Events Calendar | `src/app/company/components/CompanyEventsCalendar.tsx` | Events Calendar 섹션 — 월별 이벤트 목록(제목·Venue·Dates 링크)을 표시 | TODO |
| Company Events Featured | `src/app/company/components/CompanyEventsFeatured.tsx` | Featured 이벤트 Swiper 슬라이더 — 반응형(데스크톱 2장/모바일 1장) + SwiperBarControls 페이지네이션 | TODO |
| Company Events Past Section | `src/app/company/components/CompanyEventsPastSection.tsx` | Past Events 섹션 — 정렬 GuideSelect 툴바·이벤트 카드 그리드·PageNumbering | TODO |
| Company Feed Page | `src/app/company/components/CompanyFeedPage.tsx` | Press/Articles 공통 피드 목록 페이지 — variant로 companyFeedContent를 선택해 Title/Featured/ListSection 조립 | TODO |
| Company Feed Title | `src/app/company/components/CompanyFeedTitle.tsx` | Press/Articles 공통 피드 타이틀 섹션 — variant별 기본 heading/description(override 가능)과 class 접두어 분기 | TODO |
| Company Feed Featured | `src/app/company/components/CompanyFeedFeatured.tsx` | Press/Articles 공통 Featured 카드 섹션 — 이미지·제목·설명·날짜·Explore 링크, class 접두어만 variant 분기 | TODO |
| Company Feed List Grid | `src/app/company/components/CompanyFeedListGrid.tsx` | Press/Articles 공통 리스트 그리드 — 카드(이미지·제목·날짜) 목록, detailHref 기본값 `/company/{variant}/detail` | TODO |
| Company Feed Empty | `src/app/company/components/CompanyFeedEmpty.tsx` | Press/Articles/Blog 공통 Empty 상태 — 아이콘·안내 문구·View All 버튼, class 접두어만 variant 분기 | TODO |
| Company Feed List Toolbar | `src/app/company/components/CompanyFeedListToolbar.tsx` | Press/Articles 공통 리스트 툴바 — Month/Year GuideSelect·검색·정렬 GuideSelect, variant별 aria-label | TODO |
| Company Feed List Section | `src/app/company/components/CompanyFeedListSection.tsx` | Press/Articles 공통 리스트 섹션 — 툴바 + 그리드/Empty + PageNumbering 조립 | TODO |

> Company 하위 서브메뉴 중 `careers`는 아직 fo에 마이그레이션되지 않았습니다 — GNB에는 `GnbCareersMegaPanel`이 있으나 `src/app/company/careers` 라우트는 현재 코드에 없습니다. Blog/Press/Articles/Events(구 articles feed)는 이번 마이그레이션으로 모두 이관되었습니다.
> `src/app/company/articleDetailClass.ts`와 `src/app/company/data/*.ts`는 tsx가 아니므로(BEM 헬퍼·데이터 파일) 본 표에서 제외했습니다.

### 미마이그레이션 섹션 (참고)
products-systems, search, services, support, guide — 아직 fo에 마이그레이션되지 않았습니다. 필요 시 fo-orchestrator의 STEP 0-0(페이지 분석)부터 시작합니다.

### 잔여 파일 (정리 필요)
`src/app/()/products-systems/data/productDetailContent.ts` — 이름 없는 route group 폴더 아래 데이터 파일만 남아 있고 대응하는 페이지가 없습니다. 삭제 여부는 사용자 확인 필요.

---

## 2. components/ — 공용 컴포넌트

### 2-1. banners

| 패널명 | tsx 파일 경로 | 설명 | data slug |
|---|---|---|---|
| Common Banner01 | `src/components/banners/CommonBanner01.tsx` | 다크 배경 CTA 배너 섹션 (main/markets 공용) | TODO |
| Common Banner03 Link | `src/components/banners/CommonBanner03Link.tsx` | 여러 항목(title/description/href)을 호버 인터랙션과 함께 나열하는 링크형 배너 섹션 | TODO |
| Common Banner04 | `src/components/banners/CommonBanner04.tsx` | 배경 이미지(PC/모바일)·딤·타이틀·설명·CTA 버튼을 표시하는 문의 유도형 배너 섹션. linkHref의 내부/외부 링크를 자동 분기(company America Careers 배너 등에서 사용) | TODO |

> `CommonBanner02`, `CommonBanner02CopyLink`, `CommonBanner03`는 현재 코드에 없습니다. (`CommonBanner04`는 이번 company 마이그레이션으로 신규 추가됨.)

### 2-2. content

| 패널명 | tsx 파일 경로 | 설명 | data slug |
|---|---|---|---|
| Highlight News Section | `src/components/content/HighlightNewsSection.tsx` | 뉴스 하이라이트 섹션 (`variant`로 main/markets 스타일 분기) | TODO |

### 2-3. faq

| 패널명 | tsx 파일 경로 | 설명 | data slug |
|---|---|---|---|
| Common Faq | `src/components/faq/CommonFaq.tsx` | 질문/답변 아코디언 패널들을 펼치고 접을 수 있는 공통 FAQ 섹션 컴포넌트 | TODO |

### 2-4. form

| 패널명 | tsx 파일 경로 | 설명 | data slug |
|---|---|---|---|
| Guide Select | `src/components/form/GuideSelect.tsx` | MUI Select 래퍼 — 데스크톱은 커스텀 드롭다운, 모바일(780px 이하)은 OS 네이티브 select로 전환하고 열림 중 스크롤 시 자동으로 닫는 공통 셀렉트 | TODO |
| Guide Field Icons | `src/components/form/GuideFieldIcons.tsx` | 폼 필드 공통 아이콘/상수 — 셀렉트 화살표 아이콘(GuideSelectIcon)·체크박스 아이콘(GuideCheckboxIcon)과 기본/다운로드/동의용 체크박스 아이콘 상수를 export | TODO |

> 같은 폴더의 `guideFieldMobileProps.ts`는 tsx가 아니므로(모바일 slotProps 유틸) 본 표에서 제외했습니다.

### 2-5. layout

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

> 이전 버전에 있던 `components/common/*`(header.tsx, footer.tsx, gnb/* kebab-case), `components/main/*`(kebab-case, app/main/components와 중복), `components/dev`, `components/guide`는 현재 코드에 없습니다 — 4절의 "중복/네이밍 불일치" 이슈는 그 중복 대상 자체가 사라져 더 이상 해당되지 않습니다. (`components/form`, `components/pagination`, `components/video`는 이번 company 마이그레이션으로 신규 추가되어 각각 2-4/2-7/2-11 섹션에 반영함.)

### 2-6. modals

| 패널명 | tsx 파일 경로 | 설명 | data slug |
|---|---|---|---|
| Privacy Policy Modal | `src/components/modals/PrivacyPolicyModal.tsx` | 개인정보처리방침 내용을 모달(또는 embedded 인라인) 형태로 표시하고 ESC·배경클릭으로 닫는 컴포넌트 | TODO |

### 2-7. pagination

| 패널명 | tsx 파일 경로 | 설명 | data slug |
|---|---|---|---|
| Page Numbering | `src/components/pagination/PageNumbering.tsx` | 최대 5개의 페이지 번호와 처음/이전/다음/마지막 컨트롤을 표시하는 공통 페이지네이션 — 현재 페이지 기준 표시 윈도우를 계산하고 onPageChange 콜백으로 이동 처리 | TODO |

### 2-8. product

| 패널명 | tsx 파일 경로 | 설명 | data slug |
|---|---|---|---|
| Product Award Badge | `src/components/product/ProductAwardBadge.tsx` | 제품 카드 이미지 영역에 표시되는 수상 뱃지 아이콘 컴포넌트 | TODO |

### 2-9. swiper

| 패널명 | tsx 파일 경로 | 설명 | data slug |
|---|---|---|---|
| Banner Nav Buttons | `src/components/swiper/BannerNavButtons.tsx` | 배너 스와이퍼의 이전/다음 슬라이드 이동 버튼 컴포넌트 | TODO |
| Swiper Bar Controls | `src/components/swiper/SwiperBarControls.tsx` | SwiperBarPagination과 SwiperNavButtons를 묶어 variant별 바(bar) 형태 슬라이더 컨트롤을 구성 | TODO |
| Swiper Bar Pagination | `src/components/swiper/SwiperBarPagination.tsx` | variant별 클래스를 적용해 바(bar) 형태로 렌더링되는 탭형 슬라이더 페이지네이션 | TODO |
| Swiper Dot Pagination | `src/components/swiper/SwiperDotPagination.tsx` | 점(dot) 형태의 배너 슬라이더 페이지네이션 | TODO |
| Swiper Nav Buttons | `src/components/swiper/SwiperNavButtons.tsx` | variant별 클래스를 적용한 이전/다음 슬라이드 네비게이션 버튼 | TODO |

### 2-10. ui

| 패널명 | tsx 파일 경로 | 설명 | data slug |
|---|---|---|---|
| Faq Item | `src/components/ui/FaqItem.tsx` | 질문 클릭 시 답변 영역이 펼쳐지는 아코디언형 FAQ 아이템 컴포넌트 | TODO |
| Tab Button | `src/components/ui/TabButton.tsx` | role="tab" 접근성 속성을 가진 탭 전환용 버튼 공통 컴포넌트 | TODO |

> 이전 버전에 있던 `components/ui/BtnArrow.tsx`, `BtnFlat.tsx`는 현재 코드에 없습니다. `components/dev`(PageIndexTable 등)도 마찬가지로 없습니다. (`components/video`의 DevicesProductVideoPlayer는 이번 company 마이그레이션으로 신규 추가되어 아래 2-11 섹션에 반영함.)

### 2-11. video

| 패널명 | tsx 파일 경로 | 설명 | data slug |
|---|---|---|---|
| Devices Product Video Player | `src/components/video/DevicesProductVideoPlayer.tsx` | 유튜브 videoId를 임베드 URL(getYoutubeEmbedSrc)로 변환해 iframe으로 재생하는 공통 영상 플레이어(company Press/Blog 상세 등에서 사용) | TODO |

---

## 참고

- 본 표는 `app/` + `components/` 하위 **tsx 파일만** 대상으로 함 (`.ts` 유틸/타입/데이터 파일 제외)
- `설명`은 각 파일을 Read로 직접 읽고 실제 코드(렌더링 구조·데이터·로직)에 근거해 작성함
- `data slug`는 BO `SlugRegistry`(slug 사전등록, type: `PAGE_DATA`/`PAGE_TEMPLATE`/`ETC`)에서 발급되는 값을 그대로 기입 예정
- 과거 `components/banners/*`(PascalCase)와 `components/common/banners/*`(kebab-case)의 재노출(re-export) 중복 이슈는, kebab-case 쪽 파일 자체가 현재 코드에 없어 더 이상 해당되지 않음
