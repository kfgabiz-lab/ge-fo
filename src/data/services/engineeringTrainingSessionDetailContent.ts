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

export type EngineeringTrainingSessionEventDay = {
  date: string;
  timeFrom?: string;
  timeTo?: string;
};

export type EngineeringTrainingSessionEvent = {
  title: string;
  startIso: string;
  endIso?: string;
  timeFrom?: string;
  timeTo?: string;
  /** 교육일별 개별 이벤트 목록. 있으면 캘린더 공유 시 날짜별로 개별 이벤트를 생성 */
  days?: EngineeringTrainingSessionEventDay[];
  location?: string;
  description?: string;
  organizerName?: string;
  organizerEmail?: string;
  categories?: string;
  attachUrl?: string;
};

export type EngineeringTrainingSessionDetail = {
  /** 소속 코스 상세 경로(/services/training/course/{id}/{slug}) — 브레드크럼 등 화면 링크에 사용 */
  courseHref: string;
  /** 신청 폼에서 서버로 보내는 실제 커리큘럼 숫자 id(문자열) */
  curriculumId: string;
  sessionId: string;
  category: string;
  title: string;
  courseTitle?: string;
  breadcrumbCurrent: string;
  closesLabel?: string;
  registrationClosed?: boolean;
  registrationNotYetOpen?: boolean;
  content: string;
  agenda: EngineeringTrainingAgendaRow[];
  showTrainerColumn: boolean;
  calendar: {
    googleLabel: string;
    icalLabel: string;
  };
  event?: EngineeringTrainingSessionEvent;
  countdownTo?: string;
  sidebar: {
    date: string;
    dateTo?: string;
    eventDateToAttend: string;
    duration: string;
    classSize: string;
    location: {
      name: string;
      address: string;
      streetAddress?: string;
      extendedAddress?: string;
      phone: string;
      email: string;
    };
    productsCovered: string;
    productNames?: string[];
    trainingType: string;
    registerLabel: string;
  };
};

const IMG = "/img/services/engineering-training";
const ICO = "/ico";

export const engineeringTrainingSessionCalendarLabels = {
  googleLabel: "Google Calendar",
  icalLabel: "iCal / Outlook",
} as const;

export const engineeringTrainingSessionAssets = {
  countdownBg: `${IMG}/session-countdown-bg.webp`,
  recaptcha: `${IMG}/session-recaptcha.webp`,
  registerScrollIcon: `${ICO}/ico_scrto_18.svg`,
  calendarIcons: {
    google: `${ICO}/ico_google_18.svg`,
    ical: `${ICO}/ico_calendar_18.svg`,
  },
  metaIcons: {
    date: `${ICO}/ico_training_date_20.svg`,
    duration: `${ICO}/ico_training_duration_20.svg`,
    trainingType: `${ICO}/ico_training_type_20.svg`,
    classSize: `${ICO}/ico_training_class_size_20.svg`,
    location: `${ICO}/ico_training_location_20.svg`,
    products: `${ICO}/ico_training_products_20.svg`,
  },
} as const;

export type EngineeringTrainingSessionMetaIconKey =
  keyof typeof engineeringTrainingSessionAssets.metaIcons;

export const engineeringTrainingSessionShareLinks = [
  {
    id: "x",
    href: "https://twitter.com/intent/tweet",
    icon: "/ico/ico_share_x_44.svg",
    popoverIcon: "/ico/ico_share_popover_x_52.svg",
    popoverLabel: "X",
    label: "Share on X",
    external: true,
  },
  {
    id: "linkedin",
    href: "https://www.linkedin.com/sharing/share-offsite/",
    icon: "/ico/ico_share_linkedin_44.svg",
    popoverIcon: "/ico/ico_share_popover_linkedin_52.svg",
    popoverLabel: "Linkedin",
    label: "Share on LinkedIn",
    external: true,
  },
  {
    id: "email",
    href: "mailto:",
    icon: "/ico/ico_share_email_44.svg",
    popoverIcon: "/ico/ico_share_popover_email_52.svg",
    popoverLabel: "Email",
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

export const engineeringTrainingSessionFormCopy = {
  submitLabel: "Register",
  scrollToRegisterLabel: "Scroll to Registration",
} as const;
