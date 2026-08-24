"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  requestForTrainingStep3Copy,
  requestForTrainingTypeOptions,
} from "@/data/services/requestForTrainingContent";

export type RequestForTrainingTypeId =
  (typeof requestForTrainingTypeOptions)[number]["id"];

export type RequestForTrainingStep1Values = {
  trainingTrack: RequestForTrainingTypeId;
  firstName: string;
  lastName: string;
  company: string;
  streetAddress: string;
  address2: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  email: string;
  title: string;
  cellPhone: string;
  salesContact: string;
};

export type RequestForTrainingStep1FieldKey = keyof RequestForTrainingStep1Values;

const STEP1_INITIAL: RequestForTrainingStep1Values = {
  trainingTrack: requestForTrainingTypeOptions[0].id,
  firstName: "",
  lastName: "",
  company: "",
  streetAddress: "",
  address2: "",
  city: "",
  state: "",
  zip: "",
  phone: "",
  email: "",
  title: "",
  cellPhone: "",
  salesContact: "",
};

export type RequestForTrainingStep2Values = {
  sessionCount: string;
  sessionDays: string;
  scheduleStart: string;
  scheduleEnd: string;
  studentCount: string;
};

export type RequestForTrainingStep2FieldKey = keyof RequestForTrainingStep2Values;

function createStep2Initial(todayStr: string): RequestForTrainingStep2Values {
  return {
    sessionCount: "",
    sessionDays: "",
    scheduleStart: todayStr,
    scheduleEnd: "",
    studentCount: "",
  };
}

export type RequestForTrainingStep3Values = {
  trainingFormat: (typeof requestForTrainingStep3Copy.fields.trainingFormat.options)[number];
  locationName: string;
  streetAddress: string;
  address2: string;
  city: string;
  state: string;
  zip: string;
  contactPerson: string;
  contactDetails: string;
};

export type RequestForTrainingStep3FieldKey = keyof RequestForTrainingStep3Values;

const STEP3_INITIAL: RequestForTrainingStep3Values = {
  trainingFormat: requestForTrainingStep3Copy.fields.trainingFormat.options[0],
  locationName: "",
  streetAddress: "",
  address2: "",
  city: "",
  state: "",
  zip: "",
  contactPerson: "",
  contactDetails: "",
};

export function isStep1Complete(step1: RequestForTrainingStep1Values): boolean {
  return (
    step1.trainingTrack.trim() !== "" &&
    step1.firstName.trim() !== "" &&
    step1.company.trim() !== "" &&
    step1.streetAddress.trim() !== "" &&
    step1.city.trim() !== "" &&
    step1.state.trim() !== "" &&
    step1.zip.trim() !== "" &&
    step1.phone.length === 10 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(step1.email.trim())
  );
}

export function isStep2Complete(step2: RequestForTrainingStep2Values): boolean {
  return (
    step2.sessionCount.trim() !== "" &&
    step2.sessionDays.trim() !== "" &&
    step2.scheduleStart.trim() !== "" &&
    step2.scheduleEnd.trim() !== "" &&
    step2.studentCount.trim() !== ""
  );
}

export function isStep3Complete(step3: RequestForTrainingStep3Values): boolean {
  return (
    step3.trainingFormat !== "In-Person" ||
    (step3.locationName.trim() !== "" && step3.contactDetails.trim() !== "")
  );
}

export type RequestForTrainingSelectedProduct = {
  id: number;
  name: string;
  type: "P" | "A";
  groupId: number;
  groupTitle: string;
};

export type RequestForTrainingCategoryType = "power" | "automation";

export type RequestForTrainingStep4Values = {
  productCategoryType: RequestForTrainingCategoryType | "";
  productGroupId: string;
  selectedProducts: RequestForTrainingSelectedProduct[];
  jobTitles: string[];
  studentInvolvement: string[];
  vfdUnderstanding: "Yes" | "No" | "";
  vfdUnderstandingTopics: string[];
  comments: string;
  consentChecked: boolean;
  captchaCode: string;
  captchaToken: string;
};

export type RequestForTrainingStep4FieldKey = keyof RequestForTrainingStep4Values;

const STEP4_INITIAL: RequestForTrainingStep4Values = {
  productCategoryType: "",
  productGroupId: "",
  selectedProducts: [],
  jobTitles: [],
  studentInvolvement: [],
  vfdUnderstanding: "Yes",
  vfdUnderstandingTopics: [],
  comments: "",
  consentChecked: false,
  captchaCode: "",
  captchaToken: "",
};

const STORAGE_KEY = "request-for-training-form";

type RequestForTrainingFormContextValue = {
  step1: RequestForTrainingStep1Values;
  setStep1Field: <K extends RequestForTrainingStep1FieldKey>(
    key: K,
    value: RequestForTrainingStep1Values[K],
  ) => void;
  step2: RequestForTrainingStep2Values;
  setStep2Field: <K extends RequestForTrainingStep2FieldKey>(
    key: K,
    value: RequestForTrainingStep2Values[K],
  ) => void;
  step3: RequestForTrainingStep3Values;
  setStep3Field: <K extends RequestForTrainingStep3FieldKey>(
    key: K,
    value: RequestForTrainingStep3Values[K],
  ) => void;
  step4: RequestForTrainingStep4Values;
  setStep4Field: <K extends RequestForTrainingStep4FieldKey>(
    key: K,
    value: RequestForTrainingStep4Values[K],
  ) => void;
  isRestored: boolean;
  resetForm: () => void;
};

const RequestForTrainingFormContext =
  createContext<RequestForTrainingFormContextValue | null>(null);

export function useRequestForTrainingForm(): RequestForTrainingFormContextValue {
  const ctx = useContext(RequestForTrainingFormContext);
  if (!ctx) {
    throw new Error(
      "useRequestForTrainingForm must be used within RequestForTrainingProvider",
    );
  }
  return ctx;
}

export function RequestForTrainingProvider({
  children,
  todayStr,
}: {
  children: ReactNode;
  todayStr: string;
}) {
  const [step1, setStep1] = useState<RequestForTrainingStep1Values>(STEP1_INITIAL);
  const [step2, setStep2] = useState<RequestForTrainingStep2Values>(() =>
    createStep2Initial(todayStr),
  );
  const [step3, setStep3] = useState<RequestForTrainingStep3Values>(STEP3_INITIAL);
  const [step4, setStep4] = useState<RequestForTrainingStep4Values>(STEP4_INITIAL);
  const restoredRef = useRef(false);
  const [isRestored, setIsRestored] = useState(false);

  useEffect(() => {
    try {
      const saved = window.sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as {
          step1?: Partial<RequestForTrainingStep1Values>;
          step2?: Partial<RequestForTrainingStep2Values>;
          step3?: Partial<RequestForTrainingStep3Values>;
          step4?: Partial<RequestForTrainingStep4Values>;
        };
        if (parsed.step1) setStep1((prev) => ({ ...prev, ...parsed.step1 }));
        if (parsed.step2) setStep2((prev) => ({ ...prev, ...parsed.step2 }));
        if (parsed.step3) setStep3((prev) => ({ ...prev, ...parsed.step3 }));
        if (parsed.step4) setStep4((prev) => ({ ...prev, ...parsed.step4 }));
      }
    } catch {
    } finally {
      restoredRef.current = true;
      setIsRestored(true);
    }
  }, []);

  useEffect(() => {
    if (!restoredRef.current) return;
    try {
      window.sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ step1, step2, step3, step4 }),
      );
    } catch {
    }
  }, [step1, step2, step3, step4]);

  const setStep1Field = useCallback(
    <K extends RequestForTrainingStep1FieldKey>(
      key: K,
      value: RequestForTrainingStep1Values[K],
    ) => {
      setStep1((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const setStep2Field = useCallback(
    <K extends RequestForTrainingStep2FieldKey>(
      key: K,
      value: RequestForTrainingStep2Values[K],
    ) => {
      setStep2((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const setStep3Field = useCallback(
    <K extends RequestForTrainingStep3FieldKey>(
      key: K,
      value: RequestForTrainingStep3Values[K],
    ) => {
      setStep3((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const setStep4Field = useCallback(
    <K extends RequestForTrainingStep4FieldKey>(
      key: K,
      value: RequestForTrainingStep4Values[K],
    ) => {
      setStep4((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const resetForm = useCallback(() => {
    setStep1(STEP1_INITIAL);
    setStep2(createStep2Initial(todayStr));
    setStep3(STEP3_INITIAL);
    setStep4(STEP4_INITIAL);
    try {
      window.sessionStorage.removeItem(STORAGE_KEY);
    } catch {
    }
  }, [todayStr]);

  const value = useMemo(
    () => ({
      step1,
      setStep1Field,
      step2,
      setStep2Field,
      step3,
      setStep3Field,
      step4,
      setStep4Field,
      isRestored,
      resetForm,
    }),
    [
      step1,
      setStep1Field,
      step2,
      setStep2Field,
      step3,
      setStep3Field,
      step4,
      setStep4Field,
      isRestored,
      resetForm,
    ],
  );

  return (
    <RequestForTrainingFormContext.Provider value={value}>
      {children}
    </RequestForTrainingFormContext.Provider>
  );
}
