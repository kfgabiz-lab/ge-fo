"use client";

import ContactUsTermsModal from "./ContactUsTermsModal";

type ContactUsTermsModalPageContentProps = {
  onClose: () => void;
};

/** `/support/contact-us/terms-modal` · contact-us 폼 오버레이와 동일한 모달 셸 */
export default function ContactUsTermsModalPageContent({
  onClose,
}: ContactUsTermsModalPageContentProps) {
  return (
    <main
      className="support-page support-page--contact-us-terms-modal"
      id="Page_support_contact_terms_modal"
    >
      <ContactUsTermsModal open onClose={onClose} />
    </main>
  );
}
