# 2026.09 — Maintenance release

- Maintenance review of load-broker-portal — "FreightCommand", a React demo portal for freight brokerage (load board, bidding, live tracking, carrier scores, in-app messaging, contract generation) with a dark command-center look and four role views: customer, carrier, dispatch, admin.
- Stack: React 18 + Vite, React Router v6, Tailwind CSS, Leaflet for maps (no API key), Recharts, Lucide icons; `vercel.json` pre-configured for SPA routing. Eleven page components under `src/pages/`.
- Status: frontend-only demo running on mock data — the README states login accepts any email/password and a role switcher fakes the four personas. README describes it as a demo for client presentation. Last change April 2026 (SEO "Hire Me" block with cross-links).
- Reviewed September 2026: docs refreshed, CHANGELOG started, package version bumped, versioned as v2026.09. No application code touched.
- Known gaps: no backend, no real auth and no persistence — nothing here is production-ready; no LICENSE file (README says only "demo project for client presentation"); no CHANGELOG before this release; no tests and no CI workflow; no live URL is stated in the README.
