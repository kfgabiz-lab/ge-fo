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
  /** 초기에 펼칠 패널 인덱스. -1이면 모두 접힘 */
  defaultOpenIndex?: number;
  /** 섹션 앵커 id (옵셔널, 하위호환). 지정 시 최상위 <section>에 반영 */
  sectionId?: string;
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
  defaultOpenIndex = 0,
  sectionId,
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
        {/* data-slug="faq-data" 다건 반복 컨테이너 (repeat). 실제 반복 map이 여기서 일어남.
            NOTE: CommonFaq는 공통 컴포넌트지만 현재 MarketsFaq 체인에서만 사용됨.
            data-slug 값 faq-data는 목표설정 대화에서 확정된 값. */}
        <div
          className="common_faq__list"
          data-slug="faq-data"
          data-slug-repeat="true"
        >
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
