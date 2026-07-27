export default function RequestForTrainingFieldLabel({
  children,
  required = false,
  htmlFor,
}: {
  children: React.ReactNode;
  required?: boolean;
  htmlFor?: string;
}) {
  return (
    <label className="support_service_training_request__field-label" htmlFor={htmlFor}>
      {children}
      {required ? (
        <span className="support_service_training_request__required" aria-hidden>
          {" "}
          *
        </span>
      ) : null}
    </label>
  );
}
