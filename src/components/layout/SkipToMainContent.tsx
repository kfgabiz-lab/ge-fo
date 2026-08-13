"use client";

/**
 * Skip link that focuses the page <main>, not a wrapper that includes header/footer.
 */
export default function SkipToMainContent() {
  return (
    <a
      href="#main-content"
      className="skip_to_content"
      onClick={(event) => {
        event.preventDefault();
        const main = document.querySelector("main");
        if (!(main instanceof HTMLElement)) return;

        if (!main.hasAttribute("tabindex")) {
          main.tabIndex = -1;
        }
        if (!main.id) {
          main.id = "main-content";
        }

        main.focus({ preventScroll: true });
        main.scrollIntoView({ block: "start" });
      }}
    >
      Skip to main content
    </a>
  );
}
