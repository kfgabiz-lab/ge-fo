"use client";

import ContactUsViewResponseDetailModal from "./ContactUsViewResponseDetailModal";

export default function ContactUsViewResponseDetailAnsweredPreview() {
  return (
    <ContactUsViewResponseDetailModal
      embedded
      open
      variant="answered"
      onClose={() => undefined}
    />
  );
}
