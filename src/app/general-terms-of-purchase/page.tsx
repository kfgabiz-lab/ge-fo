import type { Metadata } from "next";
import CommonLegalPage from "@/app/components/legal/CommonLegalPage";
import { legalPages } from "@/data/common/commonLegalContent";
import "@/assets/css/common-privacy-policy.css";

export const metadata: Metadata = {
  title: "General Terms of Purchase | LS ELECTRIC",
  description:
    "These General Terms of Purchase explain the terms and conditions under which LS Electric America conducts its purchasing activities.",
};

export default function GeneralTermsOfPurchasePage() {
  return (
    <CommonLegalPage
      bodyId="general-terms-of-purchase-body"
      content={legalPages.generalTermsOfPurchase}
      pageId="P-FO-COMMON-030000P"
      selectAriaLabel="General Terms of Purchase version date"
      termsType="3"
      titleId="general-terms-of-purchase-title"
    />
  );
}
