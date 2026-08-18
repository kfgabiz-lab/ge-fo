"use client";

import { useEffect, useId, useRef, useState } from "react";
import CommonModal from "@/components/common/CommonModal";
import { fetchData } from "@/lib/pageDataApi";
import "@/assets/css/prosemirror.css";

type PrivacyPolicyModalProps = {
  open: boolean;
  onClose: () => void;
  embedded?: boolean;
};

interface TermsRow {
  content?: string;
}

const MODAL_TITLE = "Privacy Policy";
const CONFIRM_LABEL = "Confirm";

export default function PrivacyPolicyModal({
  open,
  onClose,
  embedded = false,
}: PrivacyPolicyModalProps) {
  const titleId = useId();

  const [termsHtml, setTermsHtml] = useState<string | null>(null);
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (!open || fetchedRef.current) return;
    fetchedRef.current = true;
    let cancelled = false;

    fetchData<TermsRow>({
      slug: "termsMgmt-data",
      where: { "eq_terms.terms_type": "1" },
      size: 1,
      page: 0,
      sort: "createdAt,desc",
    })
      .then((res) => {
        if (cancelled) return;
        const html = res.content[0]?.content;
        setTermsHtml(typeof html === "string" ? html : "");
      })
      .catch(() => {
        if (!cancelled) setTermsHtml("");
      });

    return () => {
      cancelled = true;
    };
  }, [open]);

  return (
    <CommonModal
      open={open}
      onClose={onClose}
      embedded={embedded}
      titleId={titleId}
      title={MODAL_TITLE}
      className="privacy_policy_modal"
      footer={
        <button
          type="button"
          className="btn-base btn-lv01 btn-lv01--solid privacy_policy_modal__confirm"
          onClick={onClose}
        >
          {CONFIRM_LABEL}
        </button>
      }
    >
      <div data-slug="termsMgmt-data">
        <article
          data-slugkey="content"
          className="ProseMirror privacy_policy_modal__text"
          dangerouslySetInnerHTML={{ __html: termsHtml ?? "" }}
        />
      </div>
    </CommonModal>
  );
}
