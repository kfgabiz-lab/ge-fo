"use client";

import { FormControl, MenuItem } from "@mui/material";
import { useState } from "react";
import { GuideSelectIcon } from "@/components/form/GuideFieldIcons";
import GuideSelect from "@/components/form/GuideSelect";
import { privacyPolicyPage } from "@/data/common/privacyPolicyPageContent";

export default function PrivacyPolicyBody() {
  const {
    versions,
    defaultVersion,
    versionPlaceholder,
    intro,
    toc,
    outro,
    sections,
  } = privacyPolicyPage;
  const [version, setVersion] = useState<string>(defaultVersion);

  return (
    <section className="common_privacy_policy" id="privacy-policy-body">
      <div className="inner">
        <div className="common_privacy_policy__toolbar">
          {/* /guide/components #dropdown — Select_50px · 200px */}
          <FormControl className="guide_field guide_field--h50 guide_field--w200">
            <GuideSelect
              value={version}
              onChange={(event) => setVersion(String(event.target.value))}
              displayEmpty
              IconComponent={GuideSelectIcon}
              inputProps={{ "aria-label": "Privacy Policy version date" }}
              renderValue={(value) => {
                const selected = versions.find(
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
              <MenuItem value="">{versionPlaceholder}</MenuItem>
              {versions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </GuideSelect>
          </FormControl>
        </div>

        <div className="common_privacy_policy__content">
          <div className="common_privacy_policy__intro">
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
          </div>

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
        </div>
      </div>
    </section>
  );
}
