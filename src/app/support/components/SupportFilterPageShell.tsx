import type { ComponentType } from "react";
import DownloadCenterContents from "@/app/support/download-center/components/DownloadCenterContents";
import { DownloadCenterFilterProvider } from "@/app/support/download-center/components/DownloadCenterFilterProvider";
import DownloadCenterMobileControls from "@/app/support/download-center/components/DownloadCenterMobileControls";
import DownloadCenterSearch from "@/app/support/download-center/components/DownloadCenterSearch";
import DownloadCenterTitle from "@/app/support/download-center/components/DownloadCenterTitle";
import TechHubContents from "@/app/support/tech-hub/components/TechHubContents";
import { TechHubFilterProvider } from "@/app/support/tech-hub/components/TechHubFilterProvider";
import TechHubMobileControls from "@/app/support/tech-hub/components/TechHubMobileControls";
import TechHubSearch from "@/app/support/tech-hub/components/TechHubSearch";
import TechHubTitle from "@/app/support/tech-hub/components/TechHubTitle";
import "@/assets/css/devices-product-detail.css";
import "@/assets/css/support.css";

export type SupportFilterPageVariant = "download-center" | "tech-hub";

type SearchProps = { initialQuery?: string };
type ContentsProps = { empty?: boolean };

type SupportFilterPageParts = {
  pageClass: string;
  Title: ComponentType;
  Search: ComponentType<SearchProps>;
  MobileControls: ComponentType;
  Contents: ComponentType<ContentsProps>;
};

const supportFilterPageParts: Record<SupportFilterPageVariant, SupportFilterPageParts> =
  {
    "download-center": {
      pageClass: "support-page--download-center",
      Title: DownloadCenterTitle,
      Search: DownloadCenterSearch,
      MobileControls: DownloadCenterMobileControls,
      Contents: DownloadCenterContents,
    },
    "tech-hub": {
      pageClass: "support-page--tech-hub",
      Title: TechHubTitle,
      Search: TechHubSearch,
      MobileControls: TechHubMobileControls,
      Contents: TechHubContents,
    },
  };

export type SupportFilterPageShellProps = {
  variant: SupportFilterPageVariant;
  empty?: boolean;
  pageId: string;
  initialQuery?: string;
};

export default function SupportFilterPageShell({
  variant,
  empty = false,
  pageId,
  initialQuery = "",
}: SupportFilterPageShellProps) {
  const { pageClass, Title, Search, MobileControls, Contents } =
    supportFilterPageParts[variant];

  const page = (
    <main className={`support-page ${pageClass}`} id={pageId}>
      <Title />
      <Search initialQuery={initialQuery} />
      <MobileControls />
      <Contents empty={empty} />
    </main>
  );

  if (variant === "download-center") {
    return (
      <DownloadCenterFilterProvider>{page}</DownloadCenterFilterProvider>
    );
  }

  return <TechHubFilterProvider>{page}</TechHubFilterProvider>;
}
