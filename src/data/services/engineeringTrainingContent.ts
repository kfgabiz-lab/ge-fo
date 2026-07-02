export type EngineeringTrainingCourse = {
  id: string;
  category: string;
  title: string;
  description: string;
  descriptionLines?: string[];
  image: string;
};

export type EngineeringTrainingFilterOption = {
  value: string;
  label: string;
};

export const engineeringTrainingCategoryOptions: EngineeringTrainingFilterOption[] =
  [
    { value: "all", label: "All" },
    { value: "automation", label: "Automation" },
    { value: "power", label: "Power" },
    { value: "energy", label: "Energy" },
    { value: "motion", label: "Motion" },
  ];

export const engineeringTrainingLvCategoryOptions: EngineeringTrainingFilterOption[] =
  [
    { value: "all", label: "All" },
    { value: "lv", label: "LV" },
    { value: "mv", label: "MV" },
    { value: "hv", label: "HV" },
  ];

export const engineeringTrainingSubCategoryOptions: EngineeringTrainingFilterOption[] =
  [
    { value: "all", label: "All" },
    { value: "breaker", label: "Breaker" },
    { value: "switchgear", label: "Switchgear" },
    { value: "transformer", label: "Transformer" },
    { value: "drive", label: "Drive" },
    { value: "plc", label: "PLC" },
    { value: "hmi", label: "HMI" },
  ];

const IMG = "/img/services/engineering-training";

const BREAKER_DESC =
  "comprehensive engineering training program covering LS ELECTRIC's full switchgear product lineup — from Medium Voltage (5kV to 38kV MCSG and LIS) to Low Voltage (UL1558, UL891, UL67) systems — building the technical competence engineers need to deliver customized, customer-oriented power distribution solutions.";

const SWITCHGEAR_DESC =
  "A comprehensive engineering training program covering LS ELECTRIC's full switchgear product lineup — from Medium Voltage (5kV to 38kV MCSG and LIS) to Low Voltage (UL1558, UL891, UL67) systems — building the technical competence engineers need to deliver customized, customer-oriented power distribution solutions.";

export const engineeringTrainingPage = {
  title: "Engineering Training",
  description:
    "Hands-on Engineering Training to Build Core Competencies in Power and Automation System Design and Operation",
  intro: {
    heroImage: `${IMG}/hero.jpg`,
    headline: "LS ELECTRIC Americas Engineering Training Program",
    description:
      "LS ELECTRIC's Americas Engineering Team offers a structured training program covering everything from the fundamental principles to practical applications of key components in electrical power systems.",
  },
  curriculum: {
    title: "Training curriculum",
    filters: {
      category: {
        label: "Category",
        defaultValue: engineeringTrainingCategoryOptions[0].value,
        options: engineeringTrainingCategoryOptions,
      },
      lvCategory: {
        label: "Lv Category",
        defaultValue: engineeringTrainingLvCategoryOptions[0].value,
        options: engineeringTrainingLvCategoryOptions,
      },
      subCategory: {
        label: "Sub Category",
        defaultValue: engineeringTrainingSubCategoryOptions[0].value,
        options: engineeringTrainingSubCategoryOptions,
      },
      searchPlaceholder: "Search",
    },
    pageSize: 5,
    totalPages: 5,
    courses: [
      {
        id: "breaker-training",
        category: "AUTOMATION",
        title: "Hands-on Breaker Training: MCCB · ACB · VCB",
        description: BREAKER_DESC,
        image: `${IMG}/course-01.jpg`,
      },
      {
        id: "transformer-fundamentals",
        category: "POWER",
        title: "Transformer Fundamentals and Design",
        descriptionLines: [
          "This course covers transformer fundamentals, HV product specifications, pad-mounted and cast resin transformer types,",
          "design features, and manufacturing & inspection processes.",
        ],
        description: "",
        image: `${IMG}/course-02.jpg`,
      },
      {
        id: "protective-measuring",
        category: "POWER",
        title: "Protective and Measuring Devices",
        descriptionLines: [
          "A comprehensive engineering training covering everything from transformer fundamentals to LS ELECTRIC's HV, pad-mounted,",
          "and cast resin transformer product specifications, design features, and manufacturing and inspection processes.",
        ],
        description: "",
        image: `${IMG}/course-03.jpg`,
      },
      {
        id: "switchgear",
        category: "POWER",
        title: "Switchgear",
        description: SWITCHGEAR_DESC,
        image: `${IMG}/course-04.jpg`,
      },
      {
        id: "switchgear-communication",
        category: "POWER",
        title: "Switchgear Communication Structure",
        description: SWITCHGEAR_DESC,
        image: `${IMG}/course-05.jpg`,
      },
      {
        id: "breaker-training-2",
        category: "POWER",
        title: "Hands-on Breaker Training: MCCB · ACB · VCB",
        description: BREAKER_DESC,
        image: `${IMG}/course-01.jpg`,
      },
      {
        id: "transformer-fundamentals-2",
        category: "POWER",
        title: "Transformer Fundamentals and Design",
        descriptionLines: [
          "This course covers transformer fundamentals, HV product specifications, pad-mounted and cast resin transformer types,",
          "design features, and manufacturing & inspection processes.",
        ],
        description: "",
        image: `${IMG}/course-02.jpg`,
      },
      {
        id: "protective-measuring-2",
        category: "POWER",
        title: "Protective and Measuring Devices",
        descriptionLines: [
          "A comprehensive engineering training covering everything from transformer fundamentals to LS ELECTRIC's HV, pad-mounted,",
          "and cast resin transformer product specifications, design features, and manufacturing and inspection processes.",
        ],
        description: "",
        image: `${IMG}/course-03.jpg`,
      },
      {
        id: "switchgear-2",
        category: "POWER",
        title: "Switchgear",
        description: SWITCHGEAR_DESC,
        image: `${IMG}/course-04.jpg`,
      },
      {
        id: "switchgear-communication-2",
        category: "POWER",
        title: "Switchgear Communication Structure",
        description: SWITCHGEAR_DESC,
        image: `${IMG}/course-05.jpg`,
      },
    ] satisfies EngineeringTrainingCourse[],
  },
};
