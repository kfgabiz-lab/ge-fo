"use client";

import { useState } from "react";
import CookiePreferencesModal from "@/components/modals/CookiePreferencesModal";

export default function CookiePreferencesPageClient() {
  const [open, setOpen] = useState(true);

  return (
    <CookiePreferencesModal open={open} onClose={() => setOpen(false)} />
  );
}
