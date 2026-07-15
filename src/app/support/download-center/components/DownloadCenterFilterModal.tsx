"use client";

import SupportFilterModal from "@/app/support/components/SupportFilterModal";
import { downloadCenterPage } from "@/data/support/downloadCenterContent";
import DownloadCenterFilterPanel from "./DownloadCenterFilterPanel";

type DownloadCenterFilterModalProps = {
  open: boolean;
  onClose: () => void;
};

export default function DownloadCenterFilterModal({
  open,
  onClose,
}: DownloadCenterFilterModalProps) {
  return (
    <SupportFilterModal
      open={open}
      onClose={onClose}
      applyLabel={downloadCenterPage.applyLabel}
    >
      <DownloadCenterFilterPanel variant="modal" />
    </SupportFilterModal>
  );
}
