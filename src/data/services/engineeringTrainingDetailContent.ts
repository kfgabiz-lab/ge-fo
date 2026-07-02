export type EngineeringTrainingSession = {
  id: string;
  date: string;
  closesLabel: string;
  trainingType: string;
  duration: string;
  location?: string;
  productsCovered: string;
};

export type EngineeringTrainingScheduleFilter = {
  label: string;
  defaultValue: string;
  options: string[];
};

export type EngineeringTrainingDetail = {
  courseId: string;
  breadcrumbCurrent: string;
  category: string;
  title: string;
  descriptionLines: string[];
  heroImage: string;
  schedule: {
    trainingTypeFilter: EngineeringTrainingScheduleFilter;
    monthFilter: EngineeringTrainingScheduleFilter;
    sessions: EngineeringTrainingSession[];
  };
};

const IMG = "/img/services/engineering-training";

const SESSION_TITLE = "Hands-on Breaker Training: MCCB · ACB · VCB";
const SESSION_LOCATION = "625 Heathrow Dr, Lincolnshire IL 60069, USA";
const SESSION_DURATION = "Duration: 12 Hours";
const PRODUCTS_FULL =
  "PRODUCTS COVERED: Miniature Circuit Breaker, Molded Case Circuit Breaker, Air Circuit Breaker, Vacuum Circuit Breaker";
const PRODUCTS_SHORT =
  "PRODUCTS COVERED: Miniature Circuit Breaker, Molded Case Circuit Breaker,  Vacuum Circuit Breaker";

export const engineeringTrainingDetails: Record<string, EngineeringTrainingDetail> = {
  "breaker-training": {
    courseId: "breaker-training",
    breadcrumbCurrent: "Engineering Training curriculum",
    category: "POWER",
    title: SESSION_TITLE,
    descriptionLines: [
      "Engineering training materials that combine the principles, specifications, and setup methods of LS circuit breakers from low pressure (MCB/MCCB/ACB) to medium pressure (VCB) into theory",
      "and practice",
    ],
    heroImage: `${IMG}/course-01.jpg`,
    schedule: {
      trainingTypeFilter: {
        label: "Training Type",
        defaultValue: "Training Type",
        options: ["Training Type", "Virtual", "In-Person"],
      },
      monthFilter: {
        label: "Month",
        defaultValue: "Month",
        options: ["Month", "January", "March", "July", "December"],
      },
      sessions: [
        {
          id: "jan-10-2026",
          date: "Jan 10, 2026",
          closesLabel: "Closes in 2 days",
          trainingType: "Training Type: Virtual",
          duration: SESSION_DURATION,
          productsCovered: PRODUCTS_FULL,
        },
        {
          id: "mar-12-2026",
          date: "Mar 12, 2026",
          closesLabel: "Closes in 132 days",
          trainingType: "Training Type: In-Person",
          duration: SESSION_DURATION,
          location: SESSION_LOCATION,
          productsCovered: PRODUCTS_SHORT,
        },
        {
          id: "jul-14-2026",
          date: "Jul 14, 2026",
          closesLabel: "Closes in 196 days",
          trainingType: "Training Type: Virtual",
          duration: SESSION_DURATION,
          productsCovered: PRODUCTS_SHORT,
        },
        {
          id: "dec-8-2026",
          date: "Dec 8, 2026",
          closesLabel: "Closes in 343 days",
          trainingType: "Training Type: Virtual",
          duration: SESSION_DURATION,
          productsCovered: PRODUCTS_SHORT,
        },
      ],
    },
  },
};

const ICO = "/ico";

export const engineeringTrainingDetailAssets = {
  scheduleMetaIcons: {
    type: `${ICO}/ico_training_type_20.svg`,
    duration: `${ICO}/ico_training_duration_18.svg`,
    location: `${ICO}/ico_map_16_1.svg`,
  },
} as const;

export function getEngineeringTrainingDetail(courseId: string) {
  return engineeringTrainingDetails[courseId] ?? null;
}

export const engineeringTrainingDetailIds = Object.keys(engineeringTrainingDetails);
