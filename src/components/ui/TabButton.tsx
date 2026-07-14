// data-* 속성 전달을 위한 타입 (data-slug-item, data-slugKey 등 마크업 태깅용)
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
  ...rest // data-* 속성을 내부 실제 button 엘리먼트로 forward
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
