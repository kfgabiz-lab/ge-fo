"use client";
import { fetchApi } from "@/lib/api";
import {
  Checkbox,
  ClickAwayListener,
  FormControlLabel,
  FormGroup,
  TextField,
} from "@mui/material";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { footerAffiliateOptions } from "@/data/footerAffiliateOptions";
import "@/assets/css/components/MainFooter.css";
import CookiePreferencesModal from "@/components/modals/CookiePreferencesModal";
import CookieSettingsModal from "@/components/modals/CookieSettingsModal";
import { COOKIE_CONSENT_STORAGE_KEY } from "@/data/common/cookieSettingsContent";

const EMAIL_FORMAT_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const interestOptions = [
  { value: "LV & MV Power Solutions", defaultChecked: false },
  { value: "Grid & Utility Infrastructure", defaultChecked: false },
  { value: "Automation & Industrial Control", defaultChecked: false },
] as const;

const legalLinks = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms of Service", href: "/terms-of-service" },
  { label: "General Terms of Purchase", href: "/general-terms-of-purchase" },
  { label: "Change Your Cookie Setting", opensCookieSettingsModal: true },
] as const;

const snsLinks = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/lselectricamerica/jobs/",
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
    <span
      className={`main_footer__checkbox-icon${
        checked ? " main_footer__checkbox-icon--checked" : ""
      }`}
      aria-hidden
    />
  );
}

export default function MainFooter({ logoHref = "/main" }: MainFooterProps) {
  const [email, setEmail] = useState("");
  const [interests, setInterests] = useState<string[]>(() =>
    interestOptions
      .filter((option) => option.defaultChecked)
      .map((option) => option.value),
  );
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [affiliateOpen, setAffiliateOpen] = useState(false);
  const [cookieSettingsOpen, setCookieSettingsOpen] = useState(false);
  const [cookiePreferencesOpen, setCookiePreferencesOpen] = useState(false);
  const [emailError, setEmailError] = useState(false);

  useEffect(() => {
    try {
      const savedConsent = window.localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY);

      if (!savedConsent) {
        setCookieSettingsOpen(true);
      }
    } catch {
      setCookieSettingsOpen(true);
    }
  }, []);

  const closeAffiliateMenu = useCallback(() => {
    setAffiliateOpen(false);
  }, []);

  const toggleAffiliateMenu = useCallback(() => {
    setAffiliateOpen((prev) => !prev);
  }, []);

  useEffect(() => {
    if (!affiliateOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeAffiliateMenu();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [affiliateOpen, closeAffiliateMenu]);

  const handleInterestChange = (value: string, checked: boolean) => {
    setInterests((prev) =>
      checked ? [...prev, value] : prev.filter((item) => item !== value),
    );
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedEmail = email.trim();
    const emailValid =
      trimmedEmail !== "" && EMAIL_FORMAT_REGEX.test(trimmedEmail);
    setEmailError(!emailValid);

    if (!emailValid) {
      alert(
        trimmedEmail === ""
          ? "Please enter your email address."
          : "Please enter a valid email address.",
      );
      return;
    }

    if (interests.length === 0) {
      alert("Please select at least one area of interest to continue.");
      return; 
    }

    if (!agreedToTerms) {
      alert("Please agree to the Privacy Policy to continue.");
      return;
    }

    const payload = {
      email: trimmedEmail,
      areasOfInterest: interests.join(", "),
    };
    try {
      const response = await fetchApi<{ success: boolean }>(
        "/api/v1/fo/newsletter/insights",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
      );

      if (response.success) {
        alert("Successfully Subscribed!\nThank you for joining. We'll be in touch soon with the latest from LS ELECTRIC.");
        setEmail("");
        setInterests([]); // Areas of interest reset
        setAgreedToTerms(false);
        setEmailError(false);
      }

    } catch (error) {
      alert("A server error occurred. Please try again later.");
    
    }
  };

  const handleAffiliateSelect = (value: string) => {
    const option = footerAffiliateOptions.find((item) => item.value === value);
    if (option?.href) {
      window.open(option.href, "_blank", "noopener,noreferrer");
    }
    closeAffiliateMenu();
  };

  const handleCookiePreferencesOpen = () => {
    setCookieSettingsOpen(false);
    setCookiePreferencesOpen(true);
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
              <div className="main_footer__field-group">
                <label htmlFor="main-footer-email" className="main_footer__field-label">
                  Email
                </label>
                <TextField
                  id="main-footer-email"
                  className="main_footer__field"
                  type="email"
                  placeholder="Email address"
                  error={emailError}
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    if (emailError) setEmailError(false);
                  }}
                />
              </div>

              <div className="main_footer__interests">
                <h3 className="main_footer__interests-tit">Areas of Interest</h3>
                <FormGroup row className="main_footer__interest-checks">
                  {interestOptions.map((option) => (
                    <FormControlLabel
                      key={option.value}
                      control={
                        <Checkbox
                          className="main_footer__checkbox"
                          checked={interests.includes(option.value)}
                          icon={<FooterCheckboxIcon />}
                          checkedIcon={<FooterCheckboxIcon checked />}
                          onChange={(event) =>
                            handleInterestChange(option.value, event.target.checked)
                          }
                        />
                      }
                      label={option.value}
                      className="main_footer__interest-check"
                    />
                  ))}
                </FormGroup>
              </div>
            </div>

            <div className="main_footer__submit">
              <button type="submit" className="btn_flat">
                Get Insights
              </button>
              <FormControlLabel
                control={
                  <Checkbox
                    className="main_footer__checkbox"
                    checked={agreedToTerms}
                    icon={<FooterCheckboxIcon />}
                    checkedIcon={<FooterCheckboxIcon checked />}
                    onChange={(event) => setAgreedToTerms(event.target.checked)}
                    slotProps={{ input: { id: "main-footer-agree", name: "agree" } }}
                  />
                }
                label={
                  <span className="main_footer__agree">
                    I agree with the terms of use as described in the{" "}
                    <Link href="/privacy-policy" className="main_footer__agree-link">
                      Privacy Policy.
                    </Link>
                  </span>
                }
                className="main_footer__agree-check"
              />
            </div>
          </form>
        </div>
      </div>

      <div className="main_footer_02">
        <div className="main_footer_02__inner">
          <div className="main_footer_02__left">
            <Link href={logoHref} className="main_footer_02__logo">
              <img loading="lazy" decoding="async" src="/img/logo_white.svg" alt="LS ELECTRIC" />
            </Link>
            <p className="main_footer_02__copyright">
              © 2026 LS ELECTRIC Co., Ltd. All Rights Reserved.
            </p>
            <div className="main_footer_02__affiliate">
              <ClickAwayListener onClickAway={closeAffiliateMenu}>
                <div className="main_footer_02__affiliate-inner">
                  <button
                    type="button"
                    className="main_footer_02__affiliate-trigger"
                    aria-haspopup="listbox"
                    aria-expanded={affiliateOpen}
                    aria-controls="main-footer-affiliate-listbox"
                    onClick={toggleAffiliateMenu}
                  >
                    LS ELECTRIC Affiliated &amp; Subsidiaries
                    <FooterSelectIcon className="main_footer_02__affiliate-trigger__icon" />
                  </button>
                  {affiliateOpen ? (
                    <div
                      className="main_footer__select-menu main_footer__select-menu--affiliate"
                      style={
                        {
                          "--main-footer-affiliate-option-count":
                            footerAffiliateOptions.length,
                        } as React.CSSProperties
                      }
                    >
                      <ul
                        id="main-footer-affiliate-listbox"
                        className="main_footer__select-menu-list"
                        role="listbox"
                        aria-label="Affiliated and subsidiaries"
                      >
                        {footerAffiliateOptions.map((option) => (
                          <li key={option.value} role="none">
                            <button
                              type="button"
                              role="option"
                              aria-selected={false}
                              className="main_footer__select-menu__option"
                              onClick={() => handleAffiliateSelect(option.value)}
                            >
                              {option.label}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </div>
              </ClickAwayListener>
            </div>
          </div>

          <div className="main_footer_02__right">
            <nav
              className="main_footer_02__legal"
              aria-label="Footer legal links"
            >
              {legalLinks.map((item, index) => (
                <span key={item.label} className="main_footer_02__legal-item">
                {"opensCookieSettingsModal" in item ? (
                  <button
                    type="button"
                    className="main_footer_02__legal-link"
                    onClick={() => setCookieSettingsOpen(true)}
                  >
                    {item.label}
                  </button>
                ) : (
                  <Link href={item.href} className="main_footer_02__legal-link">
                    {item.label}
                  </Link>
                )}
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
      <CookieSettingsModal
        open={cookieSettingsOpen}
        onClose={() => setCookieSettingsOpen(false)}
        onSettings={handleCookiePreferencesOpen}
      />
      <CookiePreferencesModal
        open={cookiePreferencesOpen}
        onClose={() => setCookiePreferencesOpen(false)}
      />
    </footer>
  );
}