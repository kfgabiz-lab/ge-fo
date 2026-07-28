import type { Metadata } from "next";
import PrivacyPolicyBody from "./components/PrivacyPolicyBody";
import PrivacyPolicyTitle from "./components/PrivacyPolicyTitle";
import "@/assets/css/common-privacy-policy.css";

export const metadata: Metadata = {
  title: "Privacy Policy | LS ELECTRIC",
  description:
    "This Privacy Notice explains how LS Electric America collects and uses your personal information in connection with its websites, applications, products, services, events, and experiences.",
};

/** P-FO-COMMON-030000P — Figma PC 8113:132101 · MO 8113:132293 */
export default function PrivacyPolicyPage() {
  return (
    <main
      className="common-page common-page--privacy-policy"
      id="P-FO-COMMON-030000P"
    >
      <PrivacyPolicyTitle />
      <PrivacyPolicyBody />
    </main>
  );
}
