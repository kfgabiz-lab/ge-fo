"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { requestForTrainingRoutes } from "@/data/services/requestForTrainingContent";
import {
  isStep1Complete,
  isStep2Complete,
  isStep3Complete,
  useRequestForTrainingForm,
} from "./RequestForTrainingProvider";

const STEP_ORDER = [
  requestForTrainingRoutes.step1,
  requestForTrainingRoutes.step2,
  requestForTrainingRoutes.step3,
  requestForTrainingRoutes.step4,
] as const;

export default function RequestForTrainingStepGuard({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { step1, step2, step3, isRestored } = useRequestForTrainingForm();

  useEffect(() => {
    if (!isRestored) return;

    const currentIndex = STEP_ORDER.indexOf(pathname as (typeof STEP_ORDER)[number]);
    if (currentIndex <= 0) return;

    const completedBefore = [
      isStep1Complete(step1),
      isStep2Complete(step2),
      isStep3Complete(step3),
    ];
    const firstIncompleteIndex = completedBefore
      .slice(0, currentIndex)
      .findIndex((done) => !done);

    if (firstIncompleteIndex !== -1) {
      router.replace(STEP_ORDER[firstIncompleteIndex]);
    }
  }, [pathname, step1, step2, step3, isRestored, router]);

  return <>{children}</>;
}
