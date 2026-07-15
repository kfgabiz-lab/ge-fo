import SupportFilterEmpty from "@/app/support/components/SupportFilterEmpty";
import { techHubEmptyContent } from "@/data/support/techHubContent";

export default function TechHubEmpty() {
  return <SupportFilterEmpty content={techHubEmptyContent} />;
}
