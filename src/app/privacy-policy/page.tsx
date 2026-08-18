import type { Metadata } from "next";
import CommonLegalPage from "@/app/components/legal/CommonLegalPage";
import { legalPages } from "@/data/common/commonLegalContent";
import "@/assets/css/common-privacy-policy.css";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Review LS ELECTRIC America's Privacy Notice to understand how we collect, use, store, and protect your personal data in compliance with applicable privacy laws.",
};

export default function PrivacyPolicyPage() {
  return (
    <CommonLegalPage
      bodyId="privacy-policy-body"
      content={legalPages.privacyPolicy}
      pageId="P-FO-COMMON-030000P"
      selectAriaLabel="Privacy Policy version date"
      termsType="1"
      titleId="privacy-policy-title"
    />
  );
}
