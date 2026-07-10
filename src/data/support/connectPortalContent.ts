export const CONNECT_PORTAL_EXTERNAL_URL = "https://connect.ls-electric.com/";

export const connectPortalPage = {
  title: "Connect Portal",
  description:
    "An all-in-one eSales platform for product discovery, ordering, shipping, and customer inquiries.",
  video: {
    /** Figma 3670:31186 — LS ELECTRIC MCCB Line Introduction (ENG) */
    youtubeVideoId: "73F6r_x5J2Y",
    poster: "/img/support/connect-portal/hero-video.jpg",
    title: "Connect Portal — Main Page Overview",
    headingLines: ["Your next order", "starts here."],
    mobileHeadingLine: "Your next order starts here.",
    text: "Connect Portal is available to all LS ELECTRIC America customers. Search products, place orders, track shipments, and manage quotes — all from one place.",
    ctaLabel: "Go to Connect Portal",
    ctaHref: CONNECT_PORTAL_EXTERNAL_URL,
  },
  featuresIntro: {
    titleLines: [
      "Everything your",
      "procurement team needs",
      "all in one streamlined portal.",
    ],
    mobileTitleLines: [
      "Everything your",
      "procurement team needs all in one streamlined portal.",
    ],
    text: "Connect Portal simplifies your purchasing experience with easy access to product search, online ordering, shipment tracking, and project quote management - all from one convenient platform",
  },
  featuresBg: {
    pc: "/img/support/connect-portal/bg_section_support.jpg",
    mobile: "/img/main/bg_section_main_info_mo.png",
  },
  featureCards: [
    {
      id: "online-ordering",
      title: "Online Ordering",
      description: "Place purchase orders 24/7",
      icon: "/img/support/connect-portal/icon-online-ordering.svg",
    },
    {
      id: "project-quotation",
      title: "Project Quotation",
      description: "RFQ submission, tracking & communication",
      icon: "/img/support/connect-portal/icon-project-quote.svg",
    },
    {
      id: "unified-search",
      title: "Unified Search",
      description: "Products, docs & info — all in one place",
      icon: "/img/support/connect-portal/icon-unified-search.svg",
    },
    {
      id: "order-tracking",
      title: "Order Tracking",
      description: "View orders, status & delivery dates instantly",
      icon: "/img/support/connect-portal/icon-order-tracking.svg",
    },
  ],
  detailSections: [
    {
      id: "search",
      titleLines: [
        "Locate the right product, item code,",
        "and pricing — without waiting on your",
        "sales rep.",
      ],
      description:
        "Connect Portal simplifies your purchasing experience with easy access to product search, online ordering, shipment tracking, and project quote management - all from one convenient platform",
      bullets: [
        "Unified keyword search across products and documents",
        "Spec-based product configurator — view item codes & pricing instantly",
      ],
      image: "/img/support/connect-portal/detail-search.webp",
      imageAlt: "Global search interface in Connect Portal",
      reverse: false,
    },
    {
      id: "order",
      titleLines: [
        "Full order visibility from purchase order",
        "submission through delivery.",
      ],
      description:
        "Submit purchase orders directly through the portal and track progress in real time. From order placement to shipment and delivery, status updates are available anytime through one convenient platform.",
      bullets: [
        "Submit purchase orders directly through the portal",
        "Shipping confirmation and carrier tracking number accessible in the portal",
      ],
      image: "/img/support/connect-portal/detail-order-flow.webp",
      imageAlt: "Order status flow in Connect Portal",
      reverse: true,
    },
    {
      id: "quotes",
      title: "Submit, track, and manage project quotes in one place.",
      description:
        "Streamline project collaboration by submitting RFQs, sharing supporting files, and tracking review progress in one connected workspace for your team and LS ELECTRIC America representatives.",
      bullets: [
        "Submit RFQs with project details, specifications, and supporting file attachments",
        "Track RFQ progress in real time — from submission to quote complete",
      ],
      image: "/img/support/connect-portal/detail-quotes.webp",
      imageAlt: "Project quote management in Connect Portal",
      reverse: false,
    },
  ],
} as const;
