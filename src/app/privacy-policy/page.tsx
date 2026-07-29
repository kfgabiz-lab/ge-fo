import type { Metadata } from "next";
import CommonLegalPage from "@/app/components/legal/CommonLegalPage";
import { legalPages } from "@/data/common/commonLegalContent";
import "@/assets/css/common-privacy-policy.css";

export const metadata: Metadata = {
  title: "Privacy Policy | LS ELECTRIC",
  description:
    "This Privacy Notice explains how LS Electric America collects and uses your personal information in connection with its websites, applications, products, services, events, and experiences.",
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
