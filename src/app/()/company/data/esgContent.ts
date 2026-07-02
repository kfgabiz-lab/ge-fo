const IMG = "/img/company/esg";

export const esgPageTitle = {
  title: "ESG",
  description: "Driving sustainable growth through responsible innovation and ESG leadership.",
};

export const esgIntro = {
  heroImage: `${IMG}/hero.jpg`,
  headlineLines: ["ESG Driving Strategy"],
  paragraphs: [
    "LS ELECTRIC America, Inc. has established its ESG vision, “Sustainable Future with Green Energy Solution,” to become a global leader driving sustainable growth and the future of smart energy. Under this ESG vision, we are committed to building a sustainable future through our core principles of Reduce Carbon Emissions, Respect Society, and Responsible Business.",
  ],
  cta: {
    label: "Visit LSE ESG",
    href: "https://www.ls-electric.com/esg",
  },
};

export const esgVision = {
  backgroundImage: `${IMG}/vision-bg.jpg`,
  missionImage: `${IMG}/mission.png`,
  arrowImage: `${IMG}/arrow.png`,
  visionEmblemImage: `${IMG}/vision-emblem.png`,
  managementVisionImage: `${IMG}/esg-management-vision.png`,
  directivityCards: [
    {
      id: "reduce-carbon",
      iconImage: `${IMG}/icon-reduce-carbon.svg`,
      titleLines: ["Reduce", "Carbon Emissions"],
    },
    {
      id: "respect-society",
      iconImage: `${IMG}/icon-respect-society.svg`,
      titleLines: ["Respect Society"],
    },
    {
      id: "responsible-business",
      iconImage: `${IMG}/icon-responsible-business.svg`,
      titleLines: ["Responsible", "Business"],
    },
  ],
};

export type EsgRoadmapPhaseItem = {
  text: string;
  subItems?: string[];
};

export type EsgRoadmapPhase = {
  id: string;
  phaseLabel: string;
  title: string;
  lineProgressHeight: number;
  items: EsgRoadmapPhaseItem[];
};

export const esgClimate = {
  titleLines: ["Climate Change Response", "- 2040 Carbon Neutrality"],
  description:
    "To take part actively in the climate change response, LS ELECTRIC aims to achieve carbon neutrality in relation to Scope 1 and Scope 2 emissions by 2040. According to our business’s characteristic of having a higher rate of Scope 2 emissions, we plan to strengthen our renewable energy sourcing capacity and continuously monitor the carbon neutrality promotion status.",
  roadmapTitle: "Roadmap for Achieving Carbon Neutrality",
  roadmapBodyImage: `${IMG}/roadmap-body.svg`,
  roadmapBodyAlt:
    "Roadmap for achieving carbon neutrality: Phase 1 (2022–2025) build the foundation, Phase 2 (2026–2035) implement decarbonization strategies, Phase 3 (2036–2040) achieve carbon neutrality",
  roadmapPhases: [
    {
      id: "phase-1",
      phaseLabel: "Phase 1 (2022–2025)",
      title: "Build the foundation for carbon neutrality",
      lineProgressHeight: 74,
      items: [
        {
          text: "Establish a carbon neutrality promotion framework",
          subItems: ["Establish short-, medium-, and long-term roadmaps"],
        },
        {
          text: "Join RE100 and take action",
          subItems: [
            "Build self-generation facilities and purchase RECs to transition to renewable energy",
          ],
        },
        {
          text: "Energy saving activities",
          subItems: [
            "Operate a process/line-specific real-time power monitoring system for energy efficiency",
          ],
        },
      ],
    },
    {
      id: "phase-2",
      phaseLabel: "Phase 2 (2026–2035)",
      title: "Implement decarbonization strategies",
      lineProgressHeight: 163,
      items: [
        {
          text: "Expand renewable energy sourcing",
          subItems: ["Invest in new solar power generation facilities and sign PPAs"],
        },
      ],
    },
    {
      id: "phase-3",
      phaseLabel: "Phase 3 (2036–2040)",
      title: "Achieve carbon neutrality",
      lineProgressHeight: 44,
      items: [
        {
          text: "Achieving RE100 and carbon neutrality",
        },
      ],
    },
  ] satisfies EsgRoadmapPhase[],
};

export type EsgPolicyItem = {
  id: string;
  name: string;
  standard: string;
  downloadHref: string;
};

export const esgPolicies = {
  title: "Policies & Certifications",
  description:
    "The Quality Management System (ISO 9001) certification has been obtained for the Bastrop Campus, while the Information Security Management System (ISO 27001) certification has been obtained under the name of LS ELECTRIC America, Inc.",
  items: [
    {
      id: "iso-9001",
      name: "Quality Management System",
      standard: "ISO 9001",
      downloadHref: "#",
    },
    {
      id: "iso-27001",
      name: "Information Security Management System",
      standard: "ISO 27001",
      downloadHref: "#",
    },
  ] satisfies EsgPolicyItem[],
};
