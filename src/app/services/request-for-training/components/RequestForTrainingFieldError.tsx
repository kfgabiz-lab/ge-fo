export default function RequestForTrainingFieldError({ message }: { message: string }) {
  return (
    <p className="support_service_training_request__error" role="alert">
      {message}
    </p>
  );
}
