"use client";

import {
  Checkbox,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  TextField,
} from "@mui/material";
import { Suspense, useState } from "react";
import {
  GuideCheckboxIcon,
  GuideSelectIcon,
  guideCheckboxIconsDefault,
  guideCheckboxIconsDownloads,
  guideFieldLabelSlot,
} from "@/components/form/GuideFieldIcons";
import GuideSelect from "@/components/form/GuideSelect";
import GuideNav from "@/components/guide/GuideNav";
import GuideRelated from "@/components/guide/GuideRelated";
import CommonBanner01 from "@/components/banners/CommonBanner01";
import CommonBanner02 from "@/components/banners/CommonBanner02";
import CommonBanner03 from "@/components/banners/CommonBanner03";
import CommonBanner04 from "@/components/banners/CommonBanner04";
import PageNumbering from "@/components/pagination/PageNumbering";
import SearchAllHero from "@/app/()/search/components/SearchAllHero";
import SwiperBarControls from "@/components/swiper/SwiperBarControls";
import SwiperNavButtons from "@/components/swiper/SwiperNavButtons";

/** Figma 04_Button, 05_Check, 06_Textfield, 07 Pagination, 08 Banner */
export default function ComponentGuide() {
  const [rollingIndex, setRollingIndex] = useState(1);
  const rollingCount = 4;

  return (
    <section className="component-guide">
      <header className="component-guide__top" id="button">
        <div className="component-guide__top-inner">
          <div className="component-guide__brand">
            <span className="component-guide__num">04</span>
            <h1 className="component-guide__title">Button</h1>
          </div>
          <div className="component-guide__date">
            <span>DATE</span>
            <span className="component-guide__date-sep" aria-hidden="true" />
            <strong>2026.05.26</strong>
          </div>
        </div>
      </header>

      <div className="component-guide__body">
        <p className="component-guide__intro">
          Figma 04~08 공통 UI 패턴. 아이콘 목록은{" "}
          <a href="/guide/ico">Icon Guide</a>, GNB·메가 메뉴는{" "}
          <a href="/guide/gnb">GNB Guide</a> · <code>docs/GNB_GUIDE.md</code>
        </p>
        <GuideRelated excludeHref="/guide/components" />
        <GuideNav current="components" />

        <nav className="component-guide__toc" aria-label="컴포넌트 목록">
          <a href="#button" aria-current="true">
            04 Button
          </a>
          <a href="#check">05 Check</a>
          <a href="#textfield">06 Textfield</a>
          <a href="#pagination">07 Pagination</a>
          <a href="#banner">08 Banner</a>
        </nav>

        {/* Level 01 — 52px */}
        <div className="component-guide__section" id="level-01">
          <h2 className="component-guide__section-tit">Level 01_52px</h2>

          <div className="component-guide__type">
            <h3 className="component-guide__type-tit">1. 이미지 위에 있을 경우 사용</h3>
            <p className="component-guide__type-spec">
              <span>최소사이즈 220px</span>
              <span className="component-guide__type-spec-sep" />
              <span>Icon 18px</span>
            </p>
            <div className="component-guide__states">
              <div className="component-guide__state-col">
                <span className="component-guide__state-label">Default</span>
                <div className="component-guide__preview-dark">
                  <a href="" className="btn-base btn-lv01 btn-lv01--line-solid">
                    Explore
                  </a>
                </div>
              </div>
              <div className="component-guide__state-col">
                <span className="component-guide__state-label">Hover</span>
                <div className="component-guide__preview-dark">
                  <a
                    href=""
                    className="btn-base btn-lv01 btn-lv01--line-solid"
                    data-hover-demo
                  >
                    Explore
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="component-guide__type">
            <h3 className="component-guide__type-tit">2. Solid</h3>
            <p className="component-guide__type-spec">
              <span>최소사이즈 220px</span>
              <span className="component-guide__type-spec-sep" />
              <span>Icon 18px</span>
            </p>
            <div className="component-guide__states">
              <div className="component-guide__state-col">
                <span className="component-guide__state-label">Default</span>
                <div className="component-guide__preview-light">
                  <a href="" className="btn-base btn-lv01 btn-lv01--solid">
                    Get the Whitepaper
                  </a>
                </div>
              </div>
              <div className="component-guide__state-col">
                <span className="component-guide__state-label">Hover</span>
                <div className="component-guide__preview-light">
                  <a
                    href=""
                    className="btn-base btn-lv01 btn-lv01--solid"
                    style={{ background: "var(--color-primary-hover)" }}
                  >
                    Get the Whitepaper
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="component-guide__type">
            <h3 className="component-guide__type-tit">3. Line</h3>
            <p className="component-guide__type-spec">
              <span>최소사이즈 220px</span>
              <span className="component-guide__type-spec-sep" />
              <span>Icon 18px</span>
            </p>
            <div className="component-guide__states">
              <div className="component-guide__state-col">
                <span className="component-guide__state-label">Default</span>
                <div className="component-guide__preview-light">
                  <a href="" className="btn-base btn-lv01 btn-lv01--line">
                    Get the Whitepaper
                  </a>
                </div>
              </div>
              <div className="component-guide__state-col">
                <span className="component-guide__state-label">Hover</span>
                <div className="component-guide__preview-light">
                  <a href="" className="btn-base btn-lv01 btn-lv01--line">
                    Get the Whitepaper
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Level 02 — 46px */}
        <div className="component-guide__section" id="level-02">
          <h2 className="component-guide__section-tit">Level 02_46px</h2>

          <div className="component-guide__type">
            <h3 className="component-guide__type-tit">1. Solid</h3>
            <p className="component-guide__type-spec">
              <span>최소사이즈 150px</span>
              <span className="component-guide__type-spec-sep" />
              <span>Icon 14px</span>
            </p>
            <div className="component-guide__states">
              <div className="component-guide__state-col">
                <span className="component-guide__state-label">Default</span>
                <div className="component-guide__preview-light">
                  <a href="" className="btn-base btn-lv02 btn-lv02--solid">
                    Go to Configurator
                  </a>
                </div>
              </div>
              <div className="component-guide__state-col">
                <span className="component-guide__state-label">Hover</span>
                <div className="component-guide__preview-light">
                  <a
                    href=""
                    className="btn-base btn-lv02 btn-lv02--solid"
                    style={{ background: "var(--color-primary-hover)" }}
                  >
                    Go to Configurator
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="component-guide__type">
            <h3 className="component-guide__type-tit">2. Line + Solid</h3>
            <p className="component-guide__type-spec">
              <span>최소사이즈 150px</span>
              <span className="component-guide__type-spec-sep" />
              <span>Icon 14px</span>
            </p>
            <div className="component-guide__states">
              <div className="component-guide__state-col">
                <span className="component-guide__state-label">Default</span>
                <div className="component-guide__preview-light">
                  <a href="" className="btn-base btn-lv02 btn-lv02--more">
                    Read more
                    <span className="icon_plus" aria-hidden="true" />
                  </a>
                </div>
              </div>
              <div className="component-guide__state-col">
                <span className="component-guide__state-label">Hover</span>
                <div className="component-guide__preview-light">
                  <a
                    href=""
                    className="btn-base btn-lv02 btn-lv02--more"
                    style={{
                      color: "#fff",
                      background: "var(--color-primary)",
                      borderColor: "var(--color-primary)",
                    }}
                  >
                    Read more
                    <span className="icon_plus" aria-hidden="true" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Level 03 — 42px */}
        <div className="component-guide__section" id="level-03">
          <h2 className="component-guide__section-tit">Level 03_42px</h2>

          <div className="component-guide__type">
            <h3 className="component-guide__type-tit">1. Solid</h3>
            <p className="component-guide__type-spec">
              <span>최소사이즈 150px</span>
            </p>
            <div className="component-guide__states">
              <div className="component-guide__state-col">
                <span className="component-guide__state-label">Default</span>
                <div className="component-guide__preview-light">
                  <a href="" className="btn-base btn-lv03 btn-lv03--solid">
                    View Detail
                  </a>
                </div>
              </div>
              <div className="component-guide__state-col">
                <span className="component-guide__state-label">Hover</span>
                <div className="component-guide__preview-light">
                  <a
                    href=""
                    className="btn-base btn-lv03 btn-lv03--solid"
                    style={{ background: "var(--color-primary-hover)" }}
                  >
                    View Detail
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="component-guide__type">
            <h3 className="component-guide__type-tit">2. Line</h3>
            <p className="component-guide__type-spec">
              <span>최소사이즈 150px</span>
            </p>
            <div className="component-guide__states">
              <div className="component-guide__state-col">
                <span className="component-guide__state-label">Default</span>
                <div className="component-guide__preview-light">
                  <a href="" className="btn-base btn-lv03 btn-lv03--line">
                    Where to buy
                  </a>
                </div>
              </div>
              <div className="component-guide__state-col">
                <span className="component-guide__state-label">Hover</span>
                <div className="component-guide__preview-light">
                  <a href="" className="btn-base btn-lv03 btn-lv03--line">
                    Where to buy
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="component-guide__type">
            <h3 className="component-guide__type-tit">3. Line + Download</h3>
            <p className="component-guide__type-spec">
              <span>최소사이즈 150px</span>
              <span className="component-guide__type-spec-sep" />
              <span>Icon 16px · icon_download</span>
            </p>
            <div className="component-guide__states">
              <div className="component-guide__state-col">
                <span className="component-guide__state-label">Default</span>
                <div className="component-guide__preview-light">
                  <a href="" className="btn-base btn-lv03 btn-lv03--line">
                    Download
                    <span className="icon_download" aria-hidden="true" />
                  </a>
                </div>
              </div>
              <div className="component-guide__state-col">
                <span className="component-guide__state-label">Hover</span>
                <div className="component-guide__preview-light">
                  <a href="" className="btn-base btn-lv03 btn-lv03--line">
                    Download
                    <span className="icon_download" aria-hidden="true" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Icon 56px */}
        <div className="component-guide__section" id="icon-56">
          <h2 className="component-guide__section-tit">Icon_56px</h2>
          <p className="component-guide__type-spec">
            <span>Icon 20px</span>
          </p>
          <div className="component-guide__states">
            <div className="component-guide__state-col">
              <span className="component-guide__state-label">Default</span>
              <div className="component-guide__preview-light">
                <button type="button" className="btn-icon-56" aria-label="Next">
                  <span className="icon_arrow-20" aria-hidden="true" />
                </button>
              </div>
            </div>
            <div className="component-guide__state-col">
              <span className="component-guide__state-label">Hover</span>
              <div className="component-guide__preview-light">
                <button
                  type="button"
                  className="btn-icon-56"
                  aria-label="Next"
                  style={{
                    background: "rgb(230 0 64 / 70%)",
                    borderColor: "transparent",
                  }}
                >
                  <span
                    className="icon_arrow-20"
                    aria-hidden="true"
                    style={{ filter: "brightness(0) invert(1)" }}
                  />
                </button>
              </div>
            </div>
          </div>
          <p className="component-guide__type-spec" style={{ marginTop: 32 }}>
            <span>Top — white / #ddd border / up arrow</span>
          </p>
          <div className="component-guide__states">
            <div className="component-guide__state-col">
              <span className="component-guide__state-label">Default</span>
              <div className="component-guide__preview-light">
                <button
                  type="button"
                  className="btn-icon-56 btn-icon-56--top"
                  aria-label="Scroll to top"
                >
                  <span className="icon_arrow-top-20" aria-hidden="true" />
                </button>
              </div>
            </div>
            <div className="component-guide__state-col">
              <span className="component-guide__state-label">Hover</span>
              <div className="component-guide__preview-light">
                <button
                  type="button"
                  className="btn-icon-56 btn-icon-56--top"
                  aria-label="Scroll to top"
                  style={{ borderColor: "#bbb" }}
                >
                  <span className="icon_arrow-top-20" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Text 30px */}
        <div className="component-guide__section" id="text-30">
          <h2 className="component-guide__section-tit">Text_30px</h2>
          <p className="component-guide__type-spec">
            <span>Icon 14px — Arrow / Link</span>
          </p>
          <div className="component-guide__states">
            <div className="component-guide__state-col">
              <span className="component-guide__state-label">Arrow · Default</span>
              <div className="component-guide__preview-light">
                <a href="" className="btn-text-30">
                  View All Case Studies
                  <span className="btn-text-30__icon">
                    <span className="icon_arrow-14" aria-hidden="true" />
                  </span>
                </a>
              </div>
            </div>
            <div className="component-guide__state-col">
              <span className="component-guide__state-label">Arrow · Hover</span>
              <div className="component-guide__preview-light">
                <a href="" className="btn-text-30">
                  View All Case Studies
                  <span
                    className="btn-text-30__icon"
                    style={{ background: "var(--color-accent)" }}
                  >
                    <span
                      className="icon_arrow-14"
                      aria-hidden="true"
                      style={{ filter: "brightness(0) invert(1)" }}
                    />
                  </span>
                </a>
              </div>
            </div>
            <div className="component-guide__state-col">
              <span className="component-guide__state-label">Link · Default</span>
              <div className="component-guide__preview-light">
                <a href="" className="btn-text-30">
                  Go to Connect Portal
                  <span className="btn-text-30__icon">
                    <span className="icon_link-14" aria-hidden="true" />
                  </span>
                </a>
              </div>
            </div>
            <div className="component-guide__state-col">
              <span className="component-guide__state-label">Link · Hover</span>
              <div className="component-guide__preview-light">
                <a href="" className="btn-text-30">
                  Go to Connect Portal
                  <span
                    className="btn-text-30__icon"
                    style={{ background: "var(--color-accent)" }}
                  >
                    <span
                      className="icon_link-14"
                      aria-hidden="true"
                      style={{ filter: "brightness(0) invert(1)" }}
                    />
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Btn 30px Line */}
        <div className="component-guide__section" id="btn-line-30">
          <h2 className="component-guide__section-tit">Btn_30px_Line</h2>
          <p className="component-guide__type-spec">
            <span>Figma Btn / 30px / Line</span>
            <span className="component-guide__type-spec-sep" />
            <span>호버: border-color만 변경</span>
          </p>
          <div className="component-guide__states">
            <div className="component-guide__state-col">
              <span className="component-guide__state-label">Light · Default</span>
              <div className="component-guide__preview-light">
                <button type="button" className="btn-base btn-line-30">
                  Copy Link
                  <span
                    className="btn-line-30__icon btn-line-30__icon--copy"
                    aria-hidden="true"
                  />
                </button>
              </div>
            </div>
            <div className="component-guide__state-col">
              <span className="component-guide__state-label">Light · Hover</span>
              <div className="component-guide__preview-light">
                <button
                  type="button"
                  className="btn-base btn-line-30"
                  style={{ borderColor: "var(--color-primary)" }}
                >
                  Copy Link
                  <span
                    className="btn-line-30__icon btn-line-30__icon--copy"
                    aria-hidden="true"
                  />
                </button>
              </div>
            </div>
            <div className="component-guide__state-col">
              <span className="component-guide__state-label">On dark · Default</span>
              <div className="component-guide__preview-dark">
                <button type="button" className="btn-base btn-line-30 btn-line-30--on-dark">
                  Copy Link
                  <span
                    className="btn-line-30__icon btn-line-30__icon--copy"
                    aria-hidden="true"
                  />
                </button>
              </div>
            </div>
            <div className="component-guide__state-col">
              <span className="component-guide__state-label">On dark · Hover</span>
              <div className="component-guide__preview-dark">
                <button
                  type="button"
                  className="btn-base btn-line-30 btn-line-30--on-dark"
                  style={{ borderColor: "#fff" }}
                >
                  Copy Link
                  <span
                    className="btn-line-30__icon btn-line-30__icon--copy"
                    aria-hidden="true"
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Rolling 50px */}
        <div className="component-guide__section" id="rolling-50">
          <h2 className="component-guide__section-tit">Rolling_50px</h2>
          <p className="component-guide__type-spec">
            <span>콘텐츠에 따라 스크롤 라인 사이즈는 유동적으로 변경 가능</span>
            <span className="component-guide__type-spec-sep" />
            <span>Icon 18px</span>
          </p>

          <div className="component-guide__rolling-demo">
            <div className="component-guide__rolling-line">
              <span className="component-guide__rolling-track" />
              <span
                className="component-guide__rolling-fill"
                style={{
                  width: `${((rollingIndex + 1) / rollingCount) * 100}%`,
                }}
              />
            </div>
            <SwiperBarControls
              variant="swiper_type_01"
              count={rollingCount}
              activeIndex={rollingIndex}
              isPrevDisabled={rollingIndex === 0}
              isNextDisabled={rollingIndex === rollingCount - 1}
              onSelect={setRollingIndex}
              onPrev={() => setRollingIndex((i) => Math.max(0, i - 1))}
              onNext={() =>
                setRollingIndex((i) => Math.min(rollingCount - 1, i + 1))
              }
            />
          </div>

          <div className="component-guide__states" style={{ marginTop: 48 }}>
            <div className="component-guide__state-col">
              <span className="component-guide__state-label">Default</span>
              <SwiperNavButtons
                variant="swiper_type_01"
                isPrevDisabled={false}
                isNextDisabled={false}
                onPrev={() => {}}
                onNext={() => {}}
              />
            </div>
            <div className="component-guide__state-col">
              <span className="component-guide__state-label">Hover</span>
              <div style={{ display: "flex", gap: 12 }}>
                <button
                  type="button"
                  className="swiper_type_01_btn swiper_type_01_btn--prev"
                  style={{ background: "var(--color-primary)" }}
                >
                  <span
                    className="swiper_type_01_icon swiper_type_01_icon--prev"
                    style={{ filter: "brightness(0) invert(1)" }}
                  />
                </button>
                <button
                  type="button"
                  className="swiper_type_01_btn swiper_type_01_btn--next"
                  style={{ background: "var(--color-primary)" }}
                >
                  <span
                    className="swiper_type_01_icon swiper_type_01_icon--next"
                    style={{ filter: "brightness(0) invert(1)" }}
                  />
                </button>
              </div>
            </div>
            <div className="component-guide__state-col">
              <span className="component-guide__state-label">Disabled</span>
              <SwiperNavButtons
                variant="swiper_type_01"
                isPrevDisabled
                isNextDisabled
                onPrev={() => {}}
                onNext={() => {}}
              />
            </div>
          </div>
        </div>
      </div>

      <header className="component-guide__top component-guide__block" id="check">
        <div className="component-guide__top-inner">
          <div className="component-guide__brand">
            <span className="component-guide__num">05</span>
            <h1 className="component-guide__title">Check</h1>
          </div>
          <div className="component-guide__date">
            <span>DATE</span>
            <span className="component-guide__date-sep" aria-hidden="true" />
            <strong>2026.05.26</strong>
          </div>
        </div>
      </header>

      <div className="component-guide__body">
        <div className="component-guide__section" id="check-22">
          <h2 className="component-guide__section-tit">Check_22px</h2>
          <p className="component-guide__type-spec">
            <span>Icon 22px</span>
            <span className="component-guide__type-spec-sep" />
            <span>MUI Checkbox + GuideCheckboxIcon</span>
          </p>

          <div className="component-guide__type">
            <h3 className="component-guide__type-tit">1. Default</h3>
            <p className="component-guide__type-spec">
              <code>ico_check.svg</code> / <code>ico_checked.svg</code>
            </p>
            <div className="component-guide__states">
              <div className="component-guide__state-col">
                <span className="component-guide__state-label">Selection</span>
                <div className="component-guide__preview-light">
                  <Checkbox
                    className="guide_checkbox"
                    checked
                    disableRipple
                    icon={<GuideCheckboxIcon {...guideCheckboxIconsDefault} />}
                    checkedIcon={
                      <GuideCheckboxIcon checked {...guideCheckboxIconsDefault} />
                    }
                    slotProps={{ input: { "aria-label": "선택됨", readOnly: true } }}
                  />
                </div>
              </div>
              <div className="component-guide__state-col">
                <span className="component-guide__state-label">Default</span>
                <div className="component-guide__preview-light">
                  <Checkbox
                    className="guide_checkbox"
                    checked={false}
                    disableRipple
                    icon={<GuideCheckboxIcon {...guideCheckboxIconsDefault} />}
                    checkedIcon={
                      <GuideCheckboxIcon checked {...guideCheckboxIconsDefault} />
                    }
                    slotProps={{ input: { "aria-label": "선택 안 됨", readOnly: true } }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="component-guide__type">
            <h3 className="component-guide__type-tit">2. Product downloads filter</h3>
            <p className="component-guide__type-spec">
              <code>ico_check_block.svg</code> / <code>ico_checked_black.svg</code>
              <span className="component-guide__type-spec-sep" />
              <span>label + htmlFor 연동</span>
            </p>
            <div className="component-guide__states">
              <div className="component-guide__state-col">
                <span className="component-guide__state-label">Selection</span>
                <div className="component-guide__preview-light">
                  <Checkbox
                    id="guide-check-downloads-on"
                    className="guide_checkbox"
                    checked
                    disableRipple
                    icon={<GuideCheckboxIcon {...guideCheckboxIconsDownloads} />}
                    checkedIcon={
                      <GuideCheckboxIcon checked {...guideCheckboxIconsDownloads} />
                    }
                    slotProps={{ input: { "aria-label": "Catalogs", readOnly: true } }}
                  />
                  <label htmlFor="guide-check-downloads-on">Catalogs (100)</label>
                </div>
              </div>
              <div className="component-guide__state-col">
                <span className="component-guide__state-label">Default</span>
                <div className="component-guide__preview-light">
                  <Checkbox
                    id="guide-check-downloads-off"
                    className="guide_checkbox"
                    checked={false}
                    disableRipple
                    icon={<GuideCheckboxIcon {...guideCheckboxIconsDownloads} />}
                    checkedIcon={
                      <GuideCheckboxIcon checked {...guideCheckboxIconsDownloads} />
                    }
                    slotProps={{ input: { "aria-label": "OS/Firmware", readOnly: true } }}
                  />
                  <label htmlFor="guide-check-downloads-off">OS/Firmware (0)</label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <header className="component-guide__top component-guide__block" id="textfield">
        <div className="component-guide__top-inner">
          <div className="component-guide__brand">
            <span className="component-guide__num">06</span>
            <h1 className="component-guide__title">Textfield</h1>
          </div>
          <div className="component-guide__date">
            <span>DATE</span>
            <span className="component-guide__date-sep" aria-hidden="true" />
            <strong>2026.05.26</strong>
          </div>
        </div>
      </header>

      <div className="component-guide__body">
        {/* Text field — 280px (MUI) */}
        <div className="component-guide__section" id="textfield-280">
          <h2 className="component-guide__section-tit">Text field</h2>
          <div className="component-guide__states">
            <div className="component-guide__state-col">
              <span className="component-guide__state-label">Default</span>
              <div className="component-guide__preview-light">
                <TextField
                  className="guide_field"
                  // label="Label"
                  placeholder="Placeholder"
                  slotProps={guideFieldLabelSlot}
                />
              </div>
            </div>
            <div className="component-guide__state-col">
              <span className="component-guide__state-label">Success</span>
              <div className="component-guide__preview-light">
                <TextField
                  className="guide_field"
                  // label="Label"
                  defaultValue="Enter text"
                  slotProps={guideFieldLabelSlot}
                />
              </div>
            </div>
            <div className="component-guide__state-col">
              <span className="component-guide__state-label">Disabled</span>
              <div className="component-guide__preview-light">
                <TextField
                  className="guide_field"
                  // label="Label"
                  defaultValue="Fixed text"
                  disabled
                  slotProps={guideFieldLabelSlot}
                />
              </div>
            </div>
            <div className="component-guide__state-col">
              <span className="component-guide__state-label">Error</span>
              <div className="component-guide__preview-light">
                <TextField
                  className="guide_field guide_field--error-gap"
                  // label="Label"
                  defaultValue="Input text error"
                  error
                  helperText="Input text error"
                  slotProps={guideFieldLabelSlot}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Search — 280px (MUI TextField + IconButton) */}
        <div className="component-guide__section" id="search-280">
          <h2 className="component-guide__section-tit">Search — Toolbar 280px</h2>
          <p className="component-guide__type-spec">
            <span>높이 50px · Download Center / Tech Hub / Where to Buy</span>
          </p>
          <div className="component-guide__preview-light">
            <TextField
              className="guide_field guide_field--search"
              placeholder="Search"
              aria-label="Search"
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end" className="guide_field__search-adorn">
                      <button
                        type="button"
                        className="guide_field__search-icon-button"
                        aria-label="Search"
                      >
                        <img loading="lazy" decoding="async"
                          src="/ico/ico_search_24.svg"
                          alt=""
                          width={18}
                          height={18}
                        />
                      </button>
                    </InputAdornment>
                  ),
                },
              }}
            />
          </div>
        </div>

        <div className="component-guide__section" id="search-80">
          <h2 className="component-guide__section-tit">Search — Hero 80px</h2>
          <p className="component-guide__type-spec">
            <span>Figma 4701:83900 · `/search`</span>
            <span className="component-guide__type-spec-sep" />
            <span>스타일: `search.css` · `section.search_all_hero`</span>
            <span className="component-guide__type-spec-sep" />
            <span>섹션 가이드: `search_all_hero`</span>
          </p>
          <div className="component-guide__preview-light component-guide__preview-light--search-hero">
            <Suspense fallback={null}>
              <SearchAllHero />
            </Suspense>
          </div>
        </div>

        {/* Select — 높이 50px / 38px (MUI Select + GuideSelectIcon) */}
        <div className="component-guide__section" id="dropdown">
          <h2 className="component-guide__section-tit">Select</h2>
          <p className="component-guide__type-spec">
            <span>Chevron: ico_up_16.svg (guide_field__select-icon)</span>
          </p>

          <div className="component-guide__type">
            <h3 className="component-guide__type-tit">Select_50px</h3>
            <p className="component-guide__type-spec">
              <span>높이 50px</span>
              <span className="component-guide__type-spec-sep" />
              <span>너비 280px · 200px</span>
            </p>
            <div className="component-guide__states">
              <div className="component-guide__state-col">
                <span className="component-guide__state-label">280px</span>
                <div className="component-guide__preview-light">
                  <FormControl className="guide_field guide_field--h50">
                    <InputLabel id="guide-occupation-label" shrink>
                      Occupation
                    </InputLabel>
                    <GuideSelect
                      labelId="guide-occupation-label"
                      defaultValue=""
                      displayEmpty
                      IconComponent={GuideSelectIcon}
                      renderValue={(value) => {
                        const text = value ? String(value) : "Select";
                        return (
                          <span className="guide_field__select-value" title={text}>
                            {text}
                          </span>
                        );
                      }}
                    >
                      <MenuItem value="">Select</MenuItem>
                      <MenuItem value="Engineer">Engineer</MenuItem>
                      <MenuItem value="Manager">Manager</MenuItem>
                    </GuideSelect>
                  </FormControl>
                </div>
              </div>
              <div className="component-guide__state-col">
                <span className="component-guide__state-label">200px</span>
                <div className="component-guide__preview-light">
                  <FormControl className="guide_field guide_field--h50 guide_field--w200">
                    <GuideSelect
                      defaultValue=""
                      displayEmpty
                      IconComponent={GuideSelectIcon}
                      inputProps={{ "aria-label": "Sort by" }}
                      renderValue={(value) => {
                        const text = value ? String(value) : "Sort by";
                        return (
                          <span className="guide_field__select-value" title={text}>
                            {text}
                          </span>
                        );
                      }}
                    >
                      <MenuItem value="">Sort by</MenuItem>
                      <MenuItem value="Newest">Newest</MenuItem>
                      <MenuItem value="Oldest">Oldest</MenuItem>
                    </GuideSelect>
                  </FormControl>
                </div>
              </div>
            </div>
          </div>

          <div className="component-guide__type">
            <h3 className="component-guide__type-tit">Select_38px</h3>
            <p className="component-guide__type-spec">
              <span>높이 38px</span>
              <span className="component-guide__type-spec-sep" />
              <span>너비 120px · Product downloads 버전</span>
            </p>
            <div className="component-guide__states">
              <div className="component-guide__state-col">
                <span className="component-guide__state-label">120px</span>
                <div className="component-guide__preview-light">
                  <FormControl className="guide_field guide_field--h38 guide_field--w120">
                    <GuideSelect
                      defaultValue="V38.0"
                      displayEmpty
                      IconComponent={GuideSelectIcon}
                      inputProps={{ "aria-label": "Version" }}
                      renderValue={(value) => {
                        const text = value ? String(value) : "V38.0";
                        return (
                          <span className="guide_field__select-value" title={text}>
                            {text}
                          </span>
                        );
                      }}
                    >
                      <MenuItem value="V38.0">V38.0</MenuItem>
                      <MenuItem value="V37.0">V37.0</MenuItem>
                    </GuideSelect>
                  </FormControl>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <header className="component-guide__top component-guide__block" id="pagination">
        <div className="component-guide__top-inner">
          <div className="component-guide__brand">
            <span className="component-guide__num">07</span>
            <h1 className="component-guide__title">Pagination</h1>
          </div>
          <div className="component-guide__date">
            <span>DATE</span>
            <span className="component-guide__date-sep" aria-hidden="true" />
            <strong>2026.05.26</strong>
          </div>
        </div>
      </header>

      <div className="component-guide__body">
        <div className="component-guide__section" id="pagination-page-numbering">
          <h2 className="component-guide__section-tit">Page Numbering</h2>
          <p className="component-guide__type-spec">
            <span>Figma 994:2611</span>
            <span className="component-guide__type-spec-sep" />
            <span>40×40 · Active pill #0F1F45</span>
            <span className="component-guide__type-spec-sep" />
            <span>Chevron ico_pag_chev_10.svg</span>
          </p>
          <div className="component-guide__preview-light component-guide__preview-light--pagination">
            <PageNumbering
              currentPage={1}
              totalPages={5}
              ariaLabel="Page numbering example"
            />
          </div>
        </div>
      </div>

      <header className="component-guide__top component-guide__block" id="banner">
        <div className="component-guide__top-inner">
          <div className="component-guide__brand">
            <span className="component-guide__num">08</span>
            <h1 className="component-guide__title">Banner</h1>
          </div>
          <div className="component-guide__date">
            <span>DATE</span>
            <span className="component-guide__date-sep" aria-hidden="true" />
            <strong>2026.05.27</strong>
          </div>
        </div>
      </header>

      <div className="component-guide__body">
        <div className="component-guide__section" id="banner-01">
          <h2 className="component-guide__section-tit">common_banner_01</h2>
          <p className="component-guide__type-spec">
            <span>Figma — 다크 CTA 배너</span>
            <span className="component-guide__type-spec-sep" />
            <span>btn-lv01--line-solid · icon_arrow-18</span>
          </p>
          <div className="component-guide__preview-banner">
            <CommonBanner01 />
          </div>
        </div>

        <div className="component-guide__section" id="banner-02">
          <h2 className="component-guide__section-tit">common_banner_02 — default</h2>
          <p className="component-guide__type-spec">
            <span>Figma 2910:32832 — Product Configurator</span>
            <span className="component-guide__type-spec-sep" />
            <span>패널 링크 · btn-text-30 · panel:hover 아이콘</span>
          </p>
          <div className="component-guide__preview-banner">
            <CommonBanner02 linkHref="#banner-02" />
          </div>
        </div>

        <div className="component-guide__section" id="banner-02-expert">
          <h2 className="component-guide__section-tit">
            common_banner_02 — expert
          </h2>
          <p className="component-guide__type-spec">
            <span>Figma 3871:113566 — Product contact</span>
            <span className="component-guide__type-spec-sep" />
            <span>--expert · btn-line-30 Copy · link 버튼 호버만</span>
          </p>
          <div className="component-guide__preview-banner devices-page devices-page--product">
            <CommonBanner02 variant="expert" linkHref="#banner-02-expert" />
          </div>
        </div>

        <div className="component-guide__section" id="banner-03">
          <h2 className="component-guide__section-tit">common_banner_03</h2>
          <p className="component-guide__type-spec">
            <span>Figma 3082:53145 — HUB Video Banner</span>
            <span className="component-guide__type-spec-sep" />
            <span>정적 이미지 · btn-text-30 icon_arrow-18</span>
          </p>
          <div className="component-guide__preview-banner">
            <CommonBanner03 linkHref="#banner-03" />
          </div>
        </div>

        <div className="component-guide__section" id="banner-04">
          <h2 className="component-guide__section-tit">common_banner_04</h2>
          <p className="component-guide__type-spec">
            <span>풀폭 다크 CTA (Banner 02 expert와 별도)</span>
            <span className="component-guide__type-spec-sep" />
            <span>btn-lv01--line-solid</span>
          </p>
          <div className="component-guide__preview-banner">
            <CommonBanner04 />
          </div>
        </div>
      </div>
    </section>
  );
}
