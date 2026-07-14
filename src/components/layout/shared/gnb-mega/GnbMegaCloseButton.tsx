"use client";

type GnbMegaCloseButtonProps = {
  onClose: () => void;
};

export default function GnbMegaCloseButton({ onClose }: GnbMegaCloseButtonProps) {
  return (
    <button
      type="button"
      className="gnb_mega__close"
      aria-label="Close menu"
      onClick={onClose}
    >
      <img src="/ico/ico_close_24.svg" alt="" width={20} height={20} />
    </button>
  );
}
