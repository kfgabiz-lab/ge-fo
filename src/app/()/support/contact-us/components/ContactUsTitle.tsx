"use client";

import { useState } from "react";
import { contactUsPage } from "@/data/support/contactUsContent";
import ContactUsViewResponseModal from "./ContactUsViewResponseModal";

export default function ContactUsTitle() {
  const [viewResponseOpen, setViewResponseOpen] = useState(false);

  return (
    <>
      <section className="support_contact_title" id="support-contact-title">
        <div className="inner">
          <h1 className="support_contact_title__heading">{contactUsPage.title}</h1>
          <p className="support_contact_title__desc">{contactUsPage.description}</p>
          <button
            type="button"
            className="btn-base btn-lv01 btn-lv01--solid support_contact_title__cta"
            onClick={() => setViewResponseOpen(true)}
          >
            {contactUsPage.viewResponseCtaLabel}
          </button>
        </div>
      </section>
      <ContactUsViewResponseModal
        open={viewResponseOpen}
        onClose={() => setViewResponseOpen(false)}
      />
    </>
  );
}
