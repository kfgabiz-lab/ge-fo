/** BEM helper — Server/Client 공용 (CompanyArticleDetail 마크업) */
export function articleDetailClass(element: string, modifier?: string) {
  const base = `company-article-detail__${element}`;
  return modifier ? `${base} company-article-detail__${element}--${modifier}` : base;
}
