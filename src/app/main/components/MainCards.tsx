"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

type CardItem = {
  href: string;
  image: string;
  imageAlt: string;
  title: string;
};

const cardItems: CardItem[] = [
  {
    href: "/markets/data-center",
    image: "/img/main/card_01.jpg",
    imageAlt: "Data Center",
    title: "Data Center",
  },
  {
    href: "",
    image: "/img/main/card_02.png",
    imageAlt: "Data Center",
    title: "Public Infrastructure",
  },
  {
    href: "",
    image: "/img/main/card_03.png",
    imageAlt: "Data Center",
    title: "Oil & Gas, Mining Industries",
  },
  {
    href: "",
    image: "/img/main/card_04.png",
    imageAlt: "Data Center",
    title: "Power Grid",
  },
  {
    href: "",
    image: "/img/main/card_05.png",
    imageAlt: "Data Center",
    title: "Industrial",
  },
  {
    href: "/markets/commercial-residential",
    image: "/img/main/card_06.png",
    imageAlt: "Data Center",
    title: "Commercial & Residential",
  },
];

const REVEAL_BASE_DELAY_MS = 80;
const REVEAL_STAGGER_MS = 300;

export default function MainCards() {
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);
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
          {cardItems.map((item, index) => (
            <a
              key={`${item.title}-${index}`}
              href={item.href}
              className={["item", inViewItems[index] && "is-in-view"].filter(Boolean).join(" ")}
              ref={el => {
                itemRefs.current[index] = el;
              }}
              style={{
                "--reveal-delay": `${REVEAL_BASE_DELAY_MS + index * REVEAL_STAGGER_MS}ms`,
              } as CSSProperties}
            >
              <div className="img_area">
                <img loading="lazy" decoding="async" src={item.image} alt={item.imageAlt} />
              </div>
              <div className="txt_area">
                <h3 className="tit">{item.title}</h3>
                <span className="btn-icon-56" aria-hidden="true">
                  <span className="icon_arrow-20" />
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
