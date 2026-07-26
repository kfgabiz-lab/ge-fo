import { RequestForTrainingProvider } from "./components/RequestForTrainingProvider";

// Step1~Step4 가 별도 라우트라 스텝 이동 시 입력값이 초기화되지 않도록 전 스텝 공통 레이아웃에서
// 폼 상태 Provider 로 감싼다(Step2~4 페이지를 추가해도 이 레이아웃 하나로 상태가 공유된다).
export default function RequestForTrainingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <RequestForTrainingProvider>{children}</RequestForTrainingProvider>;
}
