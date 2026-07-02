import type { CommonFaqEntry } from "@/components/faq/CommonFaq";

export const GICS_REQUEST_URL = "https://gics.ls-electric.com/public/index.do";

export const serviceCenterPage = {
  title: "Service Center",
  description:
    "Fast response, on-site expertise, and end-to-end service —built for North America.",
  cards: {
    knowledgeBase: {
      title: "Knowledge Base",
      description:
        "Browse technical documents, troubleshooting guides, manuals, and product resources for power distribution and energy solutions. Find answers quickly before submitting a support request.",
      links: [
        {
          id: "power",
          label: "Power Products",
          href: "https://gics.ls-electric.com/public/knowledgeBasePopup.do",
          external: true,
        },
        {
          id: "automation",
          label: "Automation Products",
          href: "https://sol.ls-electric.com/us/en/community/blog",
          external: true,
        },
      ],
    },
    items: [
      {
        id: "warranty",
        title: "Warranty Policy",
        description:
          "Review warranty coverage, terms, and support policies for LS ELECTRIC products. Learn what is covered and how to request warranty-related assistance.",
        icon: "/img/services/service-center/icon-warranty-policy.svg",
        href: "/services/warranty-policy",
        external: false,
      },
      {
        id: "request-service",
        title: "Request Service",
        description:
          "Need technical assistance that cannot be resolved through the Knowledge Base? Submit a service request and connect directly with our service specialists.",
        icon: "/img/services/service-center/icon-request-service.svg",
        href: GICS_REQUEST_URL,
        external: true,
      },
      {
        id: "training",
        title: "Training",
        description:
          "Enhance your product knowledge with instructor-led training programs.",
        icon: "/img/services/service-center/icon-training.svg",
        href: "/services/engineering-training",
        external: false,
      },
      {
        id: "download-center",
        title: "Download Center",
        description:
          "Find the latest manuals and technical documentation in one place.",
        icon: "/img/services/service-center/icon-download-center.svg",
        href: "/support/download-center",
        external: false,
      },
      {
        id: "tech-hub",
        title: "Tech Hub",
        description:
          "Explore how-to videos, troubleshooting guides, and technical tutorials.",
        icon: "/img/services/service-center/icon-tech-hub.svg",
        href: "/support/tech-hub",
        external: false,
      },
    ],
  },
  banner: {
    title: "Still Need Help?",
    description: "Contact our team for additional support and general inquiries.",
    ctaLabel: "Contact Us",
    ctaHref: "/support/contact-us",
    backgroundImage: "/img/services/service-center/help-01.jpg",
  },
  offering: {
    title: "Our Services",
    description:
      "Maximize Uptime, Improve Energy Efficiency, Ensure Operational Reliability.",
    slides: [
      {
        id: "offering-01",
        number: "01",
        title: "Lifecycle Service Support",
        titleLines: ["Lifecycle", "Service Support"],
        description:
          "Comprehensive support across commissioning, operation, and optimization to keep your power systems running at peak performance.",
        image: "/img/services/service-center/offering-01.jpg",
      },
      {
        id: "offering-02",
        number: "02",
        title: "Coordinated Claim Handling",
        titleLines: ["Coordinated", "Claim Handling"],
        description:
          "Our team provides guidance through remote assistance or direct consultation to ensure stable operation and minimize disruption.",
        image: "/img/services/service-center/offering-02.jpg",
      },
      {
        id: "offering-03",
        number: "03",
        title: "Preventive Maintenance",
        titleLines: ["Preventive", "Maintenance"],
        description:
          "Scheduled inspections and maintenance programs help prevent failures, extend equipment life, and reduce unplanned downtime.",
        image: "/img/services/service-center/offering-03.jpg",
      },
      {
        id: "offering-04",
        number: "04",
        title: "On-Site Field Service",
        titleLines: ["On-Site", "Field Service"],
        description:
          "Qualified field engineers deliver hands-on troubleshooting, repair, and replacement services wherever your operations are located.",
        image: "/img/services/service-center/offering-04.jpg",
      },
    ],
  },
  serviceFlow: {
    title: "Service Flow",
    description:
      "From initial request to final resolution—our coordinated service process keeps you informed at every step.",
    ctaLabel: "Request Service",
    ctaHref: GICS_REQUEST_URL,
    backgroundImage: "/img/main/bg_section_main_info.jpg",
    pathImage: "/img/services/service-center/service-flow-line.svg",
    icons: {
      pin: "/img/services/service-center/service-flow-icon-pin.svg",
      check: "/img/services/service-center/service-flow-icon-check.svg",
      checkEnd: "/img/services/service-center/service-flow-icon-check-end.svg",
      endDot: "/img/services/service-center/service-flow-icon-dot.svg",
    },
    steps: [
      {
        id: "issue",
        title: "Issue",
        subtitle: "Identify the problem",
        description: "Equipment issue identified on-site",
        icon: "pin" as const,
        iconPlacement: "top" as const,
      },
      {
        id: "request",
        title: "Request",
        subtitle: "Submit your request",
        descriptionLines: [
          "Contact via phone, email,",
          "or service portal",
        ],
        icon: "check" as const,
        iconPlacement: "top" as const,
      },
      {
        id: "assign",
        title: "Assign",
        subtitle: "Coordinated by LS ELECTRIC",
        description: "Qualified engineers assigned based on location",
        icon: "check" as const,
        iconPlacement: "top" as const,
      },
      {
        id: "support",
        title: "Support",
        subtitle: "On-site or remote support",
        description: "Technical troubleshooting and repair performed",
        icon: "check" as const,
        iconPlacement: "bottom" as const,
      },
      {
        id: "resolution",
        title: "Resolution",
        subtitle: "Resolution and reporting",
        description: "Issue resolved and system stabilized",
        icon: "checkEnd" as const,
        iconPlacement: "bottom" as const,
      },
    ],
  },
  gics: {
    title: "Service Platform",
    description:
      "A centralized digital service platform for managing all your service needs—anytime, anywhere.",
    ctaLabel: "Go to G-ICS",
    ctaHref: GICS_REQUEST_URL,
    image: "/img/services/service-center/g-ics-hero.jpg",
    imageAlt: "Technician using G-ICS on a tablet at an electrical control panel",
    features: [
      {
        id: "simpler",
        number: "1",
        title: "Simpler",
        subtitle: "Submit & Track Requests Easily",
        description:
          "Submit service requests and track their progress through a single, centralized system.",
      },
      {
        id: "faster",
        number: "2",
        title: "Faster",
        subtitle: "Get Faster, More Accurate Support",
        description:
          "Requests are routed to the appropriate experts based on your issue, location, and service needs.",
      },
      {
        id: "closer",
        number: "3",
        title: "Closer",
        subtitle: "Access Integrated Digital Resources",
        description:
          "View your service history and access relevant information to support ongoing operations.",
      },
    ],
  },
  help: {
    title: "Get the Support You Need, Fast",
    description:
      "Connect with our experts, configure your ideal system, and find the nearest partners—all in one place.",
    cards: [
      {
        id: "request-service",
        title: "Request Service & Support",
        description:
          "Submit a request for technical support, maintenance, or field service.",
        cta: "Request Service",
        ctaIcon: "arrow" as const,
        href: GICS_REQUEST_URL,
        external: true,
        image: "/img/services/service-center/help-01.jpg",
      },
      {
        id: "warranty",
        title: "Warranty & Coverage",
        description:
          "Submit a request for technical support, maintenance, or field service.",
        cta: "Check Warranty",
        ctaIcon: "link" as const,
        href: GICS_REQUEST_URL,
        external: true,
        image: "/img/services/service-center/help-02.jpg",
      },
      {
        id: "contact",
        title: "Contact Us",
        description:
          "Submit a request for technical support, maintenance, or field service.",
        cta: "Contact Us",
        ctaIcon: "link" as const,
        href: "/support/contact-us",
        external: false,
        image: "/img/services/service-center/help-03.jpg",
      },
    ],
  },
};

export const serviceCenterFaqDescriptionLines = [
  "Find quick answers to common questions about installation, troubleshooting, and maintenance.",
  "Our expert engineering team has curated these responses to help you optimize product performance.",
];

export const serviceCenterFaqItems: CommonFaqEntry[] = [
  {
    question: "How do I request service?",
    answer:
      "You can submit a service request through G-ICS, our online service portal, or contact your local LS ELECTRIC representative by phone or email. Include your product details, location, and a brief description of the issue to help us respond faster.",
  },
  {
    question: "What happens after I submit a request?",
    answer:
      "Once your request is received, our service team reviews the details, assigns a qualified engineer based on your location and equipment type, and coordinates on-site or remote support. You can track progress and updates through G-ICS.",
  },
  {
    question: "Is on-site support available in my area?",
    answer:
      "LS ELECTRIC provides on-site field service across North America through our regional service network. Availability depends on your location and service scope—contact us or submit a request to confirm coverage for your site.",
  },
];
