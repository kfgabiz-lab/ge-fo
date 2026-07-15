import SupportFilterPageShell from "@/app/support/components/SupportFilterPageShell";
import type { SupportFilterNoDataPageConfig } from "@/data/support/supportFilterNoDataConfig";

type SupportFilterNoDataPageProps = {
  config: SupportFilterNoDataPageConfig;
};

export default function SupportFilterNoDataPage({
  config,
}: SupportFilterNoDataPageProps) {
  const { variant, pageId, initialQuery } = config;

  return (
    <SupportFilterPageShell
      variant={variant}
      empty
      pageId={pageId}
      initialQuery={initialQuery}
    />
  );
}
