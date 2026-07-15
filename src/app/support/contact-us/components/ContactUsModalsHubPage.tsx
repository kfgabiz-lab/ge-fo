"use client";

import { useState } from "react";
import PrivacyPolicyModal from "@/components/modals/PrivacyPolicyModal";
import {
  contactUsModalsHub,
  type ContactUsModalsHubModalId,
} from "@/data/support/contactUsContent";
import ContactUsViewResponseDetailModal from "./ContactUsViewResponseDetailModal";
import ContactUsViewResponseModal from "./ContactUsViewResponseModal";

export default function ContactUsModalsHubPage() {
  const [activeModal, setActiveModal] = useState<ContactUsModalsHubModalId | null>(
    null,
  );

  const closeModal = () => setActiveModal(null);

  return (
    <main
      className="support-page support-page--contact-us-modals"
      id="P-FO-SUPP-050100P"
    >
      <section className="support_contact_modals_hub" id="support-contact-modals-hub">
        <div className="inner">
          <h1 className="support_contact_modals_hub__heading">{contactUsModalsHub.title}</h1>
          <p className="support_contact_modals_hub__desc">{contactUsModalsHub.description}</p>
          <ul className="support_contact_modals_hub__list">
            {contactUsModalsHub.buttons.map((button) => (
              <li key={button.id} className="support_contact_modals_hub__item">
                <button
                  type="button"
                  className="btn-base btn-lv01 btn-lv01--solid support_contact_modals_hub__btn"
                  onClick={() => setActiveModal(button.id)}
                >
                  {button.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <PrivacyPolicyModal
        open={activeModal === "privacy-policy"}
        onClose={closeModal}
      />
      <ContactUsViewResponseModal
        open={activeModal === "view-response-default"}
        onClose={closeModal}
      />
      <ContactUsViewResponseModal
        open={activeModal === "view-response-error"}
        onClose={closeModal}
        showErrorsOnOpen
      />
      <ContactUsViewResponseDetailModal
        open={activeModal === "view-response-answered"}
        onClose={closeModal}
        variant="answered"
      />
      <ContactUsViewResponseDetailModal
        open={activeModal === "view-response-pending"}
        onClose={closeModal}
        variant="pending"
      />
    </main>
  );
}
