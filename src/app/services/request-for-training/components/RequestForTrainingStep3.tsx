"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { requestForTrainingRoutes } from "@/data/services/requestForTrainingContent";
import RequestForTraining from "./RequestForTraining";
import {
  isStep3Complete,
  useRequestForTrainingForm,
} from "./RequestForTrainingProvider";
import RequestForTrainingStep3Form from "./RequestForTrainingStep3Form";

export type RequestForTrainingStep3Errors = {
  locationName?: boolean;
  contactDetails?: boolean;
};

export default function RequestForTrainingStep3() {
  const router = useRouter();
  const { step3 } = useRequestForTrainingForm();
  const [errors, setErrors] = useState<RequestForTrainingStep3Errors>({});

  function clearError(key: keyof RequestForTrainingStep3Errors) {
    setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev));
  }

  function handleNext() {
    const isInPerson = step3.trainingFormat === "In-Person";
    const nextErrors: RequestForTrainingStep3Errors = {
      locationName: isInPerson && step3.locationName.trim() === "",
      contactDetails: isInPerson && step3.contactDetails.trim() === "",
    };
    setErrors(nextErrors);

    if (!isStep3Complete(step3)) {
      alert("Please complete all required fields.");
      return;
    }

    router.push(requestForTrainingRoutes.step4);
  }

  return (
    <RequestForTraining
      currentStep={3}
      previousHref={requestForTrainingRoutes.step2}
      onNextClick={handleNext}
    >
      <RequestForTrainingStep3Form errors={errors} onClearError={clearError} />
    </RequestForTraining>
  );
}
