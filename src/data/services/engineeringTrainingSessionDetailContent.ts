import type { TrainingVariant } from "@/app/services/training/data/trainingContent";

export type EngineeringTrainingAgendaRow = {
  id: string;
  number: string;
  date: string;
  time: string;
  title: string;
  description?: string;
  trainer?: string;
};

export type EngineeringTrainingSessionEvent = {
  title: string;
  startIso: string;
  timeFrom?: string;
  timeTo?: string;
  location?: string;
  description?: string;
};

export type EngineeringTrainingSessionDetail = {
  courseId: string;
  sessionId: string;
  category: string;
  title: string;
  courseTitle?: string;
  breadcrumbCurrent: string;
  content: string;
  agenda: EngineeringTrainingAgendaRow[];
  showTrainerColumn: boolean;
  positionOptions: string[];
  calendar: {
    googleLabel: string;
    icalLabel: string;
  };
  event?: EngineeringTrainingSessionEvent;
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
    date: "",
    time: "09:10~09:30",
    title: "LS ELECTRIC Introduction",
    description: AGENDA_INTRO,
    trainer: "Byron Black",
  },
  {
    id: "agenda-02",
    number: "2",
    date: "",
    time: "09:30~10:45",
    title: "MV, LV BREAKER: VCB, ACB, MCCB",
    description: AGENDA_INTRO,
    trainer: "Byron Black",
  },
  {
    id: "agenda-03",
    number: "3",
    date: "",
    time: "10:45~12:00",
    title: "MV, LV SWITCH GEAR",
    description: AGENDA_INTRO,
    trainer: "Clarke Arnold",
  },
  {
    id: "agenda-04",
    number: "4",
    date: "",
    time: "12:00~13:00",
    title: "Lunch Time",
  },
  {
    id: "agenda-05",
    number: "5",
    date: "",
    time: "13:00~14:00",
    title: "CAST RESIN TRANSFORMER",
    description: AGENDA_INTRO,
    trainer: "Clarke Arnold",
  },
  {
    id: "agenda-06",
    number: "6",
    date: "",
    time: "14:00~14:20",
    title: "Factory Line Tour",
    description: AGENDA_INTRO,
    trainer: "Clarke Arnold",
  },
  {
    id: "agenda-07",
    number: "7",
    date: "",
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
      registerLabel: "Scroll to Downloads",
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
      registerLabel: "Scroll to Downloads",
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
      registerLabel: "Scroll to Downloads",
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
      registerLabel: "Scroll to Downloads",
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

export const engineeringTrainingSessionTabIds = [
  "training",
  "agenda",
  "registration",
] as const;

export type EngineeringTrainingSessionTabId =
  (typeof engineeringTrainingSessionTabIds)[number];

export type EngineeringTrainingSessionTab = {
  id: EngineeringTrainingSessionTabId;
  label: string;
};

const TRAINING_TAB_LABELS: Record<TrainingVariant, string> = {
  sales: "Sales Training",
  engineering: "Engineering Training",
  service: "Service Training",
};

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

export const engineeringTrainingSessionFormCopy = {
  submitLabel: "REGISTER",
} as const;
