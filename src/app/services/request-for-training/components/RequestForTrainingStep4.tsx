"use client";

import { useState } from "react";
import {
  requestForTrainingNavCopy,
  requestForTrainingRoutes,
} from "@/data/services/requestForTrainingContent";
import { submitTrainingRequest } from "@/lib/training/trainingRequestSubmit";
import RequestForTraining from "./RequestForTraining";
import {
  isStep1Complete,
  isStep2Complete,
  isStep3Complete,
  useRequestForTrainingForm,
} from "./RequestForTrainingProvider";
import RequestForTrainingStep4Form from "./RequestForTrainingStep4Form";

const VFD_GROUP_TITLE = "Variable Frequency Drive";

const REQUIRED_ALERT = "Please complete all required fields.";
const SUCCESS_ALERT = "Your training request has been submitted.";

export default function RequestForTrainingStep4() {
  const { step1, step2, step3, step4 } = useRequestForTrainingForm();
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit() {
    if (submitting) return;

    const step1Filled = isStep1Complete(step1);
    const step2Filled = isStep2Complete(step2);
    const step3Filled = isStep3Complete(step3);

    const hasVfdProduct = step4.selectedProducts.some(
      (product) => product.type === "A" && product.groupTitle === VFD_GROUP_TITLE,
    );
    const vfdFilled =
      !hasVfdProduct ||
      (step4.jobTitles.length > 0 &&
        step4.studentInvolvement.length > 0 &&
        step4.vfdUnderstanding !== "");
    const step4Filled =
      step4.selectedProducts.length > 0 &&
      vfdFilled &&
      step4.consentChecked &&
      step4.recaptchaToken.trim() !== "";

    if (!step1Filled || !step2Filled || !step3Filled || !step4Filled) {
      alert(REQUIRED_ALERT);
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
        curriculumId: step4.curriculumId ?? undefined,
        sessionId: step4.sessionId ?? undefined,
        jobTitles: step4.jobTitles,
        studentInvolvement: step4.studentInvolvement,
        vfdUnderstanding: step4.vfdUnderstanding,
        vfdUnderstandingTopics: step4.vfdUnderstandingTopics,
        comments: step4.comments,
        consentChecked: step4.consentChecked,
        recaptchaToken: step4.recaptchaToken,
      });
      alert(SUCCESS_ALERT);
    } catch (error) {
      console.error("[request-for-training] submit failed", error);
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
      <RequestForTrainingStep4Form />
    </RequestForTraining>
  );
}
