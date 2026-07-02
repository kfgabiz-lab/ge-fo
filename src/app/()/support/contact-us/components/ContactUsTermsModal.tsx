"use client";

import PrivacyPolicyModal from "@/components/modals/PrivacyPolicyModal";

type ContactUsTermsModalProps = {
  open: boolean;
  onClose: () => void;
  /** Section guide preview — in-flow layout without fixed overlay */
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
