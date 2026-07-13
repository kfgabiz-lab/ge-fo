type GnbMobileBackProps = {
  label: string;
  onBack: () => void;
};

export default function GnbMobileBack({ label, onBack }: GnbMobileBackProps) {
  return (
    <button type="button" className="gnb_mobile_back" onClick={onBack}>
      <span className="gnb_mobile_back__icon" aria-hidden />
      {label}
    </button>
  );
}
