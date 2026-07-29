import type { Metadata } from "next";
import CommonLegalPage from "@/app/components/legal/CommonLegalPage";
import { legalPages } from "@/data/common/commonLegalContent";
import "@/assets/css/common-privacy-policy.css";

export const metadata: Metadata = {
  title: "Terms of Service | LS ELECTRIC",
  description:
    "These Terms of Service explain the terms and conditions under which LS Electric America provides its services.",
};

export default function TermsOfServicePage() {
  return (
    <CommonLegalPage
      bodyId="terms-of-service-body"
      content={legalPages.termsOfService}
      pageId="P-FO-COMMON-030000P"
      selectAriaLabel="Terms of Service version date"
      termsType="2"
      titleId="terms-of-service-title"
    />
  );
}
