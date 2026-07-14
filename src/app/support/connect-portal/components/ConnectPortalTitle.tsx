import SupportPageTitle from "@/app/support/components/SupportPageTitle";
import { connectPortalPage } from "@/data/support/connectPortalContent";

export default function ConnectPortalTitle() {
  return (
    <SupportPageTitle
      id="support-connect-title"
      rootClass="support_connect_title"
      title={connectPortalPage.title}
      description={connectPortalPage.description}
      mobileInset
    />
  );
}
