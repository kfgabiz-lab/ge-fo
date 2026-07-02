"use client";

import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  InputLabel,
  MenuItem,
  TextField,
} from "@mui/material";
import Link from "next/link";
import { useState } from "react";
import GuideSelect from "@/components/common/guide-select";
import "@/assets/css/components/MainFooter.css";

const occupationOptions = [
  "Engineer",
  "Manager",
  "Executive",
  "Consultant",
  "Other",
];

const productOptions = ["Power Solution", "Automation Solution"];

const legalLinks = [
  { label: "Privacy Policy", href: "" },
  { label: "Terms of Use", href: "" },
  { label: "Cookie Policy", href: "" },
  { label: "Change Your Cookie Setting", href: "" },
];

const affiliateOptions = [
  { value: "lse-global", label: "LS ELECTRIC Global" },
  { value: "lse-america", label: "LS ELECTRIC America" },
  { value: "lse-europe", label: "LS ELECTRIC Europe" },
  { value: "lse-asia", label: "LS ELECTRIC Asia" },
];

const snsLinks = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/lselectric",
    className: "link_linkedin",
    icon: "/img/footer/ico_linkedin_40.svg",
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/lselectric_official",
    className: "link_insta",
    icon: "/img/footer/ico_insta_40.svg",
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/channel/UCS4SwwqhnNK4072O8BDZtLg",
    className: "link_youtube",
    icon: "/img/footer/ico_youtube_40.svg",
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/lselectricofficial",
    className: "link_facebook",
    icon: "/img/footer/ico_face_40.svg",
  },
] as const;

type MainFooterProps = {
  logoHref?: string;
};

function FooterSelectIcon({
  className,
  ...rest
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={["main_footer__select-icon", className].filter(Boolean).join(" ")}
      aria-hidden
      {...rest}
    />
  );
}

function FooterCheckboxIcon({ checked = false }: { checked?: boolean }) {
  return (
    <img loading="lazy" decoding="async"
      src={checked ? "/ico/ico_checked.svg" : "/ico/ico_check.svg"}
      alt=""
      width={22}
      height={22}
      className="main_footer__checkbox-icon"
      aria-hidden
    />
  );
}

export default function MainFooter({ logoHref = "/main" }: MainFooterProps) {
  const [email, setEmail] = useState("");
  const [occupation, setOccupation] = useState("");
  const [products, setProducts] = useState<string[]>([]);
  const [affiliate, setAffiliate] = useState("");

  const handleProductChange = (value: string, checked: boolean) => {
    setProducts((prev) =>
      checked ? [...prev, value] : prev.filter((item) => item !== value),
    );
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <footer className="main_footer">
      <div className="main_footer__inner">
        <div className="main_footer__intro">
          <h2 className="main_footer__tit">
            Subscribe Newsletter: <br />
            Efficiency, Delivered Directly.
          </h2>
          <p className="main_footer__desc">
            Subscribe to receive real-world case studies, energy-saving tips,{" "}
            <br className="main_footer__br-pc" />
            and optimized configuration guides tailored for your industry.
          </p>
        </div>

        <div className="main_footer__form">
          <form action="" onSubmit={handleSubmit}>
            <div className="main_footer__fields">
              <TextField
                className="main_footer__field"
                label="Email Address"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />

              <FormControl className="main_footer__field">
                <InputLabel id="main-footer-occupation-label">
                  Occupation
                </InputLabel>
                <GuideSelect
                  labelId="main-footer-occupation-label"
                  label="Occupation"
                  value={occupation}
                  onChange={(event) =>
                    setOccupation(String(event.target.value))
                  }
                  IconComponent={FooterSelectIcon}
                  MenuProps={{
                    slotProps: {
                      paper: { className: "main_footer__select-menu" },
                    },
                  }}
                >
                  {occupationOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </GuideSelect>
              </FormControl>

              <div className="main_footer__products">
                <h3 className="main_footer__products-tit">
                  Product(s) of Interest
                </h3>
                <FormGroup row className="main_footer__product-checks">
                  {productOptions.map((option) => (
                    <FormControlLabel
                      key={option}
                      control={
                        <Checkbox
                          className="main_footer__checkbox"
                          checked={products.includes(option)}
                          icon={<FooterCheckboxIcon />}
                          checkedIcon={<FooterCheckboxIcon checked />}
                          onChange={(event) =>
                            handleProductChange(option, event.target.checked)
                          }
                        />
                      }
                      label={option}
                      className="main_footer__product-check"
                    />
                  ))}
                </FormGroup>
              </div>
            </div>

            <div className="main_footer__submit">
              <button type="submit" className="btn_flat">
                Get Insights
              </button>
              <p className="main_footer__agree">
                and I agree with the terms of use as described in the{" "}
                <a href="">Privacy Policy.</a>
              </p>
            </div>
          </form>
        </div>
      </div>

      <div className="main_footer_02">
        <div className="main_footer_02__inner">
          <div className="main_footer_02__left">
            <Link href={logoHref} className="main_footer_02__logo">
              <img loading="lazy" decoding="async" src="/img/logo_white.png" alt="LS ELECTRIC" />
            </Link>
            <p className="main_footer_02__copyright">
              짤 2024 LS ELECTRIC Co., Ltd. All Rights Reserved.
            </p>
            <FormControl className="main_footer_02__affiliate">
              <GuideSelect
                displayEmpty
                value={affiliate}
                onChange={(event) =>
                  setAffiliate(String(event.target.value))
                }
                IconComponent={FooterSelectIcon}
                renderValue={(selected) =>
                  selected
                    ? affiliateOptions.find((item) => item.value === selected)
                        ?.label
                    : "LSE Affiliated & Subsidiaries"
                }
                MenuProps={{
                  slotProps: {
                    paper: { className: "main_footer__select-menu" },
                  },
                }}
              >
                {affiliateOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </GuideSelect>
            </FormControl>
          </div>

          <div className="main_footer_02__right">
            <nav
              className="main_footer_02__legal"
              aria-label="Footer legal links"
            >
              {legalLinks.map((item, index) => (
                <span key={item.label} className="main_footer_02__legal-item">
                  <Link href={item.href} className="main_footer_02__legal-link">
                    {item.label}
                  </Link>
                  {index < legalLinks.length - 1 ? (
                    <span
                      className="main_footer_02__legal-sep"
                      aria-hidden="true"
                    >
                      |
                    </span>
                  ) : null}
                </span>
              ))}
            </nav>

            <div className="main_footer_02__sns">
              {snsLinks.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className={item.className}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={item.label}
                >
                  <img loading="lazy" decoding="async" src={item.icon} alt="" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

