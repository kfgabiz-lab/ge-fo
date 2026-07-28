type ProductAwardBadgeProps = {
  /**
   * 데이터 바인딩 태깅용 slugKey (예: "product.awards").
   * 미전달 시 React가 속성 자체를 렌더링하지 않으므로, 기존 사용처
   * (main_products / markets_products / devices_products / devices_product_other)의 DOM은 그대로 유지된다.
   */
  dataSlugKey?: string;
};

export default function ProductAwardBadge({
  dataSlugKey,
}: ProductAwardBadgeProps = {}) {
  return (
    <div className="product_award_badge" data-slugkey={dataSlugKey}>
      <span className="product_award_badge__icon" aria-hidden="true" />
    </div>
  );
}
