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

// Training Request 는 Step1~Step4 가 각각 별도 라우트라, 스텝 이동 시 입력값이 사라지지 않도록
// 상위 layout 에서 이 Provider 로 감싸 전 스텝이 같은 폼 상태를 공유한다.
// 값이 바뀔 때마다 sessionStorage 에 동기화하므로 새로고침/뒤로가기 후에도 입력값이 유지된다.
// 저장 구조는 스텝별로 중첩된 { step1, step2, ... } 형태 — Step3~4 개발 시 같은 방식(값 타입 +
// setter + STORAGE_KEY 저장 객체에 필드 추가)으로 확장하면 된다.

export type RequestForTrainingTypeId =
  (typeof requestForTrainingTypeOptions)[number]["id"];

/** Step1(Basic Information) 입력값 */
export type RequestForTrainingStep1Values = {
  trainingTrack: RequestForTrainingTypeId;
  firstName: string;
  lastName: string;
  company: string;
  streetAddress: string; // Street Address 검색 입력
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

// Training Track 기본값 = 첫 번째 옵션(Engineering Training)
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

/** Step2(Requested Date(s) of Training) 입력값 */
export type RequestForTrainingStep2Values = {
  sessionCount: string;
  sessionDays: string;
  scheduleStart: string; // "YYYY-MM-DD"
  scheduleEnd: string; // "YYYY-MM-DD"
  studentCount: string;
};

export type RequestForTrainingStep2FieldKey = keyof RequestForTrainingStep2Values;

const STEP2_INITIAL: RequestForTrainingStep2Values = {
  sessionCount: "",
  sessionDays: "",
  scheduleStart: "",
  scheduleEnd: "",
  studentCount: "",
};

/** Step3(Training Class Location) 입력값 */
export type RequestForTrainingStep3Values = {
  trainingFormat: (typeof requestForTrainingStep3Copy.fields.trainingFormat.options)[number];
  locationName: string;
  streetAddress: string; // Street Address 검색 입력
  address2: string;
  city: string;
  state: string;
  zip: string;
  contactPerson: string;
  contactDetails: string;
};

export type RequestForTrainingStep3FieldKey = keyof RequestForTrainingStep3Values;

// Training Type 기본값 = 첫 번째 옵션(In-Person)
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

/** Training Request Step4 제품 선택 트리(GET /api/v1/fo/training/product-tree)의 개별 제품 항목 */
export type RequestForTrainingSelectedProduct = {
  id: number;
  name: string;
  type: "P" | "A";
  /** 어느 그룹(두 번째 드롭다운) 아래에서 고른 제품인지 — VFD 조건부 노출 판별에 사용 */
  groupId: number;
  groupTitle: string;
};

/** Step4(Training Class Details) 입력값 — 제품선택 + VFD 조건부 질문. 의견/동의/reCAPTCHA는 후속 STEP에서 확장. */
export type RequestForTrainingStep4Values = {
  selectedProducts: RequestForTrainingSelectedProduct[];
  // 기획서(traning_req4dc.png) item2 — Variable Frequency Drive 제품 선택 시에만 노출되는 3문항.
  // 조건이 꺼져도 값은 지우지 않고 화면에서만 숨긴다(Step3 In-Person/Virtual 과 동일 관례).
  jobTitles: string[];
  studentInvolvement: string[];
  vfdUnderstanding: "Yes" | "No" | "";
  vfdUnderstandingTopics: string[];
};

export type RequestForTrainingStep4FieldKey = keyof RequestForTrainingStep4Values;

const STEP4_INITIAL: RequestForTrainingStep4Values = {
  selectedProducts: [],
  jobTitles: [],
  studentInvolvement: [],
  vfdUnderstanding: "",
  vfdUnderstandingTopics: [],
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
}: {
  children: ReactNode;
}) {
  const [step1, setStep1] = useState<RequestForTrainingStep1Values>(STEP1_INITIAL);
  const [step2, setStep2] = useState<RequestForTrainingStep2Values>(STEP2_INITIAL);
  const [step3, setStep3] = useState<RequestForTrainingStep3Values>(STEP3_INITIAL);
  const [step4, setStep4] = useState<RequestForTrainingStep4Values>(STEP4_INITIAL);
  // SSR 결과와 첫 렌더를 맞추기 위해 복원은 마운트 이후(useEffect)에만 수행한다.
  // 복원 전에 저장 로직이 돌면 초기값이 저장값을 덮어쓰므로 복원 완료 플래그로 막는다.
  const restoredRef = useRef(false);

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
      // 저장값이 깨진 경우 초기값 그대로 사용
    } finally {
      restoredRef.current = true;
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
      // 저장 실패(용량/프라이빗 모드 등)해도 화면 동작에는 영향 없음
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
    ],
  );

  return (
    <RequestForTrainingFormContext.Provider value={value}>
      {children}
    </RequestForTrainingFormContext.Provider>
  );
}
