"use client";

import { useCallback, useState, type ReactNode } from "react";
import FaqItem from "@/components/ui/FaqItem";

export type CommonFaqEntry = {
  question: string;
  answer: string;
};

type CommonFaqProps = {
  title?: string;
  description?: ReactNode;
  items: CommonFaqEntry[];
  sectionId?: string;
  /** 초기에 펼칠 패널 인덱스. -1이면 모두 접힘 */
  defaultOpenIndex?: number;
};

function createInitialExpanded(
  itemCount: number,
  defaultOpenIndex: number,
): Set<number> {
  if (defaultOpenIndex < 0 || defaultOpenIndex >= itemCount) {
    return new Set();
  }

  return new Set([defaultOpenIndex]);
}

export default function CommonFaq({
  title = "FAQ",
  description,
  items,
  sectionId,
  defaultOpenIndex = 0,
}: CommonFaqProps) {
  const [expandedIndices, setExpandedIndices] = useState<Set<number>>(() =>
    createInitialExpanded(items.length, defaultOpenIndex),
  );

  const togglePanel = useCallback((index: number) => {
    setExpandedIndices((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  }, []);

  return (
    <section className="common_faq" id={sectionId}>
      <div className="common_faq__bg" aria-hidden="true" />
      <div className="inner">
        <div className="common_faq__head">
          <h2 className="section_tit">{title}</h2>
          {description ? <p className="section_desc">{description}</p> : null}
        </div>
        <div className="common_faq__list">
          {items.map((item, index) => (
            <FaqItem
              key={item.question}
              question={item.question}
              answer={item.answer}
              isOpen={expandedIndices.has(index)}
              onToggle={() => togglePanel(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
