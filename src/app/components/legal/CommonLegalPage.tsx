import CommonLegalBody, { type CommonLegalPageContent } from "./CommonLegalBody";

type CommonLegalPageProps = {
  bodyId: string;
  content: CommonLegalPageContent;
  pageId: string;
  selectAriaLabel: string;
  termsType: "1" | "2" | "3";
  titleId: string;
};

export default function CommonLegalPage({
  bodyId,
  content,
  pageId,
  selectAriaLabel,
  termsType,
  titleId,
}: CommonLegalPageProps) {
  return (
    <main className="common-page common-page--privacy-policy" id={pageId}>
      <section className="common_privacy_policy_title" id={titleId}>
        <div className="inner">
          <h1 className="common_privacy_policy_title__heading">
            {content.title}
          </h1>
        </div>
      </section>
      <CommonLegalBody
        bodyId={bodyId}
        content={content}
        selectAriaLabel={selectAriaLabel}
        termsType={termsType}
      />
    </main>
  );
}
