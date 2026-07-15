import { buildSearchAllHref } from "@/data/search/searchAllContent";
import { downloadCenterPage } from "@/data/support/downloadCenterContent";
import { GICS_REQUEST_URL } from "@/data/services/serviceCenterContent";

export type NotFoundHelpfulLink = {
  id: string;
  label: string;
  href: string;
  iconSrc: string;
  external?: boolean;
};

/** Figma 7334:130743 — P-FO-COMMON-010000P · 404 Not found */
export const notFoundPage = {
  title: "We couldn't connect you to that page.",
  description:
    "It seems the link is broken or the content has moved. Don't worry, we're here to help you get back on track.",
  breadcrumbCurrent: "404 Not found",
  searchPlaceholder: downloadCenterPage.searchPlaceholder,
  popularKeywordsLabel: "Popular Keywords :",
  popularKeywords: downloadCenterPage.popularTags,
  helpfulLinksTitle: "Helpful Links",
  helpfulLinks: [
    {
      id: "home",
      label: "Return to Homepage",
      href: "/main",
      iconSrc: "/ico/ico_404_home_80.svg",
    },
    {
      id: "download",
      label: "Visit Download Center",
      href: "/support/download-center",
      iconSrc: "/ico/ico_404_download_80.svg",
    },
    {
      id: "contact",
      label: "Contact Us",
      href: "/support/contact-us",
      iconSrc: "/ico/ico_404_contact_80.svg",
    },
    {
      id: "request",
      label: "Request for Service",
      href: GICS_REQUEST_URL,
      iconSrc: "/ico/ico_404_request_80.svg",
      external: true,
    },
  ] satisfies NotFoundHelpfulLink[],
} as const;

export function buildNotFoundSearchHref(query: string) {
  return buildSearchAllHref(query);
}
