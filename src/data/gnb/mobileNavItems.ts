import {
  isDevicesMegaMenu,
  isSimpleMegaMenu,
} from "@/data/gnb/types";
import type {
  GnbMegaDepth3,
  GnbMegaProduct,
  GnbNavItem,
} from "@/data/gnb/types";

export type GnbMobileDepth2Item = {
  id: string;
  label: string;
  href?: string;
  external?: boolean;
  disabled?: boolean;
  hasSubmenu: boolean;
  descriptionLines?: string[];
};

export type GnbMobileDepth2SectionItem = {
  id: string;
  label: string;
  description?: string;
  href?: string;
  external?: boolean;
  externalIcon?: boolean;
  disabled?: boolean;
};

export type GnbMobileDepth2Section = {
  id: string;
  label: string;
  items: GnbMobileDepth2SectionItem[];
};

export type GnbMobileDepth3Item = {
  id: string;
  label: string;
  href?: string;
  external?: boolean;
  disabled?: boolean;
  hasSubmenu: boolean;
};

export type GnbMobileDepth4Intro = {
  panelTitle: string;
  description: string[];
  href: string;
};

export type GnbMobileDepth4Data = {
  intro: GnbMobileDepth4Intro;
  products: GnbMegaProduct[];
};

function getDepth4Products(item: GnbMegaDepth3): GnbMegaProduct[] {
  if (item.products?.length) {
    return item.products;
  }

  if (Array.isArray(item.product)) {
    return item.product;
  }

  if (item.product) {
    return [item.product];
  }

  return [];
}

/**
 * depth2 목록 생성.
 * grid 레이아웃(markets)은 pub의 하드코딩 정렬 배열을 쓰지 않고
 * 전달받은 megaMenu.items 순서(= API sortOrder 순)를 그대로 사용한다.
 */
export function getMobileDepth2Items(navItem: GnbNavItem): GnbMobileDepth2Item[] {
  const megaMenu = navItem.megaMenu;
  if (!megaMenu) return [];

  if (isDevicesMegaMenu(megaMenu)) {
    return megaMenu.categories.map((category) => ({
      id: category.id,
      label: category.label,
      href: category.href,
      hasSubmenu: category.children.length > 0,
    }));
  }

  if (!isSimpleMegaMenu(megaMenu)) return [];

  if (megaMenu.layout === "grid") {
    return megaMenu.items.map((item) => ({
      id: item.id,
      label: item.title,
      href: item.href,
      external: item.external,
      disabled: item.disabled,
      descriptionLines: item.descriptionLines,
      hasSubmenu: false,
    }));
  }

  return megaMenu.sections.map((section) => ({
    id: section.id,
    label: section.label,
    hasSubmenu: section.items.length > 0,
  }));
}

export function getMobileDepth2Sections(
  navItem: GnbNavItem,
): GnbMobileDepth2Section[] {
  const megaMenu = navItem.megaMenu;
  if (!megaMenu || !isSimpleMegaMenu(megaMenu) || megaMenu.layout !== "sections") {
    return [];
  }

  return megaMenu.sections.map((section) => ({
    id: section.id,
    label: section.label,
    items: section.items.map((item) => ({
      id: item.id,
      label: item.title,
      description: item.hideMobileDescription ? undefined : item.description,
      href: item.href,
      external: item.external,
      externalIcon: item.externalIcon ?? item.external,
      disabled: item.disabled,
    })),
  }));
}

/** navItems(= resolve된 GNB 목록)에서 navId로 항목 조회 */
export function findGnbNavItem(navItems: GnbNavItem[], navId: string) {
  return navItems.find((item) => item.id === navId);
}

export function isMobileDepth2GridLayout(navItem: GnbNavItem) {
  const megaMenu = navItem.megaMenu;
  return Boolean(
    megaMenu && isSimpleMegaMenu(megaMenu) && megaMenu.layout === "grid",
  );
}

export function isMobileDepth2SectionsLayout(navItem: GnbNavItem) {
  const megaMenu = navItem.megaMenu;
  return Boolean(
    megaMenu && isSimpleMegaMenu(megaMenu) && megaMenu.layout === "sections",
  );
}

export function getMobileDepth3BackLabel(
  navItems: GnbNavItem[],
  navId: string,
) {
  const navItem = findGnbNavItem(navItems, navId);
  return navItem ? `Back to ${navItem.label}` : "Back";
}

export function getMobileDepth3Items(
  navItems: GnbNavItem[],
  navId: string,
  depth2Id: string,
): GnbMobileDepth3Item[] {
  const navItem = findGnbNavItem(navItems, navId);
  const megaMenu = navItem?.megaMenu;
  if (!megaMenu) return [];

  if (isDevicesMegaMenu(megaMenu)) {
    const category = megaMenu.categories.find((item) => item.id === depth2Id);
    if (!category) return [];

    return category.children.map((child) => ({
      id: child.id,
      label: child.label,
      href: child.href,
      hasSubmenu: Boolean(
        child.products?.length || child.product,
      ),
    }));
  }

  if (!isSimpleMegaMenu(megaMenu) || megaMenu.layout !== "sections") {
    return [];
  }

  const section = megaMenu.sections.find((item) => item.id === depth2Id);
  if (!section) return [];

  return section.items.map((item) => ({
    id: item.id,
    label: item.title,
    href: item.href,
    external: item.external,
    disabled: item.disabled,
    hasSubmenu: false,
  }));
}

export function getMobileDepth4BackLabel(
  navItems: GnbNavItem[],
  navId: string,
  depth2Id: string,
) {
  const navItem = findGnbNavItem(navItems, navId);
  const megaMenu = navItem?.megaMenu;
  if (!megaMenu || !isDevicesMegaMenu(megaMenu)) {
    return "Back";
  }

  const category = megaMenu.categories.find((item) => item.id === depth2Id);
  return category ? `Back to ${category.label}` : "Back";
}

export function getMobileDepth4Data(
  navItems: GnbNavItem[],
  navId: string,
  depth2Id: string,
  depth3Id: string,
): GnbMobileDepth4Data | null {
  const navItem = findGnbNavItem(navItems, navId);
  const megaMenu = navItem?.megaMenu;
  if (!megaMenu || !isDevicesMegaMenu(megaMenu)) {
    return null;
  }

  const category = megaMenu.categories.find((item) => item.id === depth2Id);
  const depth3Item = category?.children.find((item) => item.id === depth3Id);
  if (!depth3Item) {
    return null;
  }

  const products = getDepth4Products(depth3Item);

  return {
    intro: {
      panelTitle: depth3Item.panelTitle ?? depth3Item.label,
      description: depth3Item.description ?? [],
      href: depth3Item.href,
    },
    products,
  };
}
