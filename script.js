(() => {
  "use strict";

  const $ = (id) => document.getElementById(id);
  const header = $("header");
  const toggle = $("menuToggle");
  const nav = $("navigation");

  // Header shrinks slightly after scrolling.
  const updateHeader = () => header && header.classList.toggle("scrolled", window.scrollY > 35);
  window.addEventListener("scroll", updateHeader, { passive: true });
  updateHeader();

  // Mobile menu.
  const setMenu = (open) => {
    if (!nav || !toggle) return;
    nav.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
    toggle.textContent = open ? "×" : "☰";
  };
  if (toggle && nav) {
    toggle.addEventListener("click", () => setMenu(!nav.classList.contains("open")));
    nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => setMenu(false)));
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && nav.classList.contains("open")) {
        setMenu(false);
        toggle.focus();
      }
    });
  }

  // Reveal sections on scroll. CSS only hides them when JS is running (html.js).
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

  const year = $("year");
  if (year) year.textContent = new Date().getFullYear();

  // Inquiry form: posts to the form service in the form's action attribute.
  const form = $("contactForm");
  if (!form) return;
  const note = $("formNote");
  const success = $("formSuccess");
  const button = form.querySelector("button[type=submit]");
  const email = form.dataset.email || "";

  const setNote = (message, isError = false) => {
    note.textContent = message;
    note.classList.toggle("error", isError);
  };

  // Used only until a form service is connected (action still contains REPLACE_WITH).
  const openMailApp = (data) => {
    const subject = `Website inquiry: ${data.get("project")}`;
    const body = [
      `Name: ${data.get("name")}`,
      `Email: ${data.get("email")}`,
      `Project: ${data.get("project")}`,
      "",
      "Project details:",
      data.get("details") || "(Not provided)"
    ].join("\n");
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const data = new FormData(form);
    if (data.get("_gotcha")) return; // honeypot filled in: likely a bot

    const endpoint = form.getAttribute("action") || "";
    if (endpoint.includes("REPLACE_WITH")) {
      console.warn("Contact form is not connected to a form service yet. See README.");
      openMailApp(data);
      return;
    }

    button.disabled = true;
    setNote("Sending…");
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" }
      });
      if (!response.ok) throw new Error(`Form service returned ${response.status}`);
      form.reset();
      form.hidden = true;
      success.hidden = false;
      success.focus();
    } catch (error) {
      setNote(`That didn't send. Please try again, or email us at ${email}.`, true);
      button.disabled = false;
    }
  });
})();
