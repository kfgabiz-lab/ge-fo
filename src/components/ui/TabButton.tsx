type DataAttributes = {
  [key: `data-${string}`]: string | boolean | undefined;
};

type TabButtonProps = {
  id: string;
  label: string;
  isActive: boolean;
  controls: string;
  onSelect: () => void;
} & DataAttributes;

export default function TabButton({
  id,
  label,
  isActive,
  controls,
  onSelect,
  ...rest
}: TabButtonProps) {
  return (
    <button
      type="button"
      role="tab"
      id={id}
      aria-selected={isActive}
      aria-controls={controls}
      className={isActive ? "tab_btn is-active" : "tab_btn"}
      onClick={onSelect}
      {...rest}
    >
      {label}
    </button>
  );
}
