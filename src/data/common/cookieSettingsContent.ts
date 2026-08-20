export const cookieSettingsModal = {
  title: "Cookie Settings",
  description:
    'We use cookies on our website to give you the most relevant experience by remembering your preferences and repeat visits. By clicking “Accept”, you consent to the use of all the cookies.',
  settingsLabel: "Settings",
  rejectLabel: "Reject All",
  acceptLabel: "Accept All",
} as const;

export const COOKIE_CONSENT_STORAGE_KEY = "ls-cookie-consent";
export const COOKIE_PREFERENCES_STORAGE_KEY = "ls-cookie-preferences";

export type CookieConsentValue = "accepted" | "rejected" | "custom";

export type CookiePreferenceId =
  | "necessary"
  | "functional"
  | "performance"
  | "analytics"
  | "advertisement"
  | "others";

export type CookiePreferences = Record<CookiePreferenceId, boolean>;

export const cookiePreferencesModal = {
  title: "Cookie Settings",
  descriptionBefore:
    "This website uses cookies to improve your experience while you navigate through the website. Out of these, the cookies that are categorized as necessary are stored on your browser as they are essential for the working of basic functionalities of the website. We also use third-party cookies that help us analyze and understand how you use this website. These cookies will be stored in your browser only with your consent. You also have the option to opt-out of these cookies. But opting out of some of these cookies may affect your browsing experience. The cookie policy can also be found in the ",
  termsOfServiceLabel : "Terms of Service",
  termsOfServiceHref : "/terms-of-service",
    categories: [
    {
      id: "necessary",
      title: "Necessary",
      description:
        "Necessary cookies are absolutely essential for the website to function properly. This category only includes cookies that ensures basic functionalities and security features of the website. These cookies do not store any personal information.",
      required: true,
      defaultChecked: true,
    },
    {
      id: "functional",
      title: "Functional",
      description:
        "Functional cookies help to perform certain functionalities like sharing the content of the website on social media platforms, collect feedbacks, and other third-party features.",
      defaultChecked: true,
    },
    {
      id: "performance",
      title: "Performance",
      description:
        "Performance cookies are used to understand and analyze the key performance indexes of the website which helps in delivering a better user experience for the visitors.",
      defaultChecked: true,
    },
    {
      id: "analytics",
      title: "Analytics",
      description:
        "Analytical cookies are used to understand how visitors interact with the website. These cookies help provide information on metrics the number of visitors, bounce rate, traffic source, etc.",
      defaultChecked: true,
    },
    {
      id: "advertisement",
      title: "Advertisement",
      description:
        "Advertisement cookies are used to provide visitors with relevant ads and marketing campaigns. These cookies track visitors across websites and collect information to provide customized ads.",
      defaultChecked: true,
    },
    {
      id: "others",
      title: "Others",
      description:
        "Other uncategorized cookies are those that are being analyzed and have not been classified into a category as yet.",
      defaultChecked: true,
    },
  ] satisfies ReadonlyArray<{
    id: CookiePreferenceId;
    title: string;
    description: string;
    required?: boolean;
    defaultChecked: boolean;
  }>,
  rejectLabel: "Reject All",
  saveLabel: "Save My Preferences",
  acceptLabel: "Accept All",
} as const;

export const defaultCookiePreferences = Object.fromEntries(
  cookiePreferencesModal.categories.map((category) => [
    category.id,
    category.defaultChecked,
  ]),
) as CookiePreferences;
