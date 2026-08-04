"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { requestForTrainingRoutes } from "@/data/services/requestForTrainingContent";
import RequestForTraining from "./RequestForTraining";
import {
  isStep1Complete,
  useRequestForTrainingForm,
} from "./RequestForTrainingProvider";
import RequestForTrainingStep1Form from "./RequestForTrainingStep1Form";

export type RequestForTrainingStep1Errors = {
  firstName?: boolean;
  company?: boolean;
  streetAddress?: boolean;
  city?: boolean;
  state?: boolean;
  zip?: boolean;
  phone?: boolean;
  email?: boolean;
};

export default function RequestForTrainingStep1() {
  const router = useRouter();
  const { step1 } = useRequestForTrainingForm();
  const [errors, setErrors] = useState<RequestForTrainingStep1Errors>({});

  function clearError(key: keyof RequestForTrainingStep1Errors) {
    setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev));
  }

  function handleNext() {
    const nextErrors: RequestForTrainingStep1Errors = {
      firstName: step1.firstName.trim() === "",
      company: step1.company.trim() === "",
      streetAddress: step1.streetAddress.trim() === "",
      city: step1.city.trim() === "",
      state: step1.state.trim() === "",
      zip: step1.zip.trim() === "",
      phone: step1.phone.length !== 10,
      email: !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(step1.email.trim()),
    };
    setErrors(nextErrors);

    if (!isStep1Complete(step1)) {
      return;
    }

    router.push(requestForTrainingRoutes.step2);
  }

  return (
    <RequestForTraining currentStep={1} onNextClick={handleNext}>
      <RequestForTrainingStep1Form errors={errors} onClearError={clearError} />
    </RequestForTraining>
  );
}
