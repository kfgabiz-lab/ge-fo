"use client";

import { useState } from "react";
import CookiePreferencesModal from "@/components/modals/CookiePreferencesModal";
import CookieSettingsModal from "@/components/modals/CookieSettingsModal";

type CookieSettingPageClientProps = {
  initialDialog?: "banner" | "preferences";
};

/** P-FO-COMMON-020000P / 040000M — modal-only preview flow */
export default function CookieSettingPageClient({
  initialDialog = "banner",
}: CookieSettingPageClientProps) {
  const [activeDialog, setActiveDialog] = useState<
    "banner" | "preferences" | null
  >(initialDialog);

  return (
    <>
      <CookieSettingsModal
        open={activeDialog === "banner"}
        onClose={() => setActiveDialog(null)}
        onSettings={() => setActiveDialog("preferences")}
      />
      <CookiePreferencesModal
        open={activeDialog === "preferences"}
        onClose={() => setActiveDialog(null)}
      />
    </>
  );
}
