# Campus Companion

**Offline-first timetable, assignments, GPA, and notes for university students.**

Built by [Rodney Achota](https://github.com/sirikwa-jnr)

[Live App](https://campus-companion-sigma.vercel.app) · [Report a Bug](https://github.com/sirikwa-jnr/campus-companion/issues) · [Request a Feature](https://github.com/sirikwa-jnr/campus-companion/issues)

---

## What is this?

Campus Companion is a Progressive Web App (PWA) that helps university students organize their semester:

- **Timetable** — weekly view of classes with room and time
- **Assignments** — deadline tracking with overdue detection
- **GPA** — KAFU percentage-weighted average calculator
- **Notes** — per-unit notes that autosave as you type
- **Reminders** — in-app banner before class starts

**Key differentiator:** it works **fully offline**. All data lives in the browser (IndexedDB) and syncs to the cloud when online. Students can add a class on the bus with no signal and see it on their laptop when they get home.

---

## Stack

| Layer | Tech |
| --- | --- |
| Framework | Next.js 15 (App Router, Turbopack) |
| Styling | Tailwind CSS + shadcn/ui |
| Local storage | Dexie.js (IndexedDB wrapper) |
| Backend | Supabase (Postgres + Auth + RLS) |
| PWA | Serwist (service worker, precaching) |
| Deploy | Vercel |

---

## Local Development

### Prerequisites

- Node.js 20+ (`node -v`)
- A Supabase account ([supabase.com](https://supabase.com))

### Steps

```bash
git clone https://github.com/sirikwa-jnr/campus-companion.git
cd campus-companion
npm install
