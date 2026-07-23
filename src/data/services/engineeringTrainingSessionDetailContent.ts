import type { TrainingVariant } from "@/app/services/training/data/trainingContent";

export type EngineeringTrainingAgendaRow = {
  id: string;
  number: string;
  time: string;
  title: string;
  description?: string;
  trainer?: string;
};

export type EngineeringTrainingSessionEvent = {
  title: string;
  startIso: string; // 세션 원본 날짜("YYYY-MM-DD")
  timeFrom?: string; // "HH:MM"
  timeTo?: string; // "HH:MM"
  location?: string;
  description?: string;
};

export type EngineeringTrainingSessionDetail = {
  courseId: string;
  sessionId: string;
  category: string;
  title: string;
  breadcrumbCurrent: string;
  // 세션 본문(BO 관리자 WYSIWYG HTML, curriculum_detail2.content). 빈 문자열이면 본문 섹션/탭 비노출.
  content: string;
  agenda: EngineeringTrainingAgendaRow[];
  // Agenda Trainer 컬럼 노출 여부(모든 행 trainer 빈값이면 false → 컬럼 전체 비노출). 뷰모델에서 계산.
  showTrainerColumn: boolean;
  positionOptions: string[];
  calendar: {
    googleLabel: string;
    icalLabel: string;
  };
  // Add to Calendar(Google/iCal) 생성용 원본 이벤트 데이터(뷰모델에서 주입)
  event?: EngineeringTrainingSessionEvent;
  // 카운트다운 기준(curriculum_detail2.register_period_to, 원본 문자열)
  countdownTo?: string;
  sidebar: {
    date: string;
    eventDateToAttend: string;
    duration: string;
    classSize: string;
    location: {
      name: string;
      address: string;
      phone: string;
      email: string;
    };
    productsCovered: string;
    trainingType: string;
    registerLabel: string;
  };
};

const AGENDA_INTRO =
  "Introducing LS ELECTRIC, a global electrical solutions provider and electrical component manufacturer of UL, ANSI, and IEC products.";

const SHARED_AGENDA: EngineeringTrainingAgendaRow[] = [
  {
    id: "agenda-01",
    number: "1",
    time: "09:10~09:30",
    title: "LS ELECTRIC Introduction",
    description: AGENDA_INTRO,
    trainer: "Byron Black",
  },
  {
    id: "agenda-02",
    number: "2",
    time: "09:30~10:45",
    title: "MV, LV BREAKER: VCB, ACB, MCCB",
    description: AGENDA_INTRO,
    trainer: "Byron Black",
  },
  {
    id: "agenda-03",
    number: "3",
    time: "10:45~12:00",
    title: "MV, LV SWITCH GEAR",
    description: AGENDA_INTRO,
    trainer: "Clarke Arnold",
  },
  {
    id: "agenda-04",
    number: "4",
    time: "12:00~13:00",
    title: "Lunch Time",
  },
  {
    id: "agenda-05",
    number: "5",
    time: "13:00~14:00",
    title: "CAST RESIN TRANSFORMER",
    description: AGENDA_INTRO,
    trainer: "Clarke Arnold",
  },
  {
    id: "agenda-06",
    number: "6",
    time: "14:00~14:20",
    title: "Factory Line Tour",
    description: AGENDA_INTRO,
    trainer: "Clarke Arnold",
  },
  {
    id: "agenda-07",
    number: "7",
    time: "14:20~15:00",
    title: "Circuit breaker & SWGR handling practice",
    description: AGENDA_INTRO,
    trainer: "Byron Black",
  },
];

const SHARED_SIDEBAR_LOCATION = {
  name: "LS ELECTRIC America Lincolnshire",
  address: "625 Heathrow Dr, Lincolnshire IL 60069, USA",
  phone: "800-891-2941",
  email: "automation_support.us@lselectricamerica.com",
};

const SHARED_PRODUCTS =
  "Miniature Circuit Breaker, Molded Case Circuit Breaker, Air Circuit Breaker, Vacuum Circuit Breaker";

const SESSION_TITLE = "Hands-on Breaker Training: MCCB · ACB · VCB";

export const engineeringTrainingSessionDetails: Record<
  string,
  EngineeringTrainingSessionDetail
> = {
  "breaker-training/jan-10-2026": {
    courseId: "breaker-training",
    sessionId: "jan-10-2026",
    category: "POWER",
    title: SESSION_TITLE,
    breadcrumbCurrent: "Jan 10, 2026",
    content: "",
    agenda: SHARED_AGENDA,
    showTrainerColumn: true,
    positionOptions: ["Rep", "Engineer", "Manager", "Other"],
    calendar: {
      googleLabel: "Google Calender",
      icalLabel: "iCal / Outlook",
    },
    sidebar: {
      date: "Jan 10, 2026",
      eventDateToAttend: "01/10/26",
      duration: "12 Hours",
      classSize: "1-20",
      location: SHARED_SIDEBAR_LOCATION,
      productsCovered: SHARED_PRODUCTS,
      trainingType: "In-Person",
      registerLabel: "REGISTER",
    },
  },
  "breaker-training/mar-12-2026": {
    courseId: "breaker-training",
    sessionId: "mar-12-2026",
    category: "POWER",
    title: SESSION_TITLE,
    breadcrumbCurrent: "Mar 12, 2026",
    content: "",
    agenda: SHARED_AGENDA,
    showTrainerColumn: true,
    positionOptions: ["Rep", "Engineer", "Manager", "Other"],
    calendar: {
      googleLabel: "Google Calender",
      icalLabel: "iCal / Outlook",
    },
    sidebar: {
      date: "Mar 12, 2026",
      eventDateToAttend: "03/12/26",
      duration: "12 Hours",
      classSize: "1-20",
      location: SHARED_SIDEBAR_LOCATION,
      productsCovered: SHARED_PRODUCTS,
      trainingType: "In-Person",
      registerLabel: "REGISTER",
    },
  },
  "breaker-training/jul-14-2026": {
    courseId: "breaker-training",
    sessionId: "jul-14-2026",
    category: "POWER",
    title: SESSION_TITLE,
    breadcrumbCurrent: "Jul 14, 2026",
    content: "",
    agenda: SHARED_AGENDA,
    showTrainerColumn: true,
    positionOptions: ["Rep", "Engineer", "Manager", "Other"],
    calendar: {
      googleLabel: "Google Calender",
      icalLabel: "iCal / Outlook",
    },
    sidebar: {
      date: "Jul 14, 2026",
      eventDateToAttend: "07/14/26",
      duration: "6 Hours",
      classSize: "1-20",
      location: SHARED_SIDEBAR_LOCATION,
      productsCovered: SHARED_PRODUCTS,
      trainingType: "In-Person",
      registerLabel: "REGISTER",
    },
  },
  "breaker-training/dec-8-2026": {
    courseId: "breaker-training",
    sessionId: "dec-8-2026",
    category: "POWER",
    title: SESSION_TITLE,
    breadcrumbCurrent: "Dec 8, 2026",
    content: "",
    agenda: SHARED_AGENDA,
    showTrainerColumn: true,
    positionOptions: ["Rep", "Engineer", "Manager", "Other"],
    calendar: {
      googleLabel: "Google Calender",
      icalLabel: "iCal / Outlook",
    },
    sidebar: {
      date: "Dec 8, 2026",
      eventDateToAttend: "12/08/26",
      duration: "12 Hours",
      classSize: "1-20",
      location: SHARED_SIDEBAR_LOCATION,
      productsCovered: SHARED_PRODUCTS,
      trainingType: "In-Person",
      registerLabel: "REGISTER",
    },
  },
};

const IMG = "/img/services/engineering-training";
const ICO = "/ico";

export const engineeringTrainingSessionCountdownDisplay = {
  days: 365,
  hours: 24,
  minutes: 60,
  seconds: 60,
} as const;

export const engineeringTrainingSessionAssets = {
  countdownBg: `${IMG}/session-countdown-bg.jpg`,
  recaptcha: `${IMG}/session-recaptcha.png`,
  registerScrollIcon: `${ICO}/ico_scrto_18.svg`,
  calendarIcons: {
    google: `${ICO}/ico_google_18.svg`,
    ical: `${ICO}/ico_calendar_18.svg`,
  },
  metaIcons: {
    date: `${ICO}/ico_training_date_18.svg`,
    duration: `${ICO}/ico_training_duration_18.svg`,
    trainingType: `${ICO}/ico_training_type_20.svg`,
    classSize: `${ICO}/ico_training_class_size_18.svg`,
    location: `${ICO}/ico_training_location_18.svg`,
    products: `${ICO}/ico_training_products_18.svg`,
  },
} as const;

export type EngineeringTrainingSessionMetaIconKey =
  keyof typeof engineeringTrainingSessionAssets.metaIcons;

export const engineeringTrainingSessionShareLinks = [
  {
    id: "facebook",
    href: "https://www.facebook.com/sharer/sharer.php",
    icon: "/ico/ico_share_facebook_44.svg",
    label: "Share on Facebook",
    external: true,
  },
  {
    id: "x",
    href: "https://twitter.com/intent/tweet",
    icon: "/ico/ico_share_x_44.svg",
    label: "Share on X",
    external: true,
  },
  {
    id: "linkedin",
    href: "https://www.linkedin.com/sharing/share-offsite/",
    icon: "/ico/ico_share_linkedin_44.svg",
    label: "Share on LinkedIn",
    external: true,
  },
  {
    id: "email",
    href: "mailto:",
    icon: "/ico/ico_share_email_44.svg",
    label: "Share by email",
    external: false,
  },
] as const;

// 세션 탭 id 목록(타입 파생용). 라벨은 variant/조건에 따라 buildSessionTabs 에서 동적 구성.
export const engineeringTrainingSessionTabIds = [
  "training",
  "agenda",
  "registration",
] as const;

export type EngineeringTrainingSessionTabId =
  (typeof engineeringTrainingSessionTabIds)[number];

// 세션 탭(id + 라벨) 런타임 표현
export type EngineeringTrainingSessionTab = {
  id: EngineeringTrainingSessionTabId;
  label: string;
};

// training 탭 라벨을 variant 별로 동적화(중복 방지 위해 한 곳에만 정의)
const TRAINING_TAB_LABELS: Record<TrainingVariant, string> = {
  sales: "Sales Training",
  engineering: "Engineering Training",
  service: "Service Training",
};

// 세션 탭 목록 동적 구성:
// - training 탭은 본문(content)이 있을 때만 노출(variant별 라벨).
// - agenda / registration 은 항상 노출.
export function buildSessionTabs(
  variant: TrainingVariant,
  hasContent: boolean,
): EngineeringTrainingSessionTab[] {
  const tabs: EngineeringTrainingSessionTab[] = [];
  if (hasContent) {
    tabs.push({ id: "training", label: TRAINING_TAB_LABELS[variant] });
  }
  tabs.push({ id: "agenda", label: "Agenda" });
  tabs.push({ id: "registration", label: "Registration Form" });
  return tabs;
}

export function getEngineeringTrainingSessionDetail(
  courseId: string,
  sessionId: string,
) {
  return engineeringTrainingSessionDetails[`${courseId}/${sessionId}`] ?? null;
}

export const engineeringTrainingSessionParams = Object.values(
  engineeringTrainingSessionDetails,
).map(({ courseId, sessionId }) => ({ courseId, sessionId }));

// 등록 폼 제출 버튼 카피 (ls-publish 상세 마크업 이관분)
export const engineeringTrainingSessionFormCopy = {
  submitLabel: "Get the Whitepaper",
} as const;
