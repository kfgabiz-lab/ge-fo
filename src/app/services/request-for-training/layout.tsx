import { siteTodayStr } from "@/lib/siteTime";
import { RequestForTrainingProvider } from "./components/RequestForTrainingProvider";
import RequestForTrainingStepGuard from "./components/RequestForTrainingStepGuard";

export default function RequestForTrainingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <RequestForTrainingProvider todayStr={siteTodayStr()}>
      <RequestForTrainingStepGuard>{children}</RequestForTrainingStepGuard>
    </RequestForTrainingProvider>
  );
}
