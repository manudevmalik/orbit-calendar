# Orbit — Student Calendar

**An AI-native, social-first calendar concept for middle and high school students** — a portfolio prototype inspired by the mission of Snap’s Saturn team: build the most powerful personal calendar, and the most fun way to share calendars with friends.

> **Live demo:** [https://manudevmalik.github.io/orbit-calendar/](https://manudevmalik.github.io/orbit-calendar/)  
> *(Deploys automatically via GitHub Actions after push to `main`.)*

---

## Why Orbit

School schedules, homework, sports, and social plans live in PDFs, LMS portals, and group chats. Orbit explores what a **student-first, home-first social calendar** could feel like: compare availability with friends on Home, plan together in seconds, and let AI handle tedious schedule entry—without sacrificing privacy or control.

This repository is a **product and UX prototype** for portfolio and interview discussion. It is **not affiliated with Snap Inc.** and does not use Saturn branding or production APIs.

---

## Key features (prototype)

| Area | What you can try in the demo |
|------|------------------------------|
| **Cal Compare (Home-first social)** | Friend availability and overlap on Home—not buried in a separate social tab |
| **My AI companion** | Simulated schedule ingestion: school lookup, natural-language events, photo/PDF import with review queue |
| **School schedules** | Sample bell schedules, class/event types, and “next up” at a glance |
| **Social planning** | Friend overlays, busy/free sharing, collaborative “plan together” flow |
| **Privacy by default** | Events private until explicitly shared; granular sharing levels |

Full product vision, personas, and requirements: **[PRD.md](./PRD.md)** (also in [`docs/PRD.md`](./docs/PRD.md)).

---

## Screenshots

The live demo is the best preview. After onboarding, explore **Home** (Cal Compare + tasks), **Calendar** (day/week/agenda), **Social**, and **Profile** (appearance + demo reset). All data runs locally in the browser.

---

## Tech stack

- **React 19** + **TypeScript**
- **Vite 8** + **Tailwind CSS 4**
- **date-fns** for scheduling logic
- **localStorage** persistence — no backend or API keys required for the demo

---

## Run locally

```bash
git clone https://github.com/manudevmalik/orbit-calendar.git
cd orbit-calendar
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173). Use **Profile → Reset demo data** to replay onboarding.

Production build (matches GitHub Pages base path):

```bash
npm run build
npm run preview
```

---

## Deployment

GitHub Pages is configured with Vite `base: '/orbit-calendar/'` and [`.github/workflows/deploy.yml`](./.github/workflows/deploy.yml). On push to `main`, the workflow builds and publishes to Pages.

---

## License

MIT — portfolio / concept prototype.

---

*Built to demonstrate product thinking in the student calendar space. Feedback welcome via GitHub Issues.*
