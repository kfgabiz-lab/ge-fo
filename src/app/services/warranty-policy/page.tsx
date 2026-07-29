import WarrantyPolicyBanner from "./components/WarrantyPolicyBanner";
import WarrantyPolicyCoverage from "./components/WarrantyPolicyCoverage";
import WarrantyPolicyTitle from "./components/WarrantyPolicyTitle";
import "@/assets/css/services.css";

export default function WarrantyPolicyPage() {
  return (
    <main
      className="support-page support-page--warranty-policy"
      id="P-FO-SERV-020000P"
    >
      <WarrantyPolicyTitle />
      <WarrantyPolicyCoverage />
      <WarrantyPolicyBanner />
    </main>
  );
}
