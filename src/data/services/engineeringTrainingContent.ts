// 화면 메타(상단 타이틀 + 필터 정의 + 페이지 크기). 강의 목록은 실 API(currMgmt-data, training_course=01)로 조회.
// Category/Lv Category/Sub Category 옵션은 모두 런타임 API로 구성 → 라벨/기본값(전체="")만 정적 보유.
export const engineeringTrainingPage = {
  title: "Engineering Training",
  description:
    "Deepen Your Expertise with LS ELECTRIC — Practical Engineering Training Across Power Systems, Protection, and Distribution Solutions",
  curriculum: {
    filters: {
      category: {
        label: "Category",
        // 전체(All) = 빈 값. 옵션 목록은 컴포넌트에서 PRODUCTCATEGORY 코드그룹으로 런타임 구성
        defaultValue: "",
      },
      lvCategory: {
        label: "Lv Category",
        // 미선택 = 빈 값. 옵션은 category-data(depth3 노드) 파생으로 런타임 구성
        defaultValue: "",
      },
      subCategory: {
        label: "Sub Category",
        // 미선택 = 빈 값. 옵션은 category-data(depth3 노드) 파생으로 런타임 구성
        defaultValue: "",
      },
      searchPlaceholder: "Search",
    },
    pageSize: 10,
  },
};
