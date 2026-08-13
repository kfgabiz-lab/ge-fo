export default function RequestForTrainingFieldLabel({
  children,
  required = false,
  htmlFor,
  className,
}: {
  children: React.ReactNode;
  required?: boolean;
  htmlFor?: string;
  className?: string;
}) {
  return (
    <label
      className={["support_service_training_request__field-label", className]
        .filter(Boolean)
        .join(" ")}
      htmlFor={htmlFor}
    >
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
