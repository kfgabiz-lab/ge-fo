"use client";

import SupportFilterModal from "@/app/support/components/SupportFilterModal";
import { techHubPage } from "@/data/support/techHubContent";
import TechHubFilterPanel from "./TechHubFilterPanel";

type TechHubFilterModalProps = {
  open: boolean;
  onClose: () => void;
};

export default function TechHubFilterModal({
  open,
  onClose,
}: TechHubFilterModalProps) {
  return (
    <SupportFilterModal
      open={open}
      onClose={onClose}
      applyLabel={techHubPage.applyLabel}
    >
      <TechHubFilterPanel variant="modal" />
    </SupportFilterModal>
  );
}
