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
  return (
    // data-slug-item: FAQ 1건(반복 아이템). data-slug="faq-data" 반복의 단위.
    <div
      className={isOpen ? "faq_item is-open" : "faq_item"}
      data-slug-item
    >
      <button
        type="button"
        className="faq_question"
        aria-expanded={isOpen}
        onClick={onToggle}
      >
        <p className="txt">
          {/* "Q" 라벨은 고정 문구 → 바인딩 대상 아님. 질문 텍스트만 data-slugKey="question"으로 태깅 */}
          <span className="impact">Q</span>
          <span data-slugKey="question">{question}</span>
        </p>
        <span className="faq_icon" aria-hidden="true" />
      </button>
      <div className="faq_answer_wrap" aria-hidden={!isOpen}>
        <div className="faq_answer_inner">
          {/* 답변 텍스트 → data-slugKey="answer" */}
          <p className="faq_answer" data-slugKey="answer">{answer}</p>
        </div>
      </div>
    </div>
  );
}
