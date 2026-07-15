// 개행(\n) 기준으로 텍스트를 여러 줄로 나눠 <br/>로 구분해 렌더링한다.
// 각 줄은 trim 처리하며 빈 줄은 제거한다.
// products-systems 내 제품 상세 컴포넌트들이 공통으로 사용한다.
export function renderMultilineText(text: string) {
  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  return lines.map((line, index) => (
    <span key={`${line}-${index}`}>
      {line}
      {index < lines.length - 1 ? <br /> : null}
    </span>
  ));
}
