"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  requestForTrainingNavCopy,
  requestForTrainingRoutes,
} from "@/data/services/requestForTrainingContent";
import { submitTrainingRequest } from "@/lib/training/trainingRequestSubmit";
import { ApiError } from "@/lib/api";
import RequestForTraining from "./RequestForTraining";
import {
  isStep1Complete,
  isStep2Complete,
  isStep3Complete,
  useRequestForTrainingForm,
} from "./RequestForTrainingProvider";
import RequestForTrainingStep4Form, {
  type RequestForTrainingStep4Errors,
} from "./RequestForTrainingStep4Form";

const VFD_GROUP_TITLE = "Variable Frequency Drive";

const SUCCESS_ALERT = "Your training request has been submitted.";

export default function RequestForTrainingStep4() {
  const router = useRouter();
  const { step1, step2, step3, step4, resetForm } = useRequestForTrainingForm();
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<RequestForTrainingStep4Errors>({});

  function clearError(key: keyof RequestForTrainingStep4Errors) {
    setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev));
  }

  async function handleSubmit() {
    if (submitting) return;

    const step1Filled = isStep1Complete(step1);
    const step2Filled = isStep2Complete(step2);
    const step3Filled = isStep3Complete(step3);

    const hasVfdProduct = step4.selectedProducts.some(
      (product) => product.type === "A" && product.groupTitle === VFD_GROUP_TITLE,
    );
    const captchaValid =
      step4.captchaToken.trim() !== "" && /^\d{4}$/.test(step4.captchaCode.trim());
    const nextErrors: RequestForTrainingStep4Errors = {
      products: step4.selectedProducts.length === 0,
      jobTitles: hasVfdProduct && step4.jobTitles.length === 0,
      studentInvolvement: hasVfdProduct && step4.studentInvolvement.length === 0,
      vfdUnderstanding: hasVfdProduct && step4.vfdUnderstanding === "",
      consent: !step4.consentChecked,
      captcha: !captchaValid,
    };
    setErrors(nextErrors);

    const vfdFilled =
      !hasVfdProduct ||
      (step4.jobTitles.length > 0 &&
        step4.studentInvolvement.length > 0 &&
        step4.vfdUnderstanding !== "");
    const step4Filled =
      step4.selectedProducts.length > 0 &&
      vfdFilled &&
      step4.consentChecked &&
      captchaValid;

    if (!step1Filled || !step2Filled || !step3Filled || !step4Filled) {
      return;
    }

    setSubmitting(true);
    try {
      await submitTrainingRequest({
        trainingTrack: step1.trainingTrack,
        firstName: step1.firstName,
        lastName: step1.lastName,
        company: step1.company,
        streetAddress: step1.streetAddress,
        address2: step1.address2,
        city: step1.city,
        state: step1.state,
        zip: step1.zip,
        phone: step1.phone,
        email: step1.email,
        title: step1.title,
        cellPhone: step1.cellPhone,
        salesContact: step1.salesContact,
        sessionCount: step2.sessionCount,
        sessionDays: step2.sessionDays,
        scheduleStart: step2.scheduleStart,
        scheduleEnd: step2.scheduleEnd,
        studentCount: step2.studentCount,
        trainingFormat: step3.trainingFormat,
        locationName: step3.locationName,
        locationStreetAddress: step3.streetAddress,
        locationAddress2: step3.address2,
        locationCity: step3.city,
        locationState: step3.state,
        locationZip: step3.zip,
        contactPerson: step3.contactPerson,
        contactDetails: step3.contactDetails,
        selectedProducts: step4.selectedProducts,
        jobTitles: step4.jobTitles,
        studentInvolvement: step4.studentInvolvement,
        vfdUnderstanding: step4.vfdUnderstanding,
        vfdUnderstandingTopics: step4.vfdUnderstandingTopics,
        comments: step4.comments,
        consentChecked: step4.consentChecked,
        captchaCode: step4.captchaCode,
        captchaToken: step4.captchaToken,
      });
      alert(SUCCESS_ALERT);
      resetForm();
      router.push(requestForTrainingRoutes.step1);
    } catch (error) {
      console.error("[request-for-training] submit failed", error);
      if (error instanceof ApiError && error.code === "CAPTCHA_FAILED") {
        setErrors((prev) => ({ ...prev, captcha: true }));
        alert("The CAPTCHA code is incorrect. Please try again.");
      } else if (error instanceof ApiError && error.code === "CAPTCHA_EXPIRED") {
        setErrors((prev) => ({ ...prev, captcha: true }));
        alert("The CAPTCHA has expired. Please try again.");
      } else {
        alert("Something went wrong while submitting. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <RequestForTraining
      currentStep={4}
      previousHref={requestForTrainingRoutes.step3}
      submitLabel={requestForTrainingNavCopy.submitLabel}
      onNextClick={handleSubmit}
    >
      <RequestForTrainingStep4Form errors={errors} onClearError={clearError} />
    </RequestForTraining>
  );
}
