export type WarrantyFeatureCard = {
  id: string;
  number: string;
  titleLines: string[];
  icon: string;
};

export type WarrantyTableRow = {
  id: string;
  product: string;
  category: string;
  warranty: string;
  warrantyLines?: string[];
};

export type WarrantyApplyRow = {
  id: string;
  category: string;
  contact: string;
  contactHref: string;
};

const IMG = "/img/services/warranty-policy";

export const warrantyPolicyPage = {
  title: "Warranty Policy",
  description:
    "Check the warranty period for each LS ELECTRIC product by date of purchase or manufacture.",
  coverage: {
    title: "Warranty Coverage",
    cardsHeading: "Coverage may include:",
    cards: [
      {
        id: "coverage-01",
        number: "01",
        titleLines: ["Manufacturing", "defect support"],
        icon: `${IMG}/coverage-icon-01.svg`,
      },
      {
        id: "coverage-02",
        number: "02",
        titleLines: ["Technical troubleshooting"],
        icon: `${IMG}/coverage-icon-02.svg`,
      },
      {
        id: "coverage-03",
        number: "03",
        titleLines: ["Product", "repair services"],
        icon: `${IMG}/coverage-icon-03.svg`,
      },
      {
        id: "coverage-04",
        number: "04",
        titleLines: ["Replacement support for qualified defects"],
        icon: `${IMG}/coverage-icon-04.svg`,
      },
    ] satisfies WarrantyFeatureCard[],
    cardsFootnote:
      "*Detailed coverage conditions may differ by product and service agreement.",
    tableColumns: {
      product: "Products",
      category: "Product Category",
      warranty: "Warranty from Date of Purchase",
    },
    tableRows: [
      {
        id: "scada",
        product: "SCADA",
        category: "Automation",
        warranty: "99 years",
      },
      {
        id: "mv-fuse",
        product: "MV Fuse",
        category: "Automation",
        warranty: "99 years",
      },
      {
        id: "overload-relay",
        product: "Overload Relay",
        category: "Automation",
        warranty: "99 years",
      },
      {
        id: "rated-current",
        product: "Rated Current(In)",
        category: "Automation",
        warranty: "99 years",
      },
      {
        id: "motion-servo",
        product: "Motion & Servo",
        category: "Power Orders",
        warranty: "99 years",
      },
      {
        id: "ul891",
        product: "UL891 Switchboard",
        category: "Power Orders",
        warranty: "99 years",
      },
      {
        id: "ul1558",
        product: "UL1558 Switchgear",
        category: "Power Orders",
        warranty: "99 years",
      },
      {
        id: "mcb",
        product: "Miniature Circuit Breaker",
        category: "Power Production",
        warranty: "99 years",
      },
      {
        id: "gfci",
        product: "GFCI (Ground Fault Circuit Interrupter)",
        category: "Power Production",
        warranty: "99 years",
      },
      {
        id: "hvdc",
        product: "HVDC(High Voltage Direct Current Transmission System)",
        category: "Power Production",
        warranty: "",
        warrantyLines: [
          "Product Warranty 4.5 years",
          "(PID module) Output Warranty 9.5 years 91.5%, 24.5 years 83%",
          "(Standard module) Output Warranty 9.5 years 90%, 24.5 years 80%",
        ],
      },
    ] satisfies WarrantyTableRow[],
    notesTitle: "Notes & Conditions",
    notes: [
      "The warranty period for exported PLC, HMI, and INV products is two years from the date of manufacture.",
      "For domestic and international solar PCUs, the warranty period is 4.5 years from the date of purchase.\n(However, for 3kW products purchased before July 2012, the warranty is 2.5 years, and for products bound for Japan, the warranty is 3 years from the date of manufacture.)",
      "For other products not specified: the warranty is 1 year from the date of purchase or 1.5 years from the date of manufacture.",
      "Even within the warranty period, if the issue is caused by the customer's fault, the repair will be charged.",
      "Product quality is not guaranteed in the event of external factors such as fire, abnormal voltage, or natural disasters such as earthquakes, lightning strikes, or storms.",
    ],
  },
  banner: {
    title: "Warranty Support",
    description:
      "We're Here for You Our support team is happy to help with any warranty-related questions.",
    ctaLabel: "Contact Us",
    ctaHref: "/support/contact-us",
    backgroundImage: `${IMG}/banner-bg.jpg`,
  },
  extension: {
    title: "Warranty Extension Overview",
    description:
      "The Warranty Extension program allows customers to extend the standard product warranty period for eligible products and systems.",
    cardsHeading: "Extended warranty services may include:",
    cards: [
      {
        id: "extension-01",
        number: "01",
        titleLines: ["Technical", "support"],
        icon: `${IMG}/extension-icon-01.svg`,
      },
      {
        id: "extension-02",
        number: "02",
        titleLines: ["Product repair", "or replacement"],
        icon: `${IMG}/extension-icon-02.svg`,
      },
      {
        id: "extension-03",
        number: "03",
        titleLines: ["Maintenance-", "related support"],
        icon: `${IMG}/extension-icon-03.svg`,
      },
      {
        id: "extension-04",
        number: "04",
        titleLines: ["Certified service", "assistance"],
        icon: `${IMG}/extension-icon-04.svg`,
      },
    ] satisfies WarrantyFeatureCard[],
    cardsFootnote:
      "*Availability and coverage may vary depending on product type and installation conditions.",
    importantNotes: {
      title: "Important Notes",
      items: [
        "Warranty Extension availability is subject to product inspection and approval.",
        "Additional fees may apply depending on the requested extension period and product condition.",
        "Terms and conditions may vary by product category and region.",
      ],
    },
    exclusions: {
      title: "Exclusions",
      intro:
        "Warranty Extension does not apply under the following conditions:",
      items: [
        "Damage caused by natural disasters : Flood, Lightning, Fire, Earthquake, Storm or other force majeure",
      ],
      footnote:
        "*Additional exclusions may apply depending on product conditions and usage environments.",
    },
  },
  apply: {
    title: "How to Apply",
    description:
      "For Warranty Extension inquiries and application procedures, please contact the appropriate channel below based on your product category.",
    tableColumns: {
      category: "Product Category",
      contact: "Contact",
    },
    rows: [
      {
        id: "sales",
        category: "Sales Representative",
        contact: "sales.us@lselectricamerica.com",
        contactHref: "mailto:sales.us@lselectricamerica.com",
      },
      {
        id: "pd-solution",
        category: "PD Solution",
        contact: "pd.solution@lselectricamerica.com",
        contactHref: "mailto:pd.solution@lselectricamerica.com",
      },
      {
        id: "power-system",
        category: "Power System",
        contact: "powersystem.sales@lselectricamerica.com",
        contactHref: "mailto:powersystem.sales@lselectricamerica.com",
      },
      {
        id: "automation",
        category: "Automation and Control",
        contact: "automation_support.us@lselectricamerica.com",
        contactHref: "mailto:automation_support.us@lselectricamerica.com",
      },
    ] satisfies WarrantyApplyRow[],
  },
  numBadgeIcon: `${IMG}/card-num-badge.svg`,
};
