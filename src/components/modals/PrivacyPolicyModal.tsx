"use client";

import { Fragment, useId } from "react";
import { privacyPolicyModal } from "@/data/privacyPolicyContent";
import CommonModal from "@/components/common/CommonModal";

type PrivacyPolicyModalProps = {
  open: boolean;
  onClose: () => void;
  /** Section guide preview — in-flow layout without fixed overlay */
  embedded?: boolean;
};

export default function PrivacyPolicyModal({
  open,
  onClose,
  embedded = false,
}: PrivacyPolicyModalProps) {
  const titleId = useId();

  return (
    <CommonModal
      open={open}
      onClose={onClose}
      embedded={embedded}
      titleId={titleId}
      title={privacyPolicyModal.title}
      className="privacy_policy_modal"
      footer={
        <button
          type="button"
          className="btn-base btn-lv01 btn-lv01--solid privacy_policy_modal__confirm"
          onClick={onClose}
        >
          {privacyPolicyModal.confirmLabel}
        </button>
      }
    >
      {privacyPolicyModal.sections.map((section) => (
        <article key={section.heading} className="privacy_policy_modal__section">
          <h3 className="privacy_policy_modal__section-tit">{section.heading}</h3>
          <div className="privacy_policy_modal__text">
            <p>
              {section.paragraphs[0]}
              <br />
              <br />
              {section.paragraphs[1]}
              <br />
              <br />
              {section.listItems.map((item, index) => (
                <Fragment key={item}>
                  <strong>
                    {index + 1}. {item}
                  </strong>
                  <br />
                </Fragment>
              ))}
              <br />
              {section.outro}
            </p>
          </div>
        </article>
      ))}
    </CommonModal>
  );
}
