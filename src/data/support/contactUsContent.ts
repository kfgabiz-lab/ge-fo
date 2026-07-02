export const contactUsPage = {
  title: "Contact Us",
  description: "Talk to a specialist. Get answers that move your business forward.",
  viewResponseCtaLabel: "View Response",
} as const;

export const contactUsViewResponseModal = {
  title: "View Response",
  heading: "Check your inquiry.",
  description: [
    "Please enter the inquiry number and password.",
    "You can find your receipt number in the confirmation email",
  ],
  inquiryNumberLabel: "Inquiry Number",
  passwordLabel: "Password",
  confirmLabel: "Confirm",
  fieldError: "Input text error",
} as const;

export const contactUsViewResponseDetailSample = {
  inquiryType: "Quotation Request",
  submittedAt: "2026-06-19  16:25",
  respondedAt: "2026-06-22  11:23",
  productTrail: [
    "Inquiry products",
    "LV Devices and Systems",
    "Magnetic Contactor",
    "Metasol MS",
  ],
  inquiryBody: [
    "Please send a quotation for the Metasol MS magnetic contactor.",
    "Model / capacity:",
    "Coil voltage:",
    "Quantity:",
    "Kindly include unit price, MOQ, and lead time.",
  ],
  responseBody: [
    "Dear Customer,",
    "Thank you for your interest in the Metasol MS magnetic contactor. Please find our proposal based on the standard specification below.",
    "Model: Metasol MS-18 (AC-3, 7.5 kW / 18 A)",
    "Coil voltage: AC 220 V, 50/60 Hz",
    "Unit price: Quoted upon spec confirmation",
    "MOQ: 50 units",
    "Lead time: Approx. 3–4 weeks after order",
    "",
    "Since the model, coil voltage, and quantity were not specified, the above reflects our most common configuration. Please confirm these details and we will issue a formal quotation with exact pricing.",
    "A product catalog is attached for your reference. Feel free to reply here with any questions.",
    "Best regards,",
    "Sales Team",
  ],
  pendingTitle: "Your inquiry is being reviewed",
  pendingDescription: [
    "We've received your inquiry and our team is preparing a response.",
    "Thank you for your patience.",
    "We'll notify you by email once a reply is ready.",
  ],
} as const;

export const contactUsModalsHub = {
  title: "Contact Us — Modals",
  description: "Internal preview buttons for Contact Us modal states.",
  buttons: [
    { id: "privacy-policy", label: "Privacy Policy" },
    { id: "view-response-default", label: "View Response — Default" },
    { id: "view-response-error", label: "View Response — Error" },
    { id: "view-response-answered", label: "View Response — Answered" },
    { id: "view-response-pending", label: "View Response — Pending" },
  ],
} as const;

export type ContactUsModalsHubModalId =
  (typeof contactUsModalsHub.buttons)[number]["id"];

export const contactUsInquiryTypes = [
  { id: "product-information", label: "Product Information" },
  { id: "quotation-request", label: "Quotation Request" },
  { id: "purchase", label: "Purchase" },
  { id: "others", label: "Others" },
] as const;

export const contactUsTechnicalInquiry = {
  label: "Technical Inquiry",
  href: "https://www.ls-electric.com/",
} as const;

export const contactUsCategoryLevels = [
  { id: "lv1", label: "Lv1 Category", ariaLabel: "Product category level 1" },
  { id: "lv2", label: "Lv2 Category", ariaLabel: "Product category level 2" },
  { id: "lv3", label: "Lv3 Category", ariaLabel: "Product category level 3" },
] as const;

export const contactUsCountryOptions = [
  { value: "us", label: "United States" },
  { value: "ca", label: "Canada" },
  { value: "kr", label: "Korea" },
] as const;

export const contactUsConsentItems = [
  {
    id: "personal-info",
    label: "Consent to Collection and Use of Personal Information",
    defaultChecked: false,
    termsLabel: "View Full Terms",
    termsHref: "",
  },
  {
    id: "newsletter",
    label:
      "Consent to collect and use personal information to receive newsletters",
    defaultChecked: true,
    termsLabel: "View Full Terms",
    termsHref: "",
  },
] as const;

export { privacyPolicyModal as contactUsPrivacyPolicyModal } from "@/data/privacyPolicyContent";

export const contactUsFormCopy = {
  inquiryType: "Inquiry Type",
  productCategory: "Product Category",
  inquirySubject: "Inquiry Subject",
  inquirySubjectPlaceholder: "Enter Subject",
  inquiryDetails: "Inquiry Details",
  inquiryDetailsPlaceholder: "Please enter your inquiry details.",
  email: "Email",
  firstName: "First Name",
  lastName: "Last Name",
  companyName: "Company Name",
  addressSearch: "Enter company name or address",
  addressSearchPlaceholder: "Keword Search",
  address2: "Address 2",
  address2Placeholder: "Address 2",
  country: "Country",
  countryPlaceholder: "Select a Country",
  stateRegion: "State/Region",
  zipCode: "Zip Code",
  password: "Password",
  passwordPlaceholder: "Enter Password",
  confirmPassword: "Confirm Password",
  confirmPasswordPlaceholder: "Enter Password Confirm",
  sendLabel: "Send",
} as const;
