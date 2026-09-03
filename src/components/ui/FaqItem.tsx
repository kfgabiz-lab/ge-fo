"use client";

import { useId } from "react";

type FaqItemProps = {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
};

export default function FaqItem({
  question,
  answer,
  isOpen,
  onToggle,
}: FaqItemProps) {
  const panelId = useId();

  return (
    <div
      className={isOpen ? "faq_item is-open" : "faq_item"}
      data-slug-item
    >
      <button
        type="button"
        className="faq_question"
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={onToggle}
      >
        <p className="txt">
          <span className="impact">Q</span>
          <span data-slugkey="question">{question}</span>
        </p>
        <span className="faq_icon" aria-hidden="true" />
      </button>
      <div
        id={panelId}
        className="faq_answer_wrap"
        role="region"
        aria-hidden={!isOpen}
        onClick={isOpen ? onToggle : undefined}
      >
        <div className="faq_answer_inner">
          <p className="faq_answer" data-slugkey="answer">{answer}</p>
        </div>
      </div>
    </div>
  );
}
