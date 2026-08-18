import type { Metadata } from "next";
import CommonLegalPage from "@/app/components/legal/CommonLegalPage";
import { legalPages } from "@/data/common/commonLegalContent";
import "@/assets/css/common-privacy-policy.css";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Read the Terms and Conditions for using the LS ELECTRIC America website, outlining legal rights, intellectual property, and site usage guidelines.",
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
