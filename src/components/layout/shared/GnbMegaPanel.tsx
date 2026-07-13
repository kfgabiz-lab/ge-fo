"use client";

import { useCallback, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { GnbMegaDepth2, GnbMegaDepth3, GnbMegaProduct } from "@/data/gnb";
import { EXPLORE_ALL_PRODUCTS_PATH } from "@/data/gnbExploreAllProducts";

type GnbMegaPanelProps = {
  categories: GnbMegaDepth2[];
  activeCategoryId: string;
  activeDepth3Id: string;
  onCategoryChange: (categoryId: string) => void;
  onDepth3Change: (depth3Id: string) => void;
  onLinkClick?: () => void;
};

const DEPTH_HOVER_DELAY_MS = 200;

function findDepth3(
  categories: GnbMegaDepth2[],
  categoryId: string,
  depth3Id: string,
): GnbMegaDepth3 | undefined {
  const category = categories.find((item) => item.id === categoryId);
  return category?.children.find((item) => item.id === depth3Id);
}

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

function ProductCard({
  product,
  onLinkClick,
}: {
  product: GnbMegaProduct;
  onLinkClick?: () => void;
}) {
  return (
    <Link
      href={product.href}
      prefetch={false}
      className="gnb_mega__product"
      onClick={onLinkClick}
    >
      <div className="gnb_mega__product-text">
        <p className="gnb_mega__product-tit">{product.title}</p>
        <p className="gnb_mega__product-sub">{product.subtitle}</p>
      </div>
      <div className="gnb_mega__product-img">
        <img loading="lazy" decoding="async" src={product.image} alt="" />
      </div>
    </Link>
  );
}

export default function GnbMegaPanel({
  categories,
  activeCategoryId,
  activeDepth3Id,
  onCategoryChange,
  onDepth3Change,
  onLinkClick,
}: GnbMegaPanelProps) {
  const router = useRouter();
  const depth2HoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const depth3HoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  const clearDepth2HoverTimeout = useCallback(() => {
    if (depth2HoverTimeoutRef.current !== null) {
      clearTimeout(depth2HoverTimeoutRef.current);
      depth2HoverTimeoutRef.current = null;
    }
  }, []);

  const clearDepth3HoverTimeout = useCallback(() => {
    if (depth3HoverTimeoutRef.current !== null) {
      clearTimeout(depth3HoverTimeoutRef.current);
      depth3HoverTimeoutRef.current = null;
    }
  }, []);

  const handleDepth2MouseEnter = useCallback(
    (categoryId: string) => {
      if (categoryId === activeCategoryId) {
        return;
      }

      clearDepth2HoverTimeout();
      depth2HoverTimeoutRef.current = setTimeout(() => {
        onCategoryChange(categoryId);
        depth2HoverTimeoutRef.current = null;
      }, DEPTH_HOVER_DELAY_MS);
    },
    [activeCategoryId, clearDepth2HoverTimeout, onCategoryChange],
  );

  const handleDepth3MouseEnter = useCallback(
    (depth3Id: string) => {
      if (depth3Id === activeDepth3Id) {
        return;
      }

      clearDepth3HoverTimeout();
      depth3HoverTimeoutRef.current = setTimeout(() => {
        onDepth3Change(depth3Id);
        depth3HoverTimeoutRef.current = null;
      }, DEPTH_HOVER_DELAY_MS);
    },
    [activeDepth3Id, clearDepth3HoverTimeout, onDepth3Change],
  );

  useEffect(() => {
    return () => {
      clearDepth2HoverTimeout();
      clearDepth3HoverTimeout();
    };
  }, [clearDepth2HoverTimeout, clearDepth3HoverTimeout]);

  const navigateFromMegaLink = (
    event: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    if (!href) {
      event.preventDefault();
      return;
    }

    event.preventDefault();
    onLinkClick?.();
    router.push(href);
  };

  const activeCategory =
    categories.find((item) => item.id === activeCategoryId) ?? categories[0];
  const activeDepth3 =
    findDepth3(categories, activeCategory.id, activeDepth3Id) ??
    activeCategory.children[0];
  const depth4Products = activeDepth3 ? getDepth4Products(activeDepth3) : [];
  const showDepth4Intro = Boolean(
    activeDepth3?.panelTitle || activeDepth3?.description?.length,
  );
  const showDepth4Column = depth4Products.length > 0 || showDepth4Intro;

  return (
    <div className="gnb_mega__inner">
      <div className="gnb_mega__col gnb_mega__col--depth2">
        <div className="gnb_mega__depth2-body">
          <ul className="gnb_mega__depth2-list">
            {categories.map((category) => {
              const categoryHref =
                category.href || category.children[0]?.href || "#";

              return (
                <li key={category.id}>
                  <Link
                    href={categoryHref}
                    prefetch={false}
                    className={
                      category.id === activeCategory.id
                        ? "gnb_mega__depth2-btn is-active"
                        : "gnb_mega__depth2-btn"
                    }
                    onMouseEnter={() => handleDepth2MouseEnter(category.id)}
                    onMouseLeave={clearDepth2HoverTimeout}
                    onFocus={() => onCategoryChange(category.id)}
                    onClick={(event) => {
                      const href =
                        category.href || category.children[0]?.href;
                      if (!href) {
                        event.preventDefault();
                        return;
                      }
                      navigateFromMegaLink(event, href);
                    }}
                  >
                    {category.label}
                  </Link>
                </li>
              );
            })}
          </ul>
          <Link
            href={EXPLORE_ALL_PRODUCTS_PATH}
            prefetch={false}
            className="gnb_mega__explore"
            onClick={(event) => {
              event.preventDefault();
              onLinkClick?.();
              router.push(EXPLORE_ALL_PRODUCTS_PATH);
            }}
          >
            Explore All Products
          </Link>
        </div>
      </div>

      <div className="gnb_mega__col gnb_mega__col--depth3">
        <div className="gnb_mega__depth3-scroll">
          <ul className="gnb_mega__depth3-list">
            {activeCategory.children.map((item) => (
              <li key={item.id}>
                <Link
                  href={item.href || "#"}
                  prefetch={false}
                  className={
                    item.id === activeDepth3?.id
                      ? "gnb_mega__depth3-btn is-active"
                      : "gnb_mega__depth3-btn"
                  }
                  onMouseEnter={() => handleDepth3MouseEnter(item.id)}
                  onMouseLeave={clearDepth3HoverTimeout}
                  onFocus={() => onDepth3Change(item.id)}
                  onClick={(event) => navigateFromMegaLink(event, item.href)}
                >
                  {item.label.split("\n").map((line, index) => (
                    <span key={`${item.id}-${index}`}>
                      {index > 0 ? <br /> : null}
                      {line}
                    </span>
                  ))}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {activeDepth3 && showDepth4Column ? (
        <div className="gnb_mega__col gnb_mega__col--depth4">
          {showDepth4Intro ? (
            <div className="gnb_mega__depth4-intro">
              <Link
                href={activeDepth3.href}
                prefetch={false}
                className="gnb_mega__depth4-head"
                onClick={onLinkClick}
              >
                <h3 className="gnb_mega__depth4-tit">{activeDepth3.panelTitle}</h3>
                <span className="gnb_mega__depth4-arrow" aria-hidden>
                  <span className="gnb_mega__depth4-arrow-icon" aria-hidden />
                </span>
              </Link>
              {activeDepth3.description?.length ? (
                <div className="gnb_mega__depth4-desc">
                  <p>
                    {activeDepth3.description.map((line, index) => (
                      <span key={`${activeDepth3.id}-desc-${index}`}>
                        {index > 0 ? <br /> : null}
                        {line}
                      </span>
                    ))}
                  </p>
                </div>
              ) : null}
            </div>
          ) : null}
          {depth4Products.length > 0 ? (
            <div className="gnb_mega__products">
              {depth4Products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onLinkClick={onLinkClick}
                />
              ))}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
