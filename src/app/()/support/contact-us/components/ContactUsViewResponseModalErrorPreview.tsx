"use client";

import ContactUsViewResponseModal from "./ContactUsViewResponseModal";

export default function ContactUsViewResponseModalErrorPreview() {
  return (
    <ContactUsViewResponseModal
      embedded
      open
      showErrorsOnOpen
      onClose={() => undefined}
    />
  );
}
