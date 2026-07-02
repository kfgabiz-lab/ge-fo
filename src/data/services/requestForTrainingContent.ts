const IMG = "/img/services/request-for-training";

export const requestForTrainingAssets = {
  stepBarBg: `${IMG}/step-bar-bg.png`,
  recaptcha: "/img/services/engineering-training/session-recaptcha.png",
} as const;

export const requestForTrainingPage = {
  title: "Request for Training",
  description:
    "We open up a brighter future through efficient and convenient energy solutions",
} as const;

export type RequestForTrainingStepNumber = 1 | 2 | 3 | 4;
export type RequestForTrainingStepStatus = "completed" | "active" | "upcoming";

const requestForTrainingStepDefinitions = [
  {
    id: "basic-information",
    stepLabel: "Step 1",
    title: "Basic Information",
    iconUpcoming: "/ico/ico_request_training_info_24.svg",
    iconActive: "/ico/ico_request_training_info_24.svg",
  },
  {
    id: "requested-dates",
    stepLabel: "Step 2",
    title: "Requested Date(s) of Training",
    iconUpcoming: "/ico/ico_request_training_calendar_24.svg",
    iconActive: "/ico/ico_request_training_calendar_active_24.svg",
  },
  {
    id: "class-location",
    stepLabel: "Step 3",
    title: "Training Class Location",
    iconUpcoming: "/ico/ico_request_training_location_24.svg",
    iconActive: "/ico/ico_request_training_location_active_24.svg",
  },
  {
    id: "class-details",
    stepLabel: "Step 4",
    title: "Training Class Details",
    iconUpcoming: "/ico/ico_request_training_file_24.svg",
    iconActive: "/ico/ico_request_training_file_active_24.svg",
  },
] as const;

export const requestForTrainingCheckIcon = "/ico/ico_request_training_check_16.svg";

export function getRequestForTrainingSteps(currentStep: RequestForTrainingStepNumber) {
  return requestForTrainingStepDefinitions.map((step, index) => {
    const stepNumber = (index + 1) as RequestForTrainingStepNumber;
    let status: RequestForTrainingStepStatus = "upcoming";
    if (stepNumber < currentStep) {
      status = "completed";
    } else if (stepNumber === currentStep) {
      status = "active";
    }

    const arrow =
      status === "active"
        ? "/ico/ico_request_training_arrow_active_24.svg"
        : "/ico/ico_request_training_arrow_24.svg";

    const icon =
      status === "completed"
        ? requestForTrainingCheckIcon
        : status === "active"
          ? step.iconActive
          : step.iconUpcoming;

    return {
      ...step,
      status,
      icon,
      arrow,
    };
  });
}

/** @deprecated Step 1 전용 — `getRequestForTrainingSteps(1)` 사용 권장 */
export const requestForTrainingSteps = getRequestForTrainingSteps(1);

export const requestForTrainingQuestionnaireCopy = {
  heading: "Training Questionnaire",
  description:
    "Simply answer the following questions as they relate to you. For most answers, check the boxes most applicable to you or fill in the blanks.",
} as const;

export const requestForTrainingNavCopy = {
  previousLabel: "Previous",
  nextLabel: "Next",
  submitLabel: "Send Message",
} as const;

export const requestForTrainingStep1Copy = {
  ...requestForTrainingQuestionnaireCopy,
  nextLabel: requestForTrainingNavCopy.nextLabel,
} as const;

export const requestForTrainingStep2Copy = {
  ...requestForTrainingQuestionnaireCopy,
  fields: {
    sessionCount: {
      label: "How many training sessions are you interested in holding?",
      required: true,
    },
    sessionDays: {
      label: "Each session will consist of how many days?",
      required: true,
    },
    scheduleDates: {
      label: "What date(s) would you like to schedule the training session(s)?",
      required: true,
      placeholder: "yyyy-mm-dd",
    },
    studentCount: {
      label: "How many students will be in attendance for each session?",
      hint: "(Maximum 18 per session)",
      required: true,
    },
  },
} as const;

export const requestForTrainingStep3Copy = {
  ...requestForTrainingQuestionnaireCopy,
  fields: {
    trainingFormat: {
      label: "Training Format",
      options: ["In-Person", "Virtual"] as const,
      required: true,
    },
    locationName: {
      label: "Where will the class be held? (Company or Location Name)",
      required: true,
    },
    streetAddress: {
      label: "Street Address",
      searchPlaceholder: "Keyword Search",
      address2Placeholder: "Address 2",
      required: true,
    },
    city: { label: "City", placeholder: "City" },
    state: { label: "State/Province", placeholder: "State/Province" },
    zip: { label: "ZIP / Postal Code", placeholder: "ZIP / Postal Code" },
    contactPerson: {
      label: "Contact Person at the class location:",
    },
    contactDetails: {
      label: "Contact Person's phone number and email address:",
      required: true,
    },
  },
} as const;

export type RequestForTrainingStep4Variant = "power" | "automation";

export const requestForTrainingStep4CategoryOptions = [
  {
    id: "power",
    label: "Power",
    subcategories: [
      {
        id: "lv-products",
        label: "LV Products and Systems",
        products: [
          "Air Circuit Breaker / Power Circuit Breaker",
          "Molded Case Circuit Breaker",
          "Miniature Circuit Breaker",
          "Surge Protective Device",
          "UL67 Panelboard",
          "Remote Power Panel",
          "UL891 Switchboard",
          "UL1558 Switchgear",
          "E House",
          "Magnetic Contactor",
          "Overload Relay",
          "Electronic Motor Protection Relay",
          "Manual Motor Starter",
          "Ground Fault Circuit Interrupter",
          "Other",
        ],
        defaultSelected: [
          "Air Circuit Breaker / Power Circuit Breaker",
          "Surge Protective Device",
          "E House",
        ],
      },
    ],
  },
  {
    id: "automation",
    label: "Automation",
    subcategories: [
      {
        id: "vfd",
        label: "Variable Frequency Drive",
        products: ["H100 Plus", "SP100", "G100", "M100", "S100", "iS7", "Other"],
        defaultSelected: ["H100 Plus", "SP100", "G100"],
      },
    ],
  },
] as const;

/** @deprecated `requestForTrainingStep4CategoryOptions` 사용 권장 */
export const requestForTrainingStep4ProductCatalog = {
  power: {
    category: "Power",
    subcategory: "LV Products and Systems",
    products: requestForTrainingStep4CategoryOptions[0].subcategories[0].products,
    defaultSelected: requestForTrainingStep4CategoryOptions[0].subcategories[0].defaultSelected,
  },
  automation: {
    category: "Automation",
    subcategory: "Variable Frequency Drive",
    products: requestForTrainingStep4CategoryOptions[1].subcategories[0].products,
    defaultSelected: requestForTrainingStep4CategoryOptions[1].subcategories[0].defaultSelected,
  },
} as const;

export const requestForTrainingStep4AutomationFields = {
  jobTitles: {
    label: "What are the job titles of the students that will be trained?",
    options: [
      "E & I Technician and/or Maintenance",
      "Mechanic",
      "Electrical Engineer",
      "Sales Engineer",
      "Inside Tech",
      "Field Service Enginee",
      "Other",
    ],
  },
  studentInvolvement: {
    label: "Are the students involved with any of the following?",
    options: [
      "Installation, Start-up",
      "Integration and Parameter setup",
      "Feld Troubleshooting (understanding fault codes)",
      "Sales and Explanation of the Product",
      "Serial communications",
      "Unit troubleshooting (to determine damaged components)",
      "Other",
    ],
  },
  vfdUnderstanding: {
    label: "Do the students have a basic understanding of variable frequency drives?",
    yesFollowUpOptions: [
      "Motor technology (construction, theory of operation)",
      "Drive technology (construction, theory of operation)",
      "DriveView Software",
      "PID Applications",
      "Auto-Tuning",
      "Other Topics",
    ],
  },
} as const;

export const requestForTrainingStep4Copy = {
  ...requestForTrainingQuestionnaireCopy,
  fields: {
    products: {
      label: "What products do you want training for?",
      hint: "*Select all that apply.",
      required: true,
    },
    comments: {
      label: "Comments/questions about certification",
      placeholder: "Please enter your comments/questions.",
    },
    consent: {
      label: "Consent to Collection and Use of Personal Information",
      termsHref: "/support/contact-us/terms",
      termsLabel: "View Full Terms",
    },
  },
} as const;

export const requestForTrainingTypeOptions = [
  { id: "engineering", label: "Engineering Training" },
  { id: "sales", label: "Sales Training" },
  { id: "service", label: "Service Training" },
] as const;

export const requestForTrainingSubtypeOptions = [
  "Engineering Training",
  "Sales Training",
  "Service Training",
] as const;

export const requestForTrainingRoutes = {
  step1: "/services/request-for-training",
  step2: "/services/request-for-training/step-2",
  step3: "/services/request-for-training/step-3",
  step4: "/services/request-for-training/step-4",
  step4Type01: "/services/request-for-training/step-4-type_01",
} as const;
