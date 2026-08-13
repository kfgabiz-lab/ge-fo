"use client";

import { useState } from "react";
import CookiePreferencesModal from "@/components/modals/CookiePreferencesModal";
import CookieSettingsModal from "@/components/modals/CookieSettingsModal";

type CookieSettingPageClientProps = {
  initialDialog?: "banner" | "preferences";
};

export default function CookieSettingPageClient({
  initialDialog = "banner",
}: CookieSettingPageClientProps) {
  const [activeDialog, setActiveDialog] = useState<
    "banner" | "preferences" | null
  >(initialDialog);

  return (
    <main className="common-page common-page--cookie-setting" id="Page_cookie_setting">
      <h1 className="ir">Cookie Settings</h1>
      <CookieSettingsModal
        open={activeDialog === "banner"}
        onClose={() => setActiveDialog(null)}
        onSettings={() => setActiveDialog("preferences")}
      />
      <CookiePreferencesModal
        open={activeDialog === "preferences"}
        onClose={() => setActiveDialog(null)}
      />
    </main>
  );
}
