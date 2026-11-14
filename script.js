(() => {
  "use strict";

  const config = window.SITE_CONFIG || {};
  const email = config.contactEmail || "REPLACE_WITH_REAL_EMAIL@example.com";
  const serviceArea = config.serviceArea || "Maine";
  const regionLabel = config.regionLabel || "Maine";

  // Apply the same editable business details to page title and social/search metadata.
  document.title = document.title
    .replaceAll("{{SERVICE_AREA}}", serviceArea)
    .replaceAll("{{REGION_LABEL}}", regionLabel)
    .replaceAll("{{CONTACT_EMAIL}}", email);
  document.querySelectorAll("head meta[content]").forEach((meta) => {
    const value = meta.getAttribute("content");
    if (value && value.includes("{{")) {
      meta.setAttribute("content", value
        .replaceAll("{{SERVICE_AREA}}", serviceArea)
        .replaceAll("{{REGION_LABEL}}", regionLabel)
        .replaceAll("{{CONTACT_EMAIL}}", email));
    }
  });

  // Fill the editable business details wherever their tokens appear.
  document.querySelectorAll("body *").forEach((element) => {
    if (element.children.length === 0 && element.textContent) {
      element.textContent = element.textContent
        .replaceAll("{{SERVICE_AREA}}", serviceArea)
        .replaceAll("{{REGION_LABEL}}", regionLabel)
        .replaceAll("{{CONTACT_EMAIL}}", email);
    }
    for (const attr of ["href", "content", "aria-label"]) {
      const value = element.getAttribute?.(attr);
      if (value && value.includes("{{")) {
        element.setAttribute(attr, value
          .replaceAll("{{SERVICE_AREA}}", serviceArea)
          .replaceAll("{{REGION_LABEL}}", regionLabel)
          .replaceAll("{{CONTACT_EMAIL}}", email));
      }
    }
  });

  const header = document.getElementById("header");
  const toggle = document.getElementById("menuToggle");
  const nav = document.getElementById("navigation");

  const updateHeader = () => {
    if (header) header.classList.toggle("scrolled", window.scrollY > 35);
  };
  window.addEventListener("scroll", updateHeader, { passive: true });
  updateHeader();

  const closeMenu = () => {
    if (!nav || !toggle) return;
    nav.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open navigation");
    toggle.textContent = "☰";
  };

  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(isOpen));
      toggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
      toggle.textContent = isOpen ? "×" : "☰";
    });
    nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });
  }

  // Reveal sections as they enter the viewport; respect reduced-motion settings in CSS.
  const revealItems = document.querySelectorAll(".fade-in");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("visible"));
  }

  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  // Static hosting has no email server. This prepares an email in the visitor's mail app.
  const form = document.getElementById("contactForm");
  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!email || email.includes("REPLACE_WITH")) {
        const note = document.getElementById("formNote");
        if (note) note.textContent = "Before launch, add the business email in config.js.";
        return;
      }
      const data = new FormData(form);
      const subject = `Website inquiry: ${data.get("project")}`;
      const body = [
        `Name: ${data.get("name")}`,
        `Email: ${data.get("email")}`,
        `Project: ${data.get("project")}`,
        "",
        "Project details:",
        data.get("details") || "(Not provided)"
      ].join("\n");
      window.location.href = `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      const note = document.getElementById("formNote");
      if (note) note.textContent = "Your email app should open with the inquiry ready to send.";
    });
  }
})();
