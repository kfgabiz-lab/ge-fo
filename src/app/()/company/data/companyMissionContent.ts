const IMG = "/img/company/america";

export type CompanyMissionPillar = {
  id: string;
  title: string;
  description: string;
  icon: string;
};

export type CompanyCoreValue = {
  id: string;
  label: string;
  icon: string;
};

/** Figma 5885:143363 (PC emblem) · 5876:29969 (MO emblem) — America · LS ELECTRIC 공통 */
export const companyMission = {
  title: "Mission & Vision",
  description:
    "Innovating at the intersection of energy, automation, and digital intelligence.",
  bgImage: `${IMG}/mission-bg.png`,
  /** Figma 5885:150717 (MO wave bg) */
  bgImageMo: `${IMG}/mission-bg-mo.png`,
  /** Figma 5970:104376 — Futuring Smart Energy */
  missionLogo: `${IMG}/mission-logo.svg`,
  missionText:
    "LS ELECTRIC, which has been pioneering the power and automation industries for the past 40 years, now offers smart convergence solutions by combining ICT and DC technologies.",
  pillars: [
    {
      id: "futuring",
      title: "Futuring",
      description:
        "We are leading the way towards a New future through innovations that Exceed our customers' expectations",
      icon: `${IMG}/pillar-futuring.svg`,
    },
    {
      id: "smart",
      title: "Smart",
      description:
        "We are creating an efficient & convenient future through ICT convergence and technologies.",
      icon: `${IMG}/pillar-smart.svg`,
    },
    {
      id: "energy",
      title: "Energy",
      description:
        "We are creating an abundant future by delivering safe clean energy",
      icon: `${IMG}/pillar-energy.svg`,
    },
  ] satisfies CompanyMissionPillar[],
  coreValueLogo: `${IMG}/core-value-logo.png`,
  coreValueDesc: "Fundamental transformation for the growth era",
  coreValueArrow: `${IMG}/mission-arrow.png`,
  coreValuePlusIcon: `${IMG}/mission-value-plus.svg`,
  coreValues: [
    { id: "challenge", label: "Challenge", icon: `${IMG}/value-challenge.svg` },
    { id: "agility", label: "Agility", icon: `${IMG}/value-agility.svg` },
    { id: "excellence", label: "Excellence", icon: `${IMG}/value-excellence.svg` },
  ] satisfies CompanyCoreValue[],
  philosophyLabel: "Philosophy",
  philosophyEmblem: `${IMG}/philosophy-emblem.svg`,
  philosophyEmblemMo: `${IMG}/philosophy-emblem-mo.svg`,
};
