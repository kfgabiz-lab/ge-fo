"use client";

import { useState } from "react";
import SupportPageTitle from "@/app/support/components/SupportPageTitle";
import { contactUsPage } from "@/data/support/contactUsContent";
import ContactUsViewResponseModal from "./ContactUsViewResponseModal";

export default function ContactUsTitle() {
  const [viewResponseOpen, setViewResponseOpen] = useState(false);

  return (
    <>
      <SupportPageTitle
        id="support-contact-title"
        rootClass="support_contact_title"
        title={contactUsPage.title}
        description={contactUsPage.description}
        spacing="with-bottom"
      >
        <button
          type="button"
          className="btn-base btn-lv01 btn-lv01--solid support_page_title__cta"
          onClick={() => setViewResponseOpen(true)}
        >
          {contactUsPage.viewResponseCtaLabel}
        </button>
      </SupportPageTitle>
      <ContactUsViewResponseModal
        open={viewResponseOpen}
        onClose={() => setViewResponseOpen(false)}
      />
    </>
  );
}
