# Hitouch Global Ltd — Corporate Website

The public website for Hitouch Global Ltd, an international education consultancy. Development proceeds in approved phases. The current implementation covers the design foundation, responsive navigation, and homepage hero.

## Stack

- React with JavaScript, Vite, and React Router.
- Tailwind CSS for the public website, with component styles and shared design tokens.
- Locally bundled Plus Jakarta Sans.
- Material UI remains installed, with its existing theme in `src/theme.js`, for future dashboards. The public website is not wrapped in MUI's theme or `CssBaseline`.

This is a single-company project. Future Student Portal and Consultant CRM integration must follow the approved architecture when provided. This phase introduces no backend, authentication, database, or API contracts.

## Development

```bash
npm install
npm run dev
```

Vite prints the local development address. To build and inspect the production output:

```bash
npm run build
npm run preview
```

Production output is written to `dist/`. Hosting must serve `index.html` for application paths so React Router's fallback page works on direct visits.

## Project map

| File | Responsibility |
| --- | --- |
| `src/main.jsx` | React entry, local font, and global CSS import order |
| `src/App.jsx` | Router, skip link, shared header, homepage, and unknown-route fallback |
| `src/index.css` | Tailwind, brand tokens, base styles, and shared controls |
| `src/styles/animations.css` | Entrance motion and reduced-motion support |
| `src/components/layout/SiteHeader.jsx` and `SiteHeader.css` | Responsive navigation and disclosure behaviour |
| `src/components/home/Hero.jsx` and `Hero.css` | Hero composition, calls to action, and study-support links |
| `src/components/ui/ArrowIcon.jsx` | Shared decorative arrow icon |
| `src/config/company.js` | Company information and existing public destinations |
| `src/theme.js` | Retained Material UI theme for future dashboards |
| `public/images/ATTRIBUTION.md` | Campus photograph source and licensing information |
| `docs/phase-1.md` | Design decisions, scope, and verification record |

Keep `src/index.css` imported **before `App` and its component styles** in `src/main.jsx`. Tailwind's layer order must be established before component layers; reversing this order allows base resets to override component typography and sizing.

## Current scope

The homepage uses the native cursor, local responsive photography, navigation disclosures, and direct links to existing Hitouch pages and the Student Portal. These are deliberate temporary destinations while later corporate pages are developed. Review them as replacements are introduced and before a production domain cutover.

The campus photograph is licensed stock used as illustrative imagery, not a client testimonial or endorsement. No company statistics, partnerships, or testimonials have been invented.

Legacy common components and reveal hooks remain in the repository but are not mounted. Installed 3D libraries and the existing video are not loaded by Phase 1. The rest of the website and internal dashboards are outside this phase.

## Verification

The Phase 1 production build and scoped ESLint checks passed. Headless Microsoft Edge checks covered 11 viewport widths from 320px to 1920px, overflow, keyboard navigation, focus restoration, reduced motion, the skip link, and the unknown-route fallback. See the phase record for details and limits. Local QA output is ignored under `.qa/`.

```bash
npx eslint src/main.jsx src/App.jsx src/config/company.js src/components/layout/SiteHeader.jsx src/components/home/Hero.jsx src/components/ui/ArrowIcon.jsx
```

`npm run lint` checks the whole repository, including retained legacy files. Scoped verification does not mean every legacy file has been modernised.

The starting snapshot is commit `c0fbd7b`. Use `git log --oneline` to inspect implementation checkpoints. No remote is configured.

Phase 2 begins only after approval of Phase 1.
