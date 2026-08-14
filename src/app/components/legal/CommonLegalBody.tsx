"use client";

import { FormControl, MenuItem } from "@mui/material";
import { useEffect, useState } from "react";
import { GuideSelectIcon } from "@/components/form/GuideFieldIcons";
import GuideSelect from "@/components/form/GuideSelect";
import { fetchData } from "@/lib/pageDataApi";

export type CommonLegalPageContent = {
  title: string;
  versionPlaceholder: string;
  versions: readonly {
    value: string;
    label: string;
  }[];
  defaultVersion: string;
  intro: readonly string[];
  toc: readonly string[];
  outro: readonly string[];
  sections: readonly {
    heading: string;
    paragraphs: readonly string[];
    blocks: readonly string[];
  }[];
};

type TermsType = "1" | "2" | "3";

type TermsRow = {
  content?: string;
  createdAt?: string | null;
  publish_dttm?: string;
};

type TermsEntry = {
  value: string;
  label: string;
  content: string;
};

type CommonLegalBodyProps = {
  bodyId: string;
  content: CommonLegalPageContent;
  selectAriaLabel: string;
  termsType: TermsType;
};

function getDateValue(row: TermsRow): string {
  const raw = row.publish_dttm ?? row.createdAt ?? "";
  return raw.slice(0, 10);
}

// mm dd, yyyy 형식으로 날짜 포맷
function formatLegalDate(date: string): string {
  const [year, month, day] = date.split("-");
  if (!year || !month || !day) return date;
  return `${month} ${day}, ${year}`;
}

export default function CommonLegalBody({
  bodyId,
  content,
  selectAriaLabel,
  termsType,
}: CommonLegalBodyProps) {
  const {
    versions,
    defaultVersion,
    versionPlaceholder,
    intro,
    toc,
    outro,
    sections,
  } = content;
  const [version, setVersion] = useState<string>(defaultVersion);
  const [termsEntries, setTermsEntries] = useState<TermsEntry[]>([]);
  const [activeContent, setActiveContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);

    fetchData<TermsRow>({
      slug: "termsMgmt-data",
      where: { "eq_terms.terms_type": termsType },
      size: 10,
      page: 0,
      sort: "createdAt,desc",
    })
      .then((res) => {
        if (cancelled) return;

        const entries = (res.content ?? [])
          .map((row) => {
            const date = getDateValue(row);
            return {
              value: date,
              label: formatLegalDate(date),
              content: row.content ?? "",
            } satisfies TermsEntry;
          })
          .filter((entry) => entry.value);

        setTermsEntries(entries);
        setIsLoading(false);

        if (entries.length > 0) {
          setVersion(entries[0].value);
          setActiveContent(entries[0].content);
        } else {
          setVersion(defaultVersion);
          setActiveContent("");
        }
      })
      .catch(() => {
        if (!cancelled) {
          setTermsEntries([]);
          setIsLoading(false);
          setVersion(defaultVersion);
          setActiveContent("");
        }
      });

    return () => {
      cancelled = true;
    };
  }, [termsType]);

  const handleVersionChange = (nextVersion: string) => {
    if (!nextVersion) return;
    setVersion(nextVersion);
    const selectedEntry = termsEntries.find(
      (entry) => entry.value === nextVersion,
    );
    setActiveContent(selectedEntry?.content ?? "");
  };

  const versionOptions = termsEntries.length > 0 ? termsEntries : versions;
  const showFallbackContent = !isLoading && !activeContent && termsEntries.length === 0;

  return (
    <section className="common_privacy_policy" id={bodyId}>
      <div className="inner">
        <div className="common_privacy_policy__toolbar">
          <FormControl className="guide_field guide_field--h50 guide_field--w200">
            <GuideSelect
              value={version}
              onChange={(event) =>
                handleVersionChange(String(event.target.value))
              }
              displayEmpty
              IconComponent={GuideSelectIcon}
              inputProps={{ "aria-label": selectAriaLabel }}
              renderValue={(value) => {
                const selected = versionOptions.find(
                  (option) => option.value === String(value),
                );
                const text = selected?.label ?? versionPlaceholder;
                return (
                  <span className="guide_field__select-value" title={text}>
                    {text}
                  </span>
                );
              }}
            >
              {/* versionPlaceholder 가 목록에도 나오고 있어 삭제처리
              <MenuItem value="" disabled>{versionPlaceholder}</MenuItem> */}
              {versionOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </GuideSelect>
          </FormControl>
        </div>

        <div className="common_privacy_policy__content">
          {isLoading ? null : activeContent ? (
            <article
              className="common_privacy_policy__body ProseMirror"
              dangerouslySetInnerHTML={{ __html: activeContent }}
            />
          ) : showFallbackContent ? (
            <>
              <article className="common_privacy_policy__intro ProseMirror">
                {intro.map((paragraph, index) => (
                  <p key={`intro-${index}`}>{paragraph}</p>
                ))}
                <ol className="common_privacy_policy__toc">
                  {toc.map((item, index) => (
                    <li key={`toc-${index}`}>
                      {index + 1}. {item}
                    </li>
                  ))}
                </ol>
                {outro.map((paragraph, index) => (
                  <p key={`outro-${index}`}>{paragraph}</p>
                ))}
              </article>

              {sections.map((section) => (
                <article
                  key={section.heading}
                  className="common_privacy_policy__section"
                >
                  <h2 className="common_privacy_policy__section-tit">
                    {section.heading}
                  </h2>
                  <div className="common_privacy_policy__section-body">
                    {section.paragraphs.map((paragraph, index) => (
                      <p key={`section-p-${index}`}>{paragraph}</p>
                    ))}
                    <div className="common_privacy_policy__blocks">
                      {section.blocks.map((line, index) => (
                        <p key={`section-b-${index}`}>{line}</p>
                      ))}
                    </div>
                  </div>
                </article>
              ))}
            </>
          ) : null}
        </div>
      </div>
    </section>
  );
}
