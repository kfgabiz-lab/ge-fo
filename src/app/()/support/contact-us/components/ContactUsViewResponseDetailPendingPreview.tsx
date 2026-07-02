"use client";

import ContactUsViewResponseDetailModal from "./ContactUsViewResponseDetailModal";

export default function ContactUsViewResponseDetailPendingPreview() {
  return (
    <ContactUsViewResponseDetailModal
      embedded
      open
      variant="pending"
      onClose={() => undefined}
    />
  );
}
