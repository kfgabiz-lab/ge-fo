"use client";

type CommonBanner02CopyLinkProps = {
  value: string;
  label?: string;
};

export default function CommonBanner02CopyLink({
  value,
  label = "Copy Email",
}: CommonBanner02CopyLinkProps) {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <button
      type="button"
      className="btn-base btn-line-30 btn-line-30--on-dark"
      onClick={handleCopy}
    >
      {label}
      <span
        className="btn-line-30__icon btn-line-30__icon--copy"
        aria-hidden="true"
      />
    </button>
  );
}
