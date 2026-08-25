# SAMADHAN Phase 5 — Frontend Experience Implementation Plan

## 1. Overview
SAMADHAN is a modern civic-tech reimagining of India's CPGRAMS public grievance platform built around the core narrative:
> *"Citizens should not need to understand government bureaucracy in order to get their problem to the right place."*

This plan outlines the complete frontend implementation using Google Material You / Material Design 3 design system, integrating directly with our existing and verified backend, data engine, and intelligence services.

---

## 2. Design System Tokens & Foundations (PHASE 5A)
* **Color Palette (Material You Tonal Surfaces)**:
  * Background: `#FFFBFE` (Warm white/ivory, strictly no pure white main background)
  * On Surface: `#1C1B1F`
  * Primary: `#6750A4` (Deep Regal Purple)
  * On Primary: `#FFFFFF`
  * Secondary Container: `#E8DEF8`
  * On Secondary Container: `#1D192B`
  * Tertiary: `#7D5260` (Warm Rose Plum)
  * Surface Container: `#F3EDF7`
  * Surface Container Low: `#E7E0EC`
  * Outline: `#79747E`
  * On Surface Variant: `#49454F`
  * Risk Semantics:
    * Critical: `#B3261E` (Surface: `#F9DEDC`)
    * High: `#E2522F` (Surface: `#FFDBCF`)
    * Medium: `#E8B000` (Surface: `#FFF0C2`)
    * Low/Healthy: `#2E7D32` (Surface: `#D4EDDA`)
* **Typography**: Roboto (400, 500, 700) with Material Design 3 type scales (Display, Headline, Title, Body, Label).
* **Shape Language**:
  * Pill Buttons: `border-radius: 9999px`
  * Cards: `border-radius: 24px`
  * Major Containers: `border-radius: 32px`
  * Inputs: Material 3 filled style (12px top rounded, 2px bottom primary border)
* **Organic Atmospheric Backgrounds**:
  * 10–30% opacity blurred organic color blobs and radial gradients (`aria-hidden="true"`).

---

## 3. Component Architecture
```
src/
├── components/
│   ├── common/
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Badge.tsx
│   │   ├── AtmosphericBg.tsx
│   │   ├── MetricCard.tsx
│   │   ├── LoadingState.tsx
│   │   ├── ErrorState.tsx
│   │   └── Charts.tsx
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   └── Layout.tsx
│   ├── citizen/
│   │   ├── GrievanceInputHero.tsx
│   │   ├── RoutingResultCard.tsx
│   │   ├── GrievanceSubmitModal.tsx
│   │   └── GrievanceTimeline.tsx
│   └── government/
│       ├── ExecutiveKpis.tsx
│       ├── AgingDistributionCard.tsx
│       ├── AttentionActionCockpit.tsx
│       ├── DepartmentLeaderboard.tsx
│       ├── DepartmentDetailModal.tsx
│       ├── AppealsIntelligenceCard.tsx
│       └── SystemInsightsCard.tsx
```

---

## 4. Page Architecture
* `/` — **Citizen Home**: Natural language problem input, instant prototype routing with confidence indicator, candidate authorities, quick categories, and submission confirmation with persistent reference generation (`SAM-2026-XXXX`).
* `/track` — **Track Grievance**: Real-time status lookup with visual timeline, SLA aging category, and assigned nodal department.
* `/grievances` — **My Grievances**: Citizen local history, active filters, status cards, and direct tracking links.
* `/government` — **Government Operations & Intelligence Cockpit**:
  * Tab 1: Executive Overview (KPIs, Aging, System Insights, Appeals)
  * Tab 2: Attention Required (Explainable risk triage with concrete evidence and actionable recommendations)
  * Tab 3: Department Leaderboard (Search, sort by received, disposed, disposal rate, pending, risk)
  * Tab 4: Aging & Longevity Analysis (0–60, 60–180, 180–365, >1 year)
  * Department Detail Drilldown Modal on click

---

## 5. API Client Integration
A resilient client-side API client (`src/services/apiClient.ts`) that calls `/api/*` with transparent in-browser client fallback directly into the initialized `CpgramsService` to ensure instantaneous response in all runtime modes.

---

## 6. Execution & Verification
1. Phase 5A: Typography, CSS tokens, atmospheric backgrounds, common UI primitives.
2. Phase 5B: Citizen Experience (Home, Routing, Lodge modal, Track, History).
3. Phase 5C & 5D: Government Operations Cockpit, Attention Required, Department Leaderboard & Drilldown, Insights & Recommendations.
4. Phase 5E: Responsive adjustments, accessibility audit, tests execution (`npm test`, `npm run test:api`, `npm run verify`, `npm run build`).
