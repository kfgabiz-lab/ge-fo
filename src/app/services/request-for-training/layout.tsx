import { siteTodayStr } from "@/lib/siteTime";
import { RequestForTrainingProvider } from "./components/RequestForTrainingProvider";

export default function RequestForTrainingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <RequestForTrainingProvider todayStr={siteTodayStr()}>
      {children}
    </RequestForTrainingProvider>
  );
}
