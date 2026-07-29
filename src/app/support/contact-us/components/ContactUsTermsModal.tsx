"use client";

import PrivacyPolicyModal from "@/components/modals/PrivacyPolicyModal";

type ContactUsTermsModalProps = {
  open: boolean;
  onClose: () => void;
  embedded?: boolean;
};

export default function ContactUsTermsModal({
  open,
  onClose,
  embedded = false,
}: ContactUsTermsModalProps) {
  return (
    <PrivacyPolicyModal open={open} onClose={onClose} embedded={embedded} />
  );
}
