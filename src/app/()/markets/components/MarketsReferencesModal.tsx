"use client";

import Link from "next/link";
import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { A11y } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import SwiperBarControls from "@/components/swiper/SwiperBarControls";
import { useModalFocusTrap } from "@/lib/useModalFocusTrap";
import type { ReferenceItem } from "../data/marketsContent";
import "swiper/css";

type MarketsReferencesModalProps = {
  open: boolean;
  item?: ReferenceItem | null;
  items?: ReferenceItem[];
  onClose: () => void;
  /** Section guide preview — in-flow layout without fixed overlay */
  embedded?: boolean;
};

export default function MarketsReferencesModal({
  open,
  item = null,
  items,
  onClose,
  embedded = false,
}: MarketsReferencesModalProps) {
  const titleId = useId();
  const modalRef = useRef<HTMLDivElement>(null);
  const swiperRef = useRef<SwiperType | null>(null);
  const [referenceIndex, setReferenceIndex] = useState(0);
  const [imageIndex, setImageIndex] = useState(0);
  const [canPortal, setCanPortal] = useState(false);

  const referenceItems = useMemo(
    () => (items?.length ? items : item ? [item] : []),
    [item, items],
  );
  const isMultiReference = referenceItems.length > 1;
  const activeItem = referenceItems[referenceIndex] ?? null;
  const referenceItemsKey = referenceItems.map((entry) => entry.id).join(",");

  useEffect(() => {
    setCanPortal(true);
  }, []);

  useModalFocusTrap(modalRef, open && !embedded);

  useEffect(() => {
    if (!open) {
      setReferenceIndex(0);
      setImageIndex(0);
      return;
    }

    if (embedded) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [embedded, onClose, open]);

  useEffect(() => {
    setReferenceIndex(0);
    setImageIndex(0);
    swiperRef.current?.slideTo(0, 0);
  }, [referenceItemsKey]);

  useEffect(() => {
    setImageIndex(0);
    swiperRef.current?.slideTo(0, 0);
  }, [activeItem?.id]);

  const handleSlideChange = useCallback((swiper: SwiperType) => {
    setImageIndex(swiper.activeIndex);
  }, []);

  const handleSelectImage = useCallback((index: number) => {
    swiperRef.current?.slideTo(index);
    setImageIndex(index);
  }, []);

  const handlePrevImage = useCallback(() => {
    swiperRef.current?.slidePrev();
  }, []);

  const handleNextImage = useCallback(() => {
    swiperRef.current?.slideNext();
  }, []);

  const handleSelectReference = useCallback((index: number) => {
    setReferenceIndex(index);
  }, []);

  if (!open || !activeItem) return null;

  const { modal: modalData } = activeItem;
  const modalTitle = modalData.modalTitle ?? activeItem.title;
  const imageCount = modalData.images.length;
  const isPrevDisabled = imageIndex === 0;
  const isNextDisabled = imageIndex === imageCount - 1;

  const modalElement = (
    <div
      ref={modalRef}
      className={
        embedded
          ? "common_modal common_modal--embedded markets_references_modal"
          : "common_modal markets_references_modal"
      }
    >
      {!embedded ? (
        <button
          type="button"
          className="common_modal__dim"
          tabIndex={-1}
          aria-label="Close dialog"
          onClick={onClose}
        />
      ) : null}
      <div
        className="common_modal__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <header
          className={`common_modal__head markets_references_modal__head${
            isMultiReference ? " markets_references_modal__head--tabs" : ""
          }`}
        >
          <div className="common_modal__head-row markets_references_modal__head-row">
            {isMultiReference ? (
              <div
                className="markets_references_modal__tabs"
                role="tablist"
                aria-label="References"
              >
                {referenceItems.map((reference, index) => (
                  <button
                    key={reference.id}
                    type="button"
                    role="tab"
                    id={`${titleId}-tab-${index}`}
                    aria-selected={referenceIndex === index}
                    aria-controls={`${titleId}-panel-${index}`}
                    className={`markets_references_modal__tab${
                      referenceIndex === index ? " is-active" : ""
                    }`}
                    onClick={() => handleSelectReference(index)}
                  >
                    Reference {index + 1}
                  </button>
                ))}
              </div>
            ) : (
              <h2 id={titleId} className="common_modal__tit">
                {modalTitle}
              </h2>
            )}
            <button
              type="button"
              className="common_modal__close"
              aria-label="Close"
              onClick={onClose}
            />
          </div>
          {!isMultiReference ? <hr className="common_modal__line" /> : null}
        </header>

        <div
          className={`common_modal__body markets_references_modal__body${
            isMultiReference ? " markets_references_modal__body--tabs" : ""
          }`}
          role={isMultiReference ? "tabpanel" : undefined}
          id={isMultiReference ? `${titleId}-panel-${referenceIndex}` : undefined}
          aria-labelledby={
            isMultiReference ? `${titleId}-tab-${referenceIndex}` : undefined
          }
        >
          <div className="markets_references_modal__media">
            <div className="markets_references_modal__img">
              {imageCount > 1 ? (
                <Swiper
                  key={activeItem.id}
                  className="markets_references_modal__swiper"
                  modules={[A11y]}
                  slidesPerView={1}
                  speed={400}
                  watchOverflow
                  onSwiper={(swiper) => {
                    swiperRef.current = swiper;
                  }}
                  onSlideChange={handleSlideChange}
                >
                  {modalData.images.map((src, index) => (
                    <SwiperSlide key={`${src}-${index}`}>
                      <img
                        src={src}
                        alt={index === imageIndex ? modalTitle : ""}
                        decoding="async"
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              ) : (
                <img
                  src={modalData.images[0]}
                  alt={modalTitle}
                  decoding="async"
                />
              )}
            </div>
            {imageCount > 1 ? (
              <div className="markets_references_modal__controls">
                <SwiperBarControls
                  variant="swiper_type_01"
                  count={imageCount}
                  activeIndex={imageIndex}
                  isPrevDisabled={isPrevDisabled}
                  isNextDisabled={isNextDisabled}
                  onSelect={handleSelectImage}
                  onPrev={handlePrevImage}
                  onNext={handleNextImage}
                  ariaLabel="Reference image gallery"
                  prevLabel="Previous image"
                  nextLabel="Next image"
                />
              </div>
            ) : null}
            <Link
              href={modalData.ctaHref}
              prefetch={false}
              className="btn-base btn-lv01 btn-lv01--solid markets_references_modal__cta"
            >
              {modalData.ctaLabel}
            </Link>
          </div>

          <div className="markets_references_modal__content">
            {isMultiReference ? (
              <div className="markets_references_modal__content-head">
                <h2 id={titleId} className="markets_references_modal__content-tit">
                  {modalTitle}
                </h2>
                <hr className="markets_references_modal__content-line" />
              </div>
            ) : null}
            <section className="markets_references_modal__section markets_references_modal__section--overview">
              <h3 className="markets_references_modal__section-tit">
                Project Overview
              </h3>
              <div className="markets_references_modal__overview">
                {modalData.overview.map((paragraph) => (
                  <p key={paragraph.slice(0, 48)}>{paragraph}</p>
                ))}
              </div>
            </section>

            <section className="markets_references_modal__section markets_references_modal__section--key-info">
              <h3 className="markets_references_modal__section-tit">
                Project Key Information
              </h3>
              <div className="markets_references_modal__table" role="table">
                {modalData.keyInfo.map((row) => (
                  <div
                    key={row.label}
                    className="markets_references_modal__row"
                    role="row"
                  >
                    <div
                      className="markets_references_modal__th"
                      role="rowheader"
                    >
                      {row.label}
                    </div>
                    <div className="markets_references_modal__td" role="cell">
                      {row.lines ? (
                        row.lines.map((line) => <p key={line}>{line}</p>)
                      ) : (
                        <p>{row.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );

  if (embedded || !canPortal) {
    return modalElement;
  }

  return createPortal(modalElement, document.body);
}
