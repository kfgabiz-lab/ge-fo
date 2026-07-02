const IMG = "/img/company/careers";

export const careersPageTitle = {
  title: "Careers at LS ELECTRIC America",
  description:
    "We're looking for exceptional talent to grow and dream together with LS ELECTRIC.",
} as const;

export const careersLinkedInCta = {
  label: "Go to LinkedIn",
  href: "https://www.linkedin.com/company/lselectricamerica/jobs/",
} as const;

export const careersJobsSection = {
  title: "Job Description",
  backgroundImage: `${IMG}/jobs-bg.png`,
} as const;

export type CareersJob = {
  id: string;
  title: string;
  duties: readonly string[];
};

export const careersJobs: readonly CareersJob[] = [
  {
    id: "field-services-engineer",
    title: "Field Services Engineer",
    duties: [
      "Commission, inspect, repair, and maintain LV/MV electrical distribution equipment",
      "Provide technical support to customers for installation and troubleshooting",
      "Diagnose issues related to switchgear, transformers, and protective relays",
      "Prepare field service reports and communicate updates to HQ",
      "Travel domestically and internationally (~40% travel)",
    ],
  },
  {
    id: "human-resources-generalist",
    title: "Human Resources Generalist",
    duties: [
      "Manage full-cycle recruitment process",
      "Conduct onboarding for new employees",
      "Administer payroll & benefits",
      "Implement and operate HR policies",
      "Manage job boards, LinkedIn, referrals, and other recruiting channels",
    ],
  },
  {
    id: "it-systems-analyst",
    title: "IT Systems Analyst",
    duties: [
      "Operate and support enterprise systems (ERP, HR systems)",
      "Collaborate with global IT team and external vendors",
      "Conduct user training and documentation, Assist with system testing",
      "Provide end-user IT support",
    ],
  },
  {
    id: "order-processing-specialist",
    title: "Order Processing Specialist",
    duties: [
      "Enter and validate sales orders",
      "Coordinate with logistics and finance teams",
      "Manage RMA (return) process",
      "Maintain ERP/CRM data (SAP, Oracle, NetSuite)",
    ],
  },
] as const;

export const careersLinkedInBanner = {
  backgroundImage: `${IMG}/linkedin-banner.jpg`,
  title: "Explore Open Positions on LinkedIn",
  description: [
    "Discover your next career opportunity with LS ELECTRIC America.",
    "Visit our official LinkedIn page to view all current job openings, explore our company culture, and apply to join our team of industry innovators.",
  ],
  cta: careersLinkedInCta,
} as const;
