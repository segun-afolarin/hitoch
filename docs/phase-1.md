# Phase 1 — Design Foundation, Navigation, and Hero

## Scope

This phase establishes a fresh corporate frontend for Hitouch Global Ltd while preserving its working React, JavaScript, and Vite configuration. The previous homepage and navigation were intentionally removed before this work began.

Implemented:

- Public design tokens, typography, controls, focus treatment, and reduced-motion handling.
- Responsive site header with utility links, desktop disclosures, and mobile navigation.
- Homepage hero with counselling and destination actions, illustrative campus photography, and a compact study-support strip.
- A skip-to-content link and unknown-route fallback.
- Git version control and project documentation.

The complete homepage, destination guides, services, partners, dashboards, and backend integration are outside Phase 1. Phase 2 requires approval.

## Design direction

The first screen introduces international education through a human message: “Your ambition. Our guidance. A world ahead.” Supporting copy identifies course selection and preparation for life abroad. Counselling provides a useful next step; destination exploration supports visitors who are still researching.

The original logo and cyan brand identity are retained. Dark ink, a muted canvas, generous spacing, and campus imagery support the corporate presentation. Decorative arcs echo the brand's connection motif. Image framing and a support note create depth without requiring video or WebGL.

| Token | Value | Intended use |
| --- | --- | --- |
| Brand | `#00aeef` | Accents and decorative detail |
| Action | `#006b8e` | Primary buttons, links, and focus outlines |
| Ink | `#132f3a` | Headings and primary text |
| Muted | `#52636a` | Supporting text |
| Canvas | `#f5f8f7` | Hero background |
| Line | `#dce5e5` | Separators and borders |

Plus Jakarta Sans is bundled locally. A controlled hierarchy distinguishes the headline, explanation, actions, and secondary guidance. The darker action colour provides stronger contrast for white button labels than the brand cyan.

The campus photograph is illustrative licensed stock. Its subjects are not represented as Hitouch clients or endorsers. See [image attribution](../public/images/ATTRIBUTION.md). No unsupported statistics, success claims, testimonials, or partnership badges were added.

## Frontend decisions

- Public pages use Tailwind and component styles. The existing MUI theme remains in `src/theme.js`, but the public entry does not apply MUI's `ThemeProvider` or `CssBaseline`.
- `src/index.css` is imported before `App` so Tailwind establishes its layer order before component styles. Preserve this order when extending the application.
- Navigation uses native links and disclosure buttons. Mobile navigation follows normal document tab order as an inline disclosure.
- Escape closes an open submenu first and restores focus to its trigger. Escape then closes an open mobile menu and restores focus to the menu button. Outside interactions close navigation. Breakpoint changes handle focus when navigation becomes hidden.
- The native cursor is retained. Essential content is visible without waiting for animation. Reduced-motion preferences disable entrance movement.
- Hero imagery has explicit dimensions, responsive sources, and high fetch priority. Existing video and 3D packages are not loaded by this screen.
- Legacy common components and reveal hooks remain unmounted rather than being unnecessarily rewritten during this phase.

The header and hero link to existing live company pages and the Student Portal. Review these destinations as local replacements are introduced and before a production domain cutover. There are no simulated form submissions or authentication flows.

This remains a single-company system. No backend architecture, database model, API contract, or authentication flow has been defined. Future Student Portal and Consultant CRM work must follow the approved documentation supplied for that phase.

## Verification record

Current Phase 1 verification:

| Check | Observed result |
| --- | --- |
| Production build | Passed with `npm run build` |
| Scoped ESLint | Passed for the entry point, app, company config, header, hero, and shared `ArrowIcon.jsx` |
| Responsive coverage | Headless Microsoft Edge through Playwright; 11 widths spanning 320px to 1920px |
| Horizontal overflow | None observed in checked viewports |
| Navigation | Keyboard access, disclosures, Escape, focus restoration, and outside-click dismissal checked |
| Breakpoint focus | Focus transition checked when switching to mobile navigation |
| Reduced motion | Preference handling checked |
| Skip link | Main-content focus checked |
| Unknown routes | Fallback page checked |
| Browser page errors | None observed during checks |

Screenshots and local QA artifacts are stored under ignored `.qa/`; they are not part of the production bundle. These checks are scoped to Phase 1. They do not establish complete WCAG conformance, screen-reader certification, cross-browser coverage, or field performance/Core Web Vitals results. Broader testing remains part of later development and launch preparation.

## Version control and next review

The starting snapshot is commit `c0fbd7b`. Use `git log --oneline` to inspect implementation checkpoints. No remote is configured.

Review this phase for brand fit, first-impression clarity, mobile usability, and the balance between counselling and destination exploration. After approval, Phase 2 can extend the homepage using verified company content. Evidence should not be invented to fill the design.
