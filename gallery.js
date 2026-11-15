(() => {
  "use strict";

  const links = Array.from(document.querySelectorAll(".gallery a"));
  if (!links.length) return;

  const box = document.createElement("div");
  box.className = "lightbox" + (links.length < 2 ? " single" : "");
  box.hidden = true;
  box.setAttribute("role", "dialog");
  box.setAttribute("aria-modal", "true");
  box.setAttribute("aria-label", "Photo viewer");
  box.innerHTML =
    '<button class="lb-close" type="button" aria-label="Close">×</button>' +
    '<button class="lb-prev" type="button" aria-label="Previous photo">‹</button>' +
    '<figure><img alt=""><figcaption class="lb-caption"></figcaption></figure>' +
    '<button class="lb-next" type="button" aria-label="Next photo">›</button>';
  document.body.appendChild(box);

  const image = box.querySelector("img");
  const caption = box.querySelector(".lb-caption");
  const closeBtn = box.querySelector(".lb-close");
  let index = 0;
  let opener = null;

  const show = (i) => {
    index = (i + links.length) % links.length;
    const link = links[index];
    const thumb = link.querySelector("img");
    image.src = link.getAttribute("href");
    image.alt = thumb ? thumb.alt : "";
    const text = link.dataset.caption || "";
    caption.textContent = text;
    caption.hidden = !text;
  };

  const open = (i, trigger) => {
    opener = trigger;
    show(i);
    box.hidden = false;
    document.body.style.overflow = "hidden";
    closeBtn.focus();
  };

  const close = () => {
    box.hidden = true;
    image.removeAttribute("src");
    document.body.style.overflow = "";
    if (opener) opener.focus();
  };

  links.forEach((link, i) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      open(i, link);
    });
  });

  closeBtn.addEventListener("click", close);
  box.querySelector(".lb-prev").addEventListener("click", () => show(index - 1));
  box.querySelector(".lb-next").addEventListener("click", () => show(index + 1));
  box.addEventListener("click", (event) => {
    if (event.target === box) close();
  });

  document.addEventListener("keydown", (event) => {
    if (box.hidden) return;
    if (event.key === "Escape") close();
    else if (event.key === "ArrowLeft") show(index - 1);
    else if (event.key === "ArrowRight") show(index + 1);
    else if (event.key === "Tab") {
      const focusable = Array.from(box.querySelectorAll("button")).filter((b) => b.offsetParent !== null);
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  });
})();
