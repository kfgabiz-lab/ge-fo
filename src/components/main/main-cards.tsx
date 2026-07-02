"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { marketsMegaMenu } from "@/data/gnb/mega/markets";

type CardItem = {
  href?: string;
  image: string;
  imageAlt: string;
  title: string;
};

const cardImagesById: Record<string, Pick<CardItem, "image" | "imageAlt">> = {
  "data-center": {
    image: "/img/main/card_01.jpg",
    imageAlt: "Data Center",
  },
  "power-grid": {
    image: "/img/main/card_04.png",
    imageAlt: "Power Grid",
  },
  "oil-gas-mining": {
    image: "/img/main/card_03.png",
    imageAlt: "Oil & Gas, Mining Industries",
  },
  "public-infrastructure": {
    image: "/img/main/card_02.png",
    imageAlt: "Public Infrastructure",
  },
  industrial: {
    image: "/img/main/card_05.png",
    imageAlt: "Industrial",
  },
  "commercial-residential": {
    image: "/img/main/card_06.png",
    imageAlt: "Commercial & Residential",
  },
};

/** main_cards 표시 순서 (행 우선) */
const mainCardOrder = [
  "data-center",
  "power-grid",
  "oil-gas-mining",
  "public-infrastructure",
  "industrial",
  "commercial-residential",
] as const;

const megaMenuItems =
  marketsMegaMenu.layout === "grid" ? marketsMegaMenu.items : [];

const cardItems: CardItem[] = mainCardOrder.flatMap((id) => {
  const item = megaMenuItems.find((entry) => entry.id === id);
  const image = cardImagesById[id];

  if (!item || !image) return [];

  return [
    {
      href: item.disabled ? undefined : item.href,
      title: item.title,
      ...image,
    },
  ];
});

const REVEAL_BASE_DELAY_MS = 300;
const REVEAL_STAGGER_MS = 200;

export default function MainCards() {
  const itemRefs = useRef<(HTMLElement | null)[]>([]);
  const [inViewItems, setInViewItems] = useState<boolean[]>(Array(cardItems.length).fill(false));

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    itemRefs.current.forEach((el, idx) => {
      if (!el) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setInViewItems(prev => {
              if (prev[idx]) return prev;
              const next = [...prev];
              next[idx] = true;
              return next;
            });
            observer.disconnect();
          }
        },
        { threshold: 0.18, rootMargin: "0px 0px 50% 0px" }
      );
      observer.observe(el);
      observers.push(observer);
    });
    return () => observers.forEach(o => o.disconnect());
  }, []);

  return (
    <section className="main_cards">
      <div className="inner">
        <h2 className="section_tit">Industries We Serve</h2>
        <div className="items">
          {cardItems.map((item, index) => {
            const className = ["item", inViewItems[index] && "is-in-view"].filter(Boolean).join(" ");
            const style = {
              "--reveal-delay": `${REVEAL_BASE_DELAY_MS + index * REVEAL_STAGGER_MS}ms`,
            } as CSSProperties;
            const content = (
              <>
                <div className="img_area">
                  <img loading="lazy" decoding="async" src={item.image} alt={item.imageAlt} />
                </div>
                <div className="txt_area">
                  <h3 className="tit">{item.title}</h3>
                  <span className="btn-icon-56" aria-hidden="true">
                    <span className="icon_arrow-20" />
                  </span>
                </div>
              </>
            );

            if (item.href) {
              return (
                <Link
                  key={`${item.title}-${index}`}
                  href={item.href}
                  className={className}
                  ref={(el) => {
                    itemRefs.current[index] = el;
                  }}
                  style={style}
                >
                  {content}
                </Link>
              );
            }

            return (
              <div
                key={`${item.title}-${index}`}
                className={className}
                ref={(el) => {
                  itemRefs.current[index] = el;
                }}
                style={style}
              >
                {content}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
