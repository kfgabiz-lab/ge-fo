import { salesTrainingPage } from "@/data/services/salesTrainingContent";
import { serviceTrainingPage } from "@/data/services/serviceTrainingContent";
import { engineeringTrainingPage } from "@/data/services/engineeringTrainingContent";
import { TRAINING_COURSE_DETAIL_HREF_PREFIX } from "./trainingData";

export type TrainingVariant = "sales" | "engineering" | "service";

export type TrainingFilterOption = {
  value: string;
  label: string;
};

type TrainingFilterConfig = {
  label: string;
  defaultValue: string;
};

export type TrainingCurriculumData = {
  filters: {
    category: TrainingFilterConfig;
    lvCategory: TrainingFilterConfig;
    subCategory: TrainingFilterConfig;
    searchPlaceholder: string;
  };
  pageSize: number;
};

export type TrainingContentEntry = {
  title: string;
  description: string;
  curriculum: TrainingCurriculumData;
  pageId: string;
  mainClassName: string;
  sectionId: string;
  ariaLabel: string;
  detailHrefPrefix: string;
};

export const trainingContent: Record<TrainingVariant, TrainingContentEntry> = {
  sales: {
    ...salesTrainingPage,
    pageId: "P-FO-SERV-030000P_2",
    mainClassName: "support-page support-page--sales-training",
    sectionId: "sales-training-curriculum",
    ariaLabel: "Sales training curriculum pages",
    detailHrefPrefix: TRAINING_COURSE_DETAIL_HREF_PREFIX,
  },
  engineering: {
    ...engineeringTrainingPage,
    pageId: "P-FO-SERV-030000P",
    mainClassName: "support-page support-page--engineering-training",
    sectionId: "engineering-training-curriculum",
    ariaLabel: "Training curriculum pages",
    detailHrefPrefix: TRAINING_COURSE_DETAIL_HREF_PREFIX,
  },
  service: {
    ...serviceTrainingPage,
    pageId: "P-FO-SERV-030000P_1",
    mainClassName: "support-page support-page--service-training",
    sectionId: "service-training-curriculum",
    ariaLabel: "Service training curriculum pages",
    detailHrefPrefix: TRAINING_COURSE_DETAIL_HREF_PREFIX,
  },
};
