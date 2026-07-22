import { salesTrainingPage } from "@/data/services/salesTrainingContent";
import { serviceTrainingPage } from "@/data/services/serviceTrainingContent";
import { engineeringTrainingPage } from "@/data/services/engineeringTrainingContent";

// Training 리스트 공통 variant (Sales/Engineering/Service 동일 구조)
export type TrainingVariant = "sales" | "engineering" | "service";

// 필터 옵션 공통 타입 (셀렉트 value/label 쌍). Lv/Sub Category 옵션은
// 런타임에 category-data(depth3 노드)에서 파생(trainingData.toLv/SubCategoryOptions).
export type TrainingFilterOption = {
  value: string;
  label: string;
};

// 필터 단위 설정(라벨/기본값만). 옵션 목록은 정적 보유하지 않고 런타임 API로 구성한다.
// - Category: PRODUCTCATEGORY 코드그룹
// - Lv/Sub Category: category-data(depth3 노드) 파생
type TrainingFilterConfig = {
  label: string;
  defaultValue: string;
};

// 커리큘럼 화면 메타(필터 정의 + 페이지 크기) 공통 타입.
// 강의 목록(courses)/총 페이지 수는 실 API(slug=currMgmt-data) 조회 결과로 대체 → 여기서 정적 보유하지 않음.
export type TrainingCurriculumData = {
  filters: {
    // 세 필터 모두 옵션은 런타임 API 구성 → 라벨/기본값만 정적 보유
    category: TrainingFilterConfig;
    lvCategory: TrainingFilterConfig;
    subCategory: TrainingFilterConfig;
    searchPlaceholder: string;
  };
  pageSize: number;
};

// variant별 콘텐츠 + 화면 메타(pageId/클래스/섹션id/ariaLabel/상세링크접두어) 집약 타입
export type TrainingContentEntry = {
  title: string;
  description: string;
  curriculum: TrainingCurriculumData;
  // <main> id 로 사용되는 페이지 식별자
  pageId: string;
  // <main> className (support-page--{variant}-training 하드코딩 클래스 매핑)
  mainClassName: string;
  // <section> id ({variant}-training-curriculum)
  sectionId: string;
  // PageNumbering ariaLabel 문구
  ariaLabel: string;
  // Card 상세 링크 접두어 (/services/{variant}-training)
  detailHrefPrefix: string;
};

// variant별 집약 매핑. 값(courses/filters 등)은 기존 콘텐츠 파일에서 import 하여 재사용하고,
// 화면 메타(pageId/클래스/섹션id/ariaLabel/상세링크)만 여기서 중앙 정의한다.
export const trainingContent: Record<TrainingVariant, TrainingContentEntry> = {
  sales: {
    ...salesTrainingPage,
    pageId: "P-FO-SERV-030000P_2",
    mainClassName: "support-page support-page--sales-training",
    sectionId: "sales-training-curriculum",
    ariaLabel: "Sales training curriculum pages",
    detailHrefPrefix: "/services/sales-training",
  },
  engineering: {
    ...engineeringTrainingPage,
    pageId: "P-FO-SERV-030000P",
    mainClassName: "support-page support-page--engineering-training",
    sectionId: "engineering-training-curriculum",
    ariaLabel: "Training curriculum pages",
    detailHrefPrefix: "/services/engineering-training",
  },
  service: {
    ...serviceTrainingPage,
    pageId: "P-FO-SERV-030000P_1",
    mainClassName: "support-page support-page--service-training",
    sectionId: "service-training-curriculum",
    ariaLabel: "Service training curriculum pages",
    detailHrefPrefix: "/services/service-training",
  },
};
