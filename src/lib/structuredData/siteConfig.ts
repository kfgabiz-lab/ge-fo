import { SITE_URL } from "@/lib/api";
import { CONNECT_PORTAL_EXTERNAL_URL } from "@/data/support/connectPortalContent";

export { SITE_URL, CONNECT_PORTAL_EXTERNAL_URL };

export const ORG_ID = `${SITE_URL}#organization`;
export const WEBSITE_ID = `${SITE_URL}#website`;

export const SITE_NAME = "LS ELECTRIC America";
export const ORG_LOGO_URL = `${SITE_URL}/img/logo.png`;

export const ORG_SAME_AS = [
  "https://www.linkedin.com/company/lselectricamerica",
  "https://www.youtube.com/@LSELECTRIC",
];

export const GICS_SUPPORT_URL = "https://gics.ls-electric.com/public/index.do";

export const ORG_ADDRESS = {
  "@type": "PostalAddress" as const,
  streetAddress: "625 Heathrow Dr",
  addressLocality: "Lincolnshire",
  addressRegion: "IL",
  postalCode: "60069",
  addressCountry: "US",
};

export const ORG_KNOWS_ABOUT = [
  "LV & MV Power Solutions",
  "Grid & Utility Infrastructure",
  "Automation & Industrial Control",
];

export const LS_ELECTRIC_PARENT_ORG = {
  "@type": "Organization",
  "@id": "https://www.ls-electric.com/#organization",
  name: "LS ELECTRIC",
  url: "https://www.ls-electric.com/",
};

export const SUB_ORGANIZATIONS = [
  {
    "@type": "Organization",
    "@id": `${SITE_URL}#org-bastrop`,
    name: "LS ELECTRIC America Bastrop Center",
    address: {
      "@type": "PostalAddress",
      streetAddress: "409 Technology Dr.",
      addressLocality: "Bastrop",
      addressRegion: "TX",
      postalCode: "78602",
      addressCountry: "US",
    },
  },
  {
    "@type": "Organization",
    "@id": `${SITE_URL}#org-western`,
    name: "LS ELECTRIC America Western Office",
    address: {
      "@type": "PostalAddress",
      streetAddress: "9647 Santa Fe Springs Rd.",
      addressLocality: "Santa Fe Springs",
      addressRegion: "CA",
      postalCode: "90670",
      addressCountry: "US",
    },
  },
  {
    "@type": "Organization",
    "@id": `${SITE_URL}#org-atlanta`,
    name: "LS ELECTRIC America Atlanta Office",
    address: {
      "@type": "PostalAddress",
      streetAddress: "3176 Main St. Suite 201",
      addressLocality: "Duluth",
      addressRegion: "GA",
      postalCode: "30096",
      addressCountry: "US",
    },
  },
  {
    "@type": "Organization",
    "@id": `${SITE_URL}#org-dallas`,
    name: "LS ELECTRIC America Dallas Office",
    address: {
      "@type": "PostalAddress",
      streetAddress: "320 Decker Dr.",
      addressLocality: "Irving",
      addressRegion: "TX",
      postalCode: "75062",
      addressCountry: "US",
    },
  },
  {
    "@type": "Organization",
    "@id": `${SITE_URL}#org-lseu`,
    name: "LS ELECTRIC Utah Inc.",
    address: {
      "@type": "PostalAddress",
      streetAddress: "655 E 4930 N",
      addressLocality: "Enoch",
      addressRegion: "UT",
      postalCode: "84721",
      addressCountry: "US",
    },
  },
  {
    "@type": "Organization",
    "@id": `${SITE_URL}#org-lses`,
    name: "LS Energy Solutions",
    address: {
      "@type": "PostalAddress",
      streetAddress: "9201 Forsyth Park Dr.",
      addressLocality: "Charlotte",
      addressRegion: "NC",
      postalCode: "28273",
      addressCountry: "US",
    },
  },
];

export const ORG_CREDENTIALS = [
  {
    "@type": "EducationalOccupationalCredential",
    "@id": `${SITE_URL}#esg-certifications`,
    credentialCategory: "certification",
    name: "ISO 9001",
    description:
      "The Quality Management System (ISO 9001) certification has been obtained for the Bastrop Campus.",
  },
  {
    "@type": "EducationalOccupationalCredential",
    "@id": `${SITE_URL}#isms-certifications`,
    credentialCategory: "certification",
    name: "ISO 27001",
    description:
      "The Information Security Management System (ISO 27001) certification has been obtained under the name of LS ELECTRIC America, Inc.",
  },
];
