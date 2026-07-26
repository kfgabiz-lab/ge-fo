// Services — Training Request(Step 1~4) 정적 카피/에셋. ls-publish 원본(src/data/services/requestForTrainingContent.ts) 이관.
// fo 는 퍼블리싱의 `/pub` 프리픽스를 사용하지 않으므로 에셋 경로만 `/img`, `/ico` 로 보정.
const IMG = "/img/services/request-for-training";

export const requestForTrainingAssets = {
  stepBarBg: `${IMG}/step-bar-bg.png`,
  recaptcha: "/img/services/engineering-training/session-recaptcha.png",
} as const;

export const requestForTrainingPage = {
  title: "Training Request",
  description:
    "The skills you build today ensure tomorrow's success. Request your training today.",
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
  fields: {
    trainingTrack: {
      label: "Training Track",
      required: true,
    },
    firstName: { label: "First Name", placeholder: "First Name", required: true },
    lastName: { label: "Last Name", placeholder: "Last Name" },
    company: { label: "Company", placeholder: "Company", required: true },
    streetAddress: {
      label: "Street Address",
      searchPlaceholder: "Keyword Search",
      address2Placeholder: "Address 2",
      required: true,
    },
    city: { label: "City", placeholder: "City", required: true },
    state: { label: "State/Province", placeholder: "State/Province", required: true },
    zip: { label: "ZIP / Postal Code", placeholder: "ZIP / Postal Code", required: true },
    phone: { label: "Phone", placeholder: "Phone", required: true },
    // 기획서(traning_req1.png) 기준 추가 — ZIP/Phone 줄 다음, Cell Phone/Sales Contact 줄 앞에 배치
    email: { label: "Email Address", placeholder: "Email Address", required: true },
    title: { label: "Title", placeholder: "Title" },
    cellPhone: { label: "Cell Phone", placeholder: "Cell Phone" },
    salesContact: { label: "Sales Contact", placeholder: "Sales Contact" },
  },
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
      label: "Training Type",
      options: ["In-Person", "Virtual"] as const,
      required: true,
    },
    locationName: {
      label: "Where will the class be held? (Company or Location Name)",
      required: true,
    },
    // 기획서(traning_req3dc.png) 기준 — 원본은 required:true였으나 선택 항목으로 확정.
    streetAddress: {
      label: "Street Address",
      searchPlaceholder: "Keyword Search",
      address2Placeholder: "Address 2",
      required: false,
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

// 기획서(traning_req4dc.png) item1~2 — 제품선택 + VFD 조건부 질문 필드 카피.
// comments/consent 등 나머지 필드는 해당 서브STEP 승인 후 추가한다.
// jobTitles/studentInvolvement/vfdUnderstanding 옵션 텍스트는 ls-publish 원본 그대로(정적, DB 연동 없음).
export const requestForTrainingStep4Copy = {
  ...requestForTrainingQuestionnaireCopy,
  fields: {
    products: {
      label: "What products do you want training for?",
      hint: "*Select all that apply.",
      required: true,
    },
    // 아래 3개는 Variable Frequency Drive 제품을 고른 경우에만 노출된다.
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
      required: true,
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
      required: true,
    },
    vfdUnderstanding: {
      label: "Do the students have a basic understanding of variable frequency drives?",
      required: true,
      // Yes 를 고른 경우에만 추가로 노출되는 하위 체크박스 옵션
      yesFollowUpOptions: [
        "Motor technology (construction, theory of operation)",
        "Drive technology (construction, theory of operation)",
        "DriveView Software",
        "PID Applications",
        "Auto-Tuning",
        "Other Topics",
      ],
    },
  },
} as const;

export const requestForTrainingTypeOptions = [
  { id: "engineering", label: "Engineering Training" },
  { id: "sales", label: "Sales Training" },
  { id: "service", label: "Service Training" },
] as const;

// Step2~4 페이지는 아직 미개발 — 경로 상수만 선정의(Step1 Next 이동 대상은 step2).
export const requestForTrainingRoutes = {
  step1: "/services/request-for-training",
  step2: "/services/request-for-training/step-2",
  step3: "/services/request-for-training/step-3",
  step4: "/services/request-for-training/step-4",
} as const;
