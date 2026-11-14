# LMAC Customs Website

Complete responsive static website for LMAC Customs, built with HTML, CSS, and vanilla JavaScript. No framework, package install, or build step is required.

## Preview locally
Open `index.html` in a browser. For a local server, run `python -m http.server 8000` in this folder and visit `http://localhost:8000`.

## Mobile optimization
The site includes a responsive mobile navigation, fluid type and spacing, stacked layouts, two-column service cards on typical phones, a single-column layout on narrow phones, touch-friendly controls, safe-area spacing, reduced-motion support, and mobile-sized form controls.

## Before publishing
1. Edit `config.js` and replace `REPLACE_WITH_REAL_EMAIL@example.com` with the company's real email.
2. Set `serviceArea` and `regionLabel` to the actual towns/region served.
3. Replace sample portfolio entries and stock photos with actual LMAC Customs project photos and descriptions.
4. Confirm that the listed services match the company's work.

## Logo
`logo.svg` is the scalable vector logo used in the header and footer. `favicon.svg` is the matching browser icon.

## Contact form
The inquiry form opens the visitor's email application with their message prepared. It does not store or transmit leads on a server. For direct online lead capture, connect a form provider or backend.

## Files
- `index.html` — page structure and content
- `styles.css` — desktop, tablet, and mobile styling
- `script.js` — navigation, scroll effects, year, metadata, and inquiry form
- `config.js` — email and service-area settings
- `logo.svg` — vector logo
- `favicon.svg` — browser icon
