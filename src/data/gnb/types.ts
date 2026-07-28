export type GnbMegaProduct = {
  id: string;
  title: string;
  subtitle: string;
  /** 실이미지 없으면 null — 렌더 쪽에서 이미지 영역 자체를 생략한다(플레이스홀더 미사용) */
  image: string | null;
  href: string;
};

export type GnbMegaDepth3 = {
  id: string;
  /**
   * 이 Lv2 노드의 category-data PK.
   * id 는 slug 기반이라 slug 가 겹치는 Lv2(예: "variable-frequency-drive" 587/607)를 구별하지 못한다.
   * URL 의 ?category={id} 컨텍스트와 대조해 "클릭한 바로 그 노드"를 특정하는 데 쓴다(브레드크럼 조상 체인).
   * 정적 폴백 트리(gnb/mega/*.ts)처럼 실데이터가 아닌 경우 없을 수 있어 옵셔널.
   */
  categoryId?: number | null;
  label: string;
  /** depth4 패널 타이틀 (product 없는 링크 전용 항목은 생략) */
  panelTitle?: string;
  /** depth4 설명 (product 없는 링크 전용 항목은 생략) */
  description?: string[];
  href: string;
  products?: GnbMegaProduct[];
  /** 단일 제품 또는 제품 목록 (gnb_product 데이터 호환) */
  product?: GnbMegaProduct | GnbMegaProduct[];
};

export type GnbMegaDepth2 = {
  id: string;
  label: string;
  /** depth2-btn 클릭 시 이동 경로 (미지정 시 첫 depth3 href) */
  href?: string;
  children: GnbMegaDepth3[];
};

export type GnbSimpleMegaItem = {
  id: string;
  title: string;
  description?: string;
  descriptionLines?: string[];
  href?: string;
  external?: boolean;
  /** 모바일 depth2 외부 링크 아이콘 (미지정 시 external과 동일) */
  externalIcon?: boolean;
  /** 모바일 depth2에서 설명 숨김 */
  hideMobileDescription?: boolean;
  disabled?: boolean;
};

export type GnbSimpleMegaSection = {
  id: string;
  label: string;
  items: GnbSimpleMegaItem[];
};

export type GnbMegaPanelMeta = {
  panelId: string;
};

export type GnbSimpleMegaMenu = GnbMegaPanelMeta &
  (
    | {
        type: "simple";
        layout: "grid";
        items: GnbSimpleMegaItem[];
      }
    | {
        type: "simple";
        layout: "sections";
        sections: GnbSimpleMegaSection[];
      }
  );

export type GnbDevicesMegaMenu = GnbMegaPanelMeta & {
  type: "devices";
  categories: GnbMegaDepth2[];
};

export type GnbMegaMenu = GnbSimpleMegaMenu | GnbDevicesMegaMenu;

export type GnbNavItem = {
  id: string;
  label: string;
  href: string;
  megaMenu?: GnbMegaMenu;
};

export function isDevicesMegaMenu(menu: GnbMegaMenu): menu is GnbDevicesMegaMenu {
  return menu.type === "devices";
}

export function isSimpleMegaMenu(menu: GnbMegaMenu): menu is GnbSimpleMegaMenu {
  return menu.type === "simple";
}

export function getFirstSimpleMegaItemId(menu: GnbSimpleMegaMenu): string {
  if (menu.layout === "grid") {
    return menu.items[0]?.id ?? "";
  }

  return menu.sections[0]?.items[0]?.id ?? "";
}
