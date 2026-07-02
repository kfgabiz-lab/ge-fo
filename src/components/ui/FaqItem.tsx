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
    <div className={isOpen ? "faq_item is-open" : "faq_item"}>
      <button
        type="button"
        className="faq_question"
        aria-expanded={isOpen}
        onClick={onToggle}
      >
        <p className="txt">
          <span className="impact">Q</span>
          {question}
        </p>
        <span className="faq_icon" aria-hidden="true" />
      </button>
      <div className="faq_answer_wrap" aria-hidden={!isOpen}>
        <div className="faq_answer_inner">
          <p className="faq_answer">{answer}</p>
        </div>
      </div>
    </div>
  );
}
