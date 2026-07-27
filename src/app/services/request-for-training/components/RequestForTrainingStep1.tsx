"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { requestForTrainingRoutes } from "@/data/services/requestForTrainingContent";
import RequestForTraining from "./RequestForTraining";
import { useRequestForTrainingForm } from "./RequestForTrainingProvider";
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
      phone: step1.phone.trim() === "",
      email: step1.email.trim() === "",
    };
    setErrors(nextErrors);

    const requiredFilled =
      step1.trainingTrack.trim() !== "" &&
      !Object.values(nextErrors).some(Boolean);
    if (!requiredFilled) {
      alert("Please complete all required fields.");
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
