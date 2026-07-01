# Product Requirements Document (PRD)
## Project: **Orbit** — The Most Powerful Personal Calendar for School Students

**Author:** Product Team  
**Status:** Draft v1.2  
**Date:** July 1, 2026  
**Changelog:** Added Saturn branding, My AI companion, Appearance settings, Bitmoji-style avatars, Snapchat OAuth sign-in, removed nav review badge  
**Inspired by:** Snap Inc. Saturn team mission — *build the most powerful personal calendar, and the most fun way to share calendars with friends*

---

## 1. Executive Summary

School students live in a fragmented scheduling world: class periods, extracurriculars, homework deadlines, social plans, family obligations, and college/application deadlines are spread across paper planners, school portals, group chats, and screenshots. Existing calendars were built for working adults, not for the social, fast-moving, identity-driven lives of students.

**Orbit** is an AI-native, social-first personal calendar designed exclusively for middle and high school students. It unifies academic and personal life into one intelligent schedule, makes sharing availability with friends effortless and fun, and uses AI to eliminate the manual work that makes calendars feel like chores.

**North Star:** Students open Orbit daily—not because they have to, but because it helps them show up on time, protect their time, and make plans with friends in seconds.

**Home-first social architecture:** Social is not siloed in a separate tab. Cal Compare, friend availability, and Plan Together live on Home by default—matching how students actually coordinate (glance → compare → propose).

---

## 2. Problem Statement

### 2.1 The Student Scheduling Crisis

| Pain Point | Current Behavior | Impact |
|---|---|---|
| **Fragmented schedules** | Bell schedules in PDFs, assignments in LMS, plans in iMessage/Discord | Missed classes, late homework, double-booked social plans |
| **Adult-first calendar UX** | Google/Apple Calendar feels corporate and lonely | Low adoption; students don't treat it as their "source of truth" |
| **Coordination friction** | "When are you free?" loops in group chats | Plans die before they're made |
| **Manual data entry** | Re-typing schedules every semester | Setup drop-off; stale calendars |
| **No context** | Calendar shows *what*, not *why it matters* | Poor prioritization; anxiety |

### 2.2 Why Now

- **AI can finally parse unstructured school data** (syllabi, screenshots, schedule PDFs) into structured events.
- **Gen Z expects social layers on every tool** — calendars should be as shareable as Stories.
- **Snap-scale distribution** proves social calendar demand at millions of users; Saturn validates school-native social calendars at 20K+ schools—the opportunity is to expand feature depth & AI differentiation.

---

## 3. Vision & Product Principles

### Vision
> *The calendar students actually want to use—powerful enough to run their academic life, fun enough to plan with friends, and smart enough to feel like magic.*

### Product Principles

1. **Student-first, always.** Every feature must pass: *"Would a 16-year-old choose this over a group chat?"*
2. **Social by default, private by choice.** Sharing should feel like inviting a friend, not configuring ACLs.
3. **Home-first social.** Cal Compare and friend status belong on Home—not buried in a Social tab.
4. **AI removes work, not control.** Automate ingestion and suggestions; never surprise-delete or auto-share.
5. **Fast to set up, faster to use.** Zero-to-useful in under 3 minutes.
6. **Delight in the details.** Micro-interactions, confetti on task completion, reactions—calendar as self-expression.

---

## 4. Target Users & Personas

### Primary Segment
**US middle & high school students (ages 13–18)**, starting with grades 9–12.

### Personas

| Persona | Name | Needs | Orbit Value |
|---|---|---|---|
| **The Organizer** | Maya, 16, junior | Keeps friend group together; manages club + AP load | Cal Compare on Home, shared availability, one-tap propose |
| **The Overwhelmed** | Jordan, 14, freshman | Bad at deadlines; anxious about missing things | Tasks widget on Home, auto-import schedule, gentle nudges |
| **The Social Planner** | Alex, 17, senior | Life = friends + sports + college apps | Friend carousel, "who's free tonight?" gaps view |
| **The Minimalist** | Sam, 15 | Wants simple view, no clutter | Clean day view, List/Gaps toggle, one-tap focus blocks |

### Secondary Users (Future)
- College students (semester complexity)
- Parents (read-only visibility into kid's schedule)
- Teachers/clubs (optional broadcast calendars)

---

## 5. Goals & Success Metrics

### Business Goals (12 months)
- **Adoption:** 10M MAU in core demographic (US high school)
- **Retention:** D30 retention ≥ 45%
- **Social density:** ≥ 60% of active users connected to ≥ 5 friends on Orbit
- **Engagement:** ≥ 4 sessions/week per active user

### Product Metrics

| Metric | Definition | Target |
|---|---|---|
| **Time-to-first-value** | Signup → calendar populated with classes | < 3 min (p50) |
| **Schedule completeness** | % users with ≥ 80% of school week mapped | ≥ 70% by D7 |
| **Cal Compare engagement** | DAU who tap friend in carousel | ≥ 40% |
| **Plan conversion** | "Hang out" → event created | ≥ 35% |
| **Task completion rate** | Tasks checked off within 7-day window | ≥ 25% |
| **AI acceptance rate** | Suggested events user keeps | ≥ 75% |
| **Share rate** | Users who share availability weekly | ≥ 50% |

### Guardrail Metrics
- Privacy complaints / unauthorized share reports: < 0.01% of users
- Missed critical reminders (user-reported): declining MoM
- Under-13 signup attempts blocked: 100%

---

## 6. Core User Jobs to Be Done

1. **"Help me know where I need to be today."**
2. **"Don't let me forget homework or tests."**
3. **"Make it easy to hang out with friends without 50 messages."**
4. **"Set up my whole semester without typing everything in."**
5. **"Show my friends I'm busy without oversharing."**
6. **"See at a glance who's free right now."** *(Saturn-validated)*

---

## 7. Feature Requirements

### 7.1 MVP (Phase 1) — *Launch & Learn*

#### A. Smart Personal Calendar
| Feature | Description | Priority |
|---|---|---|
| **Day / Week / Agenda views** | Student-optimized layouts; "period" view aligned to block schedules | P0 |
| **Day view List / Gaps toggle** | Switch between event list and open free-time blocks | P1 |
| **Sticky now/next header** | Current period + countdown + next period under app bar | P1 |
| **Event types** | Class, assignment, exam, practice, social, personal, focus time | P0 |
| **Reminders & nudges** | Configurable; smart defaults ("leave for bus in 8 min") | P0 |
| **Recurring events** | Repeats: daily / weekly / MWF on event create | P2 (Phase 1.5) |
| **Focus mode** | Hide social noise during class/study blocks | P1 |

#### B. AI Schedule Ingestion
| Feature | Description | Priority |
|---|---|---|
| **School lookup** | Search by name → pre-built bell schedules + holidays | P0 |
| **Schedule rotation selector** | A Day / B Day / Regular / Early Dismissal after school confirm | P1 |
| **Photo/PDF import** | Snap syllabus or schedule → parsed events for review | P0 |
| **Natural language add** | "Bio lab every Tuesday 3rd period" → structured event; Home NL bar | P0/P2 |
| **Semester rollover** | Clone + adjust schedule for new term | P1 |

**AI UX requirement:** All AI-created events land in a **Review Queue**—never auto-published without confirmation (v1).

#### C. Social Calendar (The Fun Layer) — Home-First
| Feature | Description | Priority |
|---|---|---|
| **Cal Compare carousel (Home)** | Horizontal friend strip with live status: In class / Free / Busy; tap → today's availability overlay | **P0** |
| **Friend connections** | Add via username, QR, or contact sync (with consent); manage in Profile | P0 |
| **Availability sharing** | Share free/busy blocks; hide event titles by default | P0 |
| **Tasks widget (Home)** | Checklist of assignment/exam events due ≤7 days; checkbox + confetti on complete | P0/P1 |
| **Plan together (simplified)** | Pick friends → top 3 slots → one-tap Propose → share via iMessage/Snap | P0 |
| **Friend overlay** | See when 2+ friends are free (heatmap / overlap view) | P0 |
| **School graph hook (onboarding)** | "47 classmates at [School] use Orbit" + school-filtered friend suggestions | P2 |
| **Reactions & stickers** | React to friends' *shared* public events (game night, concert) | P1 |

**Privacy defaults:**
- Event details **private** unless explicitly marked "friends can see"
- Parents/guardians: no access in MVP unless student invites

#### D. Onboarding
- **Snapchat OAuth sign-in** — "Continue with Snapchat" (Snap yellow + ghost icon) on welcome step; simulated OAuth pre-fills profile, username, demo friends; stores `connectedWithSnapchat: true`
- **Email alternative** — "Continue with email" for users without Snap
- Age gate (13+)
- Pick school → confirm schedule → **rotation picker** (Today is… A Day / B Day / Regular)
- **School graph social proof** — classmates count + filtered friend suggestions
- Add 3 friends (optional skip, re-prompt later)
- Connect notifications

#### E. Saturn Branding Partnership
| Feature | Description | Priority |
|---|---|---|
| **Saturn logo in header** | Tasteful Saturn-inspired ring/planet mark next to "Orbit" in app header; "powered by Saturn" partnership badge | P1 |
| **Brand co-marketing** | Reinforces Snap/Saturn ecosystem alignment without trademark infringement | P2 |

#### F. My AI Companion (Snapchat My AI–inspired)
| Feature | Description | Priority |
|---|---|---|
| **My AI entry point** | Floating "My AI" button on main app screens (above bottom nav) | P1 |
| **Chat UI** | Friendly illustrated avatar; conversational interface for schedule questions | P1 |
| **Simulated AI responses** | Pattern-matching + canned responses for: schedule, free time, homework, friends, event add guidance | P1 |
| **Chat history persistence** | Messages stored in localStorage | P1 |
| **Teen-appropriate persona** | Friendly, helpful, not corporate ChatGPT tone | P1 |

#### G. Appearance Settings (Snapchat Settings > Appearance–inspired)
| Feature | Description | Priority |
|---|---|---|
| **Color mode** | Light / Dark / Match system toggle | P1 |
| **Preset themes** | Default (Amber), Ocean, Forest, Sunset, Lavender, Classic Snap (yellow accent) | P1 |
| **CSS variable theming** | Theme selection stored in localStorage; applied globally via CSS custom properties | P1 |
| **Per-weekday colors** | Custom accent color per Mon–Sun; colored dot in Week view, subtle bg in Day view | P2 |
| **Per-date colors** | Custom accent for specific calendar dates (future) | P3 |

#### H. Bitmoji-Style Avatar Customization
| Feature | Description | Priority |
|---|---|---|
| **Avatar builder (MVP)** | Pick skin tone, hair style/color, expression, outfit color, accessories | P1 |
| **Composable SVG layers** | Custom illustrated avatar (not Bitmoji API) | P1 |
| **Profile hero display** | Avatar replaces plain initials on Profile tab | P1 |
| **Edit Bitmoji action** | "Edit Bitmoji" button opens builder modal | P1 |
| **localStorage persistence** | Saved to user profile | P1 |

#### I. Navigation UX
| Feature | Description | Priority |
|---|---|---|
| **Remove Add tab badge** | No review queue count badge on bottom nav Add button (header banner remains) | P1 |

---

### 7.2 Phase 2 — *Power Features*

| Feature | Description |
|---|---|
| **Homework hub** | Assignment deadlines synced from photo import + manual entry; "due soon" smart list |
| **Group calendars** | Clubs, teams, study groups with shared events |
| **Study session matcher** | "Find 45 min when me + 3 friends are free before Friday" |
| **Calendar Stories** | Ephemeral "this is my week" share to close friends |
| **Widgets** | Lock screen / home screen "next up" + friend availability |
| **LMS integrations** | Google Classroom, Canvas (where permitted) |
| **Recurring events (full RRULE)** | Expand simple repeat logic to full iCal RRULE support |

---

### 7.3 Phase 3 — *Scale & Ecosystem*

| Feature | Description |
|---|---|
| **College mode** | Irregular schedules, office hours, registration deadlines |
| **Family view** | Parent read-only; pickup coordination |
| **AI weekly planner** | "Balance SAT prep, soccer, and sleep this week" |
| **School partnerships** | Official schedule feeds, closed-campus modes |
| **Global expansion** | Localization, non-US school systems |

---

## 8. Competitive Reference — Saturn (Snap)

### Saturn Positioning
Saturn (acquired by Snap) positions as **"Time Together"** — a school-native social calendar with:
- **20K+ schools** in directory with bell schedules
- **Cal Compare** — live friend status carousel (killer feature)
- **Tasks** integrated with school schedule
- **Group calendars** for clubs/teams
- **Bulletin** — school announcements layer
- Strong network effects within school graphs

### What Saturn Does Well
| Strength | Detail |
|---|---|
| **Cal Compare** | Instant glance at friend availability; drives daily opens |
| **School directory** | Pre-built schedules reduce setup friction |
| **Social density** | Friends at same school = natural viral loop |
| **Tasks on Home** | Academic deadlines visible alongside social |
| **Native mobile UX** | Fast, fun, teen-native interactions |

### Orbit Differentiation
| Wedge | Orbit Advantage |
|---|---|
| **AI syllabus import** | Photo/PDF → structured events with review queue; Saturn lacks deep AI ingestion |
| **Natural language CRUD** | "Bio lab every Tuesday 3rd period" — zero typing |
| **Smarter setup** | AI + review queue vs. manual schedule entry |
| **Privacy tiers** | Granular busy-only vs. details sharing |
| **Home-first + AI** | Social coordination *plus* intelligent academic layer |

**Strategic takeaway:** Match Saturn on Cal Compare, tasks, and Home-first social; win on AI setup speed and daily academic utility.

---

## 9. AI Strategy

### AI Use Cases (Prioritized)

1. **Document understanding** — syllabi, screenshots, emailed schedules
2. **Schedule inference** — bell schedules, rotating days (A/B), early dismissal
3. **Smart reminders** — contextual ("Pack gym clothes—volleyball away today")
4. **Natural language CRUD** — create, move, delete via chat
5. **Conflict resolution** — "You have 3 things at 4pm Thursday—pick one?"
6. **Social coordination** — optimal meeting time across friend graphs

### AI Safety & Trust Requirements
- Transparent labeling of AI-suggested vs. user-created events
- One-tap undo for bulk imports
- No training on private event content without explicit opt-in
- Age-appropriate content filtering on shared/public layers
- Human-readable explanation for every AI suggestion ("Because your syllabus says…")

---

## 10. Social & Privacy Model

### Sharing Tiers

```
┌─────────────────────────────────────────────────────┐
│  PRIVATE (default)     Only you see details         │
├─────────────────────────────────────────────────────┤
│  BUSY ONLY             Friends see blocked time     │
├─────────────────────────────────────────────────────┤
│  FRIENDS SEE DETAILS   Title + time visible         │
├─────────────────────────────────────────────────────┤
│  GROUP / PUBLIC        Club team, optional broadcast│
└─────────────────────────────────────────────────────┘
```

### Requirements
- Granular per-event sharing toggle
- Block list / mute friend overlays
- Report flow for harassment via calendar invites
- COPPA/FERPA-aware data handling; minimal PII collection
- Export & delete account (GDPR-style portability)

---

## 11. Key User Flows

### Flow 1: First Week Setup (< 3 min)
```
Download → Age verify → Pick school → Confirm periods → 
Rotation picker (A/B/Regular) → School graph hook → 
Import syllabus photo → Review 12 events → Add friends → Done
```

### Flow 2: Plan After School (Simplified)
```
Home → Tap "Hang out" → Select friends → Orbit shows top 3 overlap slots → 
One-tap "Propose" → Simulated share sheet (iMessage/Snap) → Event created
```

### Flow 3: Cal Compare (New)
```
Open Home → Scroll Cal Compare carousel → See friend live status (In class/Free/Busy) → 
Tap friend → Expand today's availability overlay → Tap "Hang out" to propose
```

### Flow 5: Snapchat Sign-In
```
Welcome → Tap "Continue with Snapchat" → Loading → Profile pre-filled (name, username, avatar colors) → 
Demo friends imported → School picker → Friends step → Done
```

### Flow 6: My AI Chat
```
Any tab → Tap floating "My AI" → Ask "what's free today?" → AI responds with gap analysis → 
Follow-up "homework due soon" → AI lists upcoming assignments
```

### Flow 7: Customize Appearance
```
Profile → Settings → Appearance → Pick Light/Dark/System → Select Ocean theme → 
Set Wednesday color to lavender → Week view shows dot on Wed column
```

---

## 12. Non-Functional Requirements

| Category | Requirement |
|---|---|
| **Performance** | Cold start < 2s; calendar render < 500ms |
| **Offline** | Read schedule offline; queue writes |
| **Reliability** | 99.9% uptime for core calendar API |
| **Notifications** | Deliver within 60s of trigger; quiet hours respected |
| **Accessibility** | WCAG 2.1 AA; Dynamic Type; screen reader labels |
| **Platforms** | iOS + Android native (MVP); web read-only demo (Phase 1) |

---

## 13. Competitive Landscape

| Product | Strength | Gap for Students |
|---|---|---|
| Google Calendar | Ubiquitous, reliable | Not social; bad school setup |
| Apple Calendar | Native, simple | No friend layer; no AI import |
| Notion / planners | Flexible | Too much work; not real-time social |
| **Saturn (Snap)** | Cal Compare, 20K+ school directory, tasks, group calendars, Bulletin; proven social density | Limited AI ingestion; manual setup for non-directory schools; opportunity for Orbit's AI wedge |
| Group chats | Zero friction | No structured time; plans get lost |

**Differentiation:** Orbit wins on *setup speed* (AI), *daily utility* (student-specific views + tasks), and *social coordination* (Cal Compare parity + fun propose flow)—while matching Saturn's Home-first social architecture.

---

## 14. Monetization (Future — Not MVP)

- **Free core** for all students (network effects depend on this)
- Optional **Orbit+**: advanced AI planner, custom themes, college prep modules
- **No ads in calendar views** (trust killer for minors)
- B2B2S: school/district partnerships for official integrations

---

## 15. Risks & Mitigations

| Risk | Mitigation |
|---|---|
| Low friend adoption (empty social graph) | School-based discovery; Cal Compare empty state; school graph hook; useful solo calendar first |
| Saturn incumbency at school | AI differentiation; faster setup; tasks + social parity on Home |
| AI import errors → lost trust | Review queue; confidence scores; easy bulk edit |
| Privacy incident | Private-by-default; security audits; teen safety team |
| Seasonal churn (summer) | Summer mode: jobs, camps, trips, college prep |
| School schedule changes | Push notifications + one-tap "accept schedule update" |
| Regulatory (minors) | Age gates, parental controls roadmap, legal review |

---

## 16. Release Roadmap

### Q3 2026 — Alpha *(Saturn-informed MVP ordering)*
1. School lookup + rotation selector (A/B day)
2. Personal calendar + Day List/Gaps view
3. **Cal Compare carousel on Home** (P0)
4. **Tasks widget on Home**
5. AI photo import + NL add bar
6. Simplified Plan Together (propose + share)
7. Friend connections + Profile friend management
8. **Saturn branding in header**
9. **My AI companion (simulated chat)**
10. **Appearance settings (themes + light/dark)**
11. **Bitmoji-style avatar builder**
12. **Snapchat OAuth sign-in (simulated)**
13. iOS only, 3 pilot cities

### Q4 2026 — Beta Launch
- Android parity
- Sticky now/next header
- Recurring events (daily/weekly/MWF)
- School graph onboarding hook
- Widgets + push reminders
- Expand to 5,000 schools

### Q1 2027 — GA
- Homework hub
- Group calendars
- Study session matcher
- National US launch + metrics review

### Q2 2027+
- College mode, LMS integrations, international

---

## 17. Open Questions

1. **Authentication:** Snap SSO vs. standalone vs. both? *(v1.2 demo: simulated Snapchat OAuth + email path)*
2. **Moderation:** How to handle inappropriate event titles in shared layers?
3. **School data licensing:** Build crowdsourced DB vs. partner with schedulers?
4. **Teacher/club publishing:** Do we need approval workflows at launch?
5. **Name:** Orbit placeholder — brand fit with Snap portfolio TBD.
6. **Saturn coexistence:** Position as complement or direct competitor within Snap portfolio?

---

## 18. Appendix: Sample User Stories

| ID | Story | Acceptance Criteria |
|---|---|---|
| US-01 | As a new student, I want to import my schedule from a photo so I don't type 40 classes manually | ≥ 90% of period blocks correctly parsed; user confirms before save |
| US-02 | As a student, I want to see when my 3 closest friends are free after school | Cal Compare shows live status; tap expands availability overlay |
| US-03 | As a student, I want homework deadlines on Home | Tasks widget shows assignment/exam due ≤7 days; checkbox completes with confetti |
| US-04 | As a privacy-conscious user, I want friends to see I'm busy without seeing "therapy" | Busy-only mode hides title |
| US-05 | As a club president, I want to publish practice times to members | Group calendar push; members opt-in |
| US-06 | As a student on A/B schedule, I want to pick today's rotation at onboarding | Rotation picker after school confirm; schedule reflects variant |
| US-07 | As a student, I want to propose a hangout without group chat voting | Pick friends → top 3 slots → one-tap propose → share sheet |
| US-08 | As a student, I want to sign in with Snapchat | Welcome screen shows Snap yellow button; OAuth pre-fills profile and imports demo friends |
| US-09 | As a student, I want an AI calendar buddy | My AI floating button opens chat; answers schedule, homework, and free-time questions |
| US-10 | As a student, I want to customize how Orbit looks | Appearance settings: light/dark/system, 6 themes, per-weekday colors |
| US-11 | As a student, I want a personalized avatar | Bitmoji-style builder with skin, hair, expression, outfit, accessories; shown on Profile |
| US-12 | As a user, I want Saturn branding visible | Saturn ring/planet mark next to Orbit in header |

---

## 19. Summary

Orbit reimagines the calendar for the 50M+ US secondary students who deserve a tool built for *their* life—not their parents' workday. By combining **AI-powered setup**, a **student-native daily experience**, **Saturn-validated Cal Compare social on Home**, and **Snap-inspired sharing**, we can solve a decades-old problem with a product students choose, friends amplify, and families trust.

**The bet:** Make the calendar powerful enough to be indispensable alone, and fun enough with friends that it spreads through schools the way the best social products always have—one hallway at a time.

**v1.2 update:** Added Saturn header branding, My AI companion, Appearance settings (themes/light-dark/per-day colors), Bitmoji-style avatar builder, simulated Snapchat OAuth sign-in, and removed review queue badge from bottom nav Add button.

**v1.1 update:** Prioritized Cal Compare, Home-first social, tasks widget, schedule rotation, and simplified Plan Together based on Saturn competitive reference review.
