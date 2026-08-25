# SAMADHAN — Public Grievance Redressal & Operational Intelligence Platform

> **"Citizens should not need to understand government bureaucracy in order to get their problem to the right place."**

SAMADHAN is a civic-tech public grievance platform built for the **"Build What Moves India"** initiative. It reimagines India's Centralised Public Grievance Redress and Monitoring System (**CPGRAMS**) by transforming raw administrative statistics into an intuitive, closed-loop citizen-to-government grievance intelligence experience.

---

## Overview

Traditional grievance redressal portals place an unreasonable cognitive burden on citizens: navigating complex ministry hierarchies, selecting jurisdictional codes, and deciphering obscure bureaucratic terminology. When citizens manage to lodge grievances, they face opaque tracking statuses, while public officials receive static aggregate tables without proactive bottleneck identification.

SAMADHAN resolves this disconnect by establishing a bidirectional, closed-loop experience:
1. **Citizen Simplicity**: Citizens describe problems in natural, everyday language.
2. **Deterministic Routing**: The system maps the issue directly to the target public authority with calibrated confidence and alternative candidates.
3. **Transparent Redressal Lifecycle**: Multi-stage milestone tracking with SLA monitoring and nodal cell assignment.
4. **National Operational Telemetry**: Government administrators monitor live system throughput (2.17M+ cases), 4-bucket aging distribution, and appellate metrics.
5. **Actionable Triage & Evidence**: Deterministic risk scoring (0–100) isolates lagging cells, explains **why** they were flagged, and delivers prioritized operational recommendations backed by DARPG source audits.

---

## Why SAMADHAN?

| Dimension | Traditional CPGRAMS Portal | SAMADHAN Modern Platform |
|---|---|---|
| **Authority Discovery** | Citizens must manually navigate ministry lists & nodal codes. | Natural language problem input auto-matches destination authority. |
| **Grievance Tracking** | Single-line opaque status without aging context. | Multi-stage visual timeline with SLA countdown and nodal unit details. |
| **Administrative Views** | Static, uninterpreted aggregate tables. | Interactive "National Pulse" cockpit with executive KPIs and scope filters. |
| **Risk & Bottleneck Detection** | Manual retrospective audits. | Deterministic 0–100 risk scoring explaining causation and urgency. |
| **Operational Guidance** | Generic directives ("dispose faster"). | Actionable recommendations tied to measurable metric triggers. |
| **Data Traceability** | Disconnected reports. | Transparent evidence lineage linking every number to verified source URLs. |

---

## The SAMADHAN Journey

```
CITIZEN PROBLEM
      ↓
Describe problem in natural everyday language
      ↓
SAMADHAN understands intent & keywords
      ↓
Authority identified (with confidence & alternatives)
      ↓
Grievance lodged (Demo reference SAM-2026-XXXX)
      ↓
Transparent multi-stage milestone tracking
      ↓
Government receives structured telemetry
      ↓
Operational bottlenecks flagged (0–100 Risk Score)
      ↓
Evidence-backed action recommendations delivered
```

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                       CITIZEN CLIENT                        │
│   Natural Language Input • Voice Mic • Status Timeline       │
└──────────────────────────────┬──────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────┐
│                    REACT 19 / VITE 6 UI                     │
│    Material You (MD3) • Tonal Surfaces • Organic Backdrop   │
└──────────────────────────────┬──────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────┐
│                    API CLIENT / BRIDGE                      │
│     Typed Client Bridge • Instant In-Browser Fallback       │
└───────────────┬─────────────────────────────┬───────────────┘
                │ (HTTP)                      │ (Direct ESM)
┌───────────────▼──────────────┐              │
│       EXPRESS 5 API          │              │
│  Standardized JSON Responses │              │
└───────────────┬──────────────┘              │
                │                             │
┌───────────────▼─────────────────────────────▼───────────────┐
│                 INTELLIGENCE SERVICE LAYER                  │
│   CpgramsService • System Overview • Department Rankings     │
└───────────────┬─────────────────────────────┬───────────────┘
                │                             │
┌───────────────▼──────────────┐ ┌────────────▼───────────────┐
│     INTELLIGENCE ENGINES     │ │     DATA ENGINE LAYER      │
│  RiskEngine • RoutingEngine  │ │ CSV Parser • Transformer   │
│  RecommendationEngine        │ │ Analytics • Pivot Storage  │
└───────────────┬──────────────┘ └────────────┬───────────────┘
                │                             │
┌───────────────▼─────────────────────────────▼───────────────┐
│       10_MASTER_verified_cpgrams_metrics_long.csv           │
│     2,134 Verified Data Rows • 278 Public Entities          │
└─────────────────────────────────────────────────────────────┘
```

---

## Intelligence Architecture

### 1. Deterministic Operational Risk Engine (`src/intelligence/riskEngine.ts`)
Operational risk is calculated deterministically on a 0–100 scale using verified metric thresholds:
* **Disposal Velocity**:
  * `< 50%`: +45 risk points
  * `50% – 70%`: +35 risk points
  * `70% – 80%`: +25 risk points
  * `80% – 90%`: +15 risk points
* **Chronic Pendency (> 1 Year)**:
  * `> 10 cases`: +35 risk points
  * `1 – 10 cases`: +25 risk points
* **Approaching 1-Year (180–365 Days)**:
  * `> 100 cases`: +20 risk points
  * `20 – 100 cases`: +10 risk points
* **Backlog Volume Strain**:
  * `Total pending > 5,000 cases` with `disposal < 85%`: +10 risk points
* **Risk Tiers**:
  * `CRITICAL`: Score &ge; 45, or `pending_more_than_1_year > 0`, or `disposalRate < 70%`
  * `HIGH`: Score 25–44, or `disposalRate < 80%`, or `pending_180_365_days > 50`
  * `MEDIUM`: Score 15–24, or `disposalRate < 90%`
  * `LOW`: Score < 15 with zero chronic pendency

### 2. Actionable Recommendation Engine (`src/intelligence/recommendationEngine.ts`)
Converts metric findings into prioritized operational actions:
* `URGENT`: Workflow bottleneck review for disposal rates trailing 70%.
* `URGENT`: Special disposal drive for cases exceeding 1 year.
* `HIGH`: Aging queue prioritization for cases in the 180–365 day window.
* `ROUTINE`: Workflow documentation for high-performing authorities (> 90% disposal rate).

### 3. Citizen Grievance Routing Engine (`src/intelligence/routingEngine.ts`)
* Uses word-boundary regex matching across 16 core civic categories.
* Maps citizen vocabulary to 278 verified CPGRAMS authorities.
* Produces calibrated prototype confidence, match rationale, and alternative jurisdiction suggestions.
* *Disclosure: Operates as a deterministic keyword-taxonomy prototype demonstrating citizen-centric routing without pretending to run a black-box ML model.*

---

## Verified CPGRAMS Dataset

* **Source File**: [`10_MASTER_verified_cpgrams_metrics_long.csv`](file:///c:/Users/tarun/Documents/My%20Projects/Samadhan/10_MASTER_verified_cpgrams_metrics_long.csv)
* **Total Rows**: **2,134 / 2,134 valid data rows** (0 parser errors, 0 skipped rows).
* **Reporting Entities**: **278 distinct public authorities** (Central Ministries, Departments, State/UT Governments).
* **Distinct Metrics**: **31 metrics** across 8 analytical dataset partitions.
* **Official Live 2026 Telemetry Snapshot (Jan 1 – Aug 24, 2026)**:
  * **Received**: 21,77,902 grievances
  * **Disposed**: 19,02,690 grievances
  * **Overall Disposal Rate**: 87.36%
  * **Total Active Backlog**: 2,75,212 cases
  * **Aging Distribution**:
    * 0–60 Days: 1,96,528 cases (71.4%)
    * 60–180 Days: 67,094 cases (24.4%)
    * 180–365 Days: 11,590 cases (4.2%)
    * \> 1 Year: 0 cases (0.0%)
* **CPGRAMS Appeals Snapshot (Aug 25, 2026)**:
  * **Appeals Received**: 2,30,602
  * **Appeals Disposed**: 2,14,501
  * **Appeals Pending**: 16,101
  * **Appeals Disposal Velocity**: 93.02% across 88 central departments.

---

## API Specification

All API routes return standardized JSON responses and structured error codes.

### Core Endpoints

| Method | Route | Description |
|---|---|---|
| `GET` | `/api/health` | Service health, version, loaded row count, entity count, and engine status |
| `GET` | `/api/meta` | System metadata, dataset catalog, metric definitions, and methodology |
| `GET` | `/api/overview` | Aggregated system overview with scope filters and source metadata |
| `GET` | `/api/departments` | Filterable summary list of all 278 departments with disposal rates |
| `GET` | `/api/departments/ranking` | Authority leaderboard sorted by volume, disposal rate, or pendency |
| `GET` | `/api/departments/:entity` | Detailed profile for a single authority including 4-bucket aging & appeals |
| `GET` | `/api/attention` | Operational triage list of flagged authorities with configurable thresholds |
| `GET` | `/api/aging` | 4-bucket aging distribution breakdown (system-wide or entity-specific) |
| `GET` | `/api/trends` | Longitudinal series partitioned by dataset (monthly central, 10-year history) |
| `GET` | `/api/appeals` | Official CPGRAMS secondary appeals audit telemetry |
| `GET` | `/api/entities` | Master catalog of 278 reporting entities with scope tags |
| `GET` | `/api/periods` | Catalog of 18 distinct dataset reporting periods |
| `GET` | `/api/metrics` | Catalog of 31 distinct CPGRAMS metrics |
| `GET` | `/api/intelligence/overview` | Executive analytical findings, aging concentration, and evidence links |
| `GET` | `/api/intelligence/attention` | Action cockpit with 0–100 risk scores, causal factors, and recommendations |
| `GET` | `/api/intelligence/routing?text=...` | Grievance routing with category detection, confidence, and alternatives |
| `GET` | `/api/intelligence/trends/:entity` | Directional performance trajectory (`IMPROVING`, `DECLINING`, `STABLE`) |
| `GET` | `/api/facilities/search?q=...` | Geographic healthcare facility search & administrative jurisdiction resolution |
| `GET` | `/api/facilities/:id` | Detailed facility record lookup by ID or NIN identifier |

---

## API Examples

### 1. Grievance Routing (`GET /api/intelligence/routing?text=income%20tax%20refund%20delayed`)
```json
{
  "queryText": "income tax refund delayed",
  "status": "MATCHED",
  "detectedCategory": "Income Tax & Direct Taxation",
  "recommendedEntity": "Central Board of Direct Taxes (Income Tax)",
  "confidence": 0.91,
  "matchReason": "Detected keywords (income tax, refund, tax) matching Income Tax & Direct Taxation: Keywords match direct taxation, income tax return filing, PAN cards, or tax refunds.",
  "alternativeCandidates": [
    {
      "entity": "Central Board of Indirect Taxes and Customs",
      "confidence": 0.64,
      "reason": "Related jurisdiction in Income Tax & Direct Taxation category."
    }
  ],
  "disclaimer": "Prototype routing — not an official CPGRAMS routing decision. Final grievance allocation is subject to administrative review."
}
```

### 2. Department Intelligence Profile (`GET /api/intelligence/departments/Labour%20and%20Employment`)
```json
{
  "entity": "Labour and Employment",
  "scope": "Department",
  "risk": {
    "entity": "Labour and Employment",
    "scope": "Department",
    "riskLevel": "LOW",
    "riskScore": 0,
    "reasons": [
      "Disposal performance (92.81%) is healthy and pendency is within normal aging thresholds."
    ],
    "factors": [],
    "evidence": [
      {
        "dataset": "live_dashboard_2026",
        "entity": "Labour and Employment",
        "metric": "effectiveDisposalRate",
        "value": 92.81,
        "period": "2026-01-01 to 2026-08-24",
        "sourceUrl": "https://pgportal.gov.in/darpgdashboard",
        "sourceNote": "Official CPGRAMS live dashboard."
      }
    ]
  },
  "performanceSummary": "Labour and Employment has received 2,25,395 grievances and disposed 2,09,186, recording an effective disposal rate of 92.81%. Total unresolved pendency stands at 16,209 cases.",
  "agingInterpretation": "94.3% of pending cases (15,291) are in the 0–60 day window. Zero cases exceed 1 year of pendency.",
  "recommendations": [
    {
      "priority": "ROUTINE",
      "action": "Maintain current disposal procedures and document effective redressal workflows.",
      "rationale": "Performance is strong with a 92.81% disposal rate and zero >1-year pendency.",
      "triggerCondition": "disposal_rate >= 90% && pending_more_than_1_year == 0",
      "targetMetric": "percent_disposed"
    }
  ]
}
```

---

## Design System (Google Material You / MD3)

* **Background**: Warm Ivory Surface (`#FFFBFE`) — strictly no pure white canvas.
* **Primary Color**: Deep Regal Purple (`#6750A4`)
* **Secondary Container**: Soft Lavender (`#E8DEF8`)
* **Tertiary Accent**: Rose Plum (`#7D5260`)
* **Surface Containers**: Tonal Surface Container (`#F3EDF7`) & Surface Container Low (`#E7E0EC`).
* **Shape Language**: Pill-shaped buttons (`rounded-full`), 24px/32px card radii, and 12px Material filled text fields.
* **Atmospheric Depth**: 10–30% opacity blurred organic color blobs (`aria-hidden="true"`).
* **Typography**: Roboto (400, 500, 700).

---

## Project Structure

```
samadhan/
├── 10_MASTER_verified_cpgrams_metrics_long.csv  # Verified CPGRAMS master dataset
├── package.json                                  # Dependencies & NPM scripts
├── tsconfig.json                                 # TypeScript configuration
├── vite.config.ts                                # Vite 6 configuration
├── index.html                                    # HTML entry point with Roboto fonts
├── src/
│   ├── main.tsx                                  # React 19 application mount
│   ├── App.tsx                                   # React Router DOM v7 layout & routes
│   ├── api/                                      # Backend Express API Layer
│   │   ├── app.ts                                # Express app configuration & CORS
│   │   ├── routes.ts                             # Express route handlers
│   │   ├── serviceInit.ts                        # Singleton service initializer
│   │   ├── server.ts                             # Standalone Express server entry
│   │   └── app.test.ts                           # Supertest API integration test suite
│   ├── components/                               # Reusable UI components
│   │   ├── citizen/                              # Citizen experience components
│   │   │   ├── GrievanceInputHero.tsx            # Hero natural language input & matching
│   │   │   ├── GrievanceSubmitModal.tsx          # Submission dialog & reference generation
│   │   │   ├── GrievanceTimeline.tsx             # Visual progress lifecycle timeline
│   │   │   └── SamadhanJourney.tsx               # 8-step journey & before-after matrix
│   │   ├── common/                               # Core Material You primitives
│   │   │   ├── AtmosphericBg.tsx                 # Decorative organic blurred blobs
│   │   │   ├── Badge.tsx                         # Pill chips & risk tags
│   │   │   ├── Button.tsx                        # Pill-shaped button primitive
│   │   │   ├── Card.tsx                          # Tonal surface container
│   │   │   ├── Charts.tsx                        # Accessible CSS/SVG visualizations
│   │   │   ├── EvidenceBadge.tsx                 # Data lineage & source audit trigger
│   │   │   ├── LoadingState.tsx                  # Material You loading spinner
│   │   │   ├── MetricCard.tsx                    # KPI metric card with en-IN formatting
│   │   │   └── TransparencyModal.tsx             # Methodology & Trust disclosures
│   │   ├── government/                           # Government cockpit components
│   │   │   ├── AgingDistributionCard.tsx         # 4-bucket aging distribution
│   │   │   ├── AppealsIntelligenceCard.tsx       # CPGRAMS appeals audit snapshot
│   │   │   ├── AttentionActionCockpit.tsx        # Priority triage & recommendations
│   │   │   ├── DepartmentDetailModal.tsx         # Comprehensive audit drilldown
│   │   │   ├── DepartmentLeaderboard.tsx         # Searchable/sortable leaderboard
│   │   │   ├── ExecutiveKpis.tsx                 # Top KPI cards
│   │   │   └── SystemInsightsCard.tsx            # AI-synthesized executive findings
│   │   └── layout/                               # Layout wrappers
│   │       ├── Footer.tsx                        # Government platform footer
│   │       ├── Layout.tsx                        # Application layout wrapper
│   │       └── Navbar.tsx                        # Civic header & navigation pills
│   ├── data/                                     # Real CPGRAMS Data Engine
│   │   ├── analytics.ts                          # Tonal aggregation & triage logic
│   │   ├── csvLoader.ts                          # Strict RFC 4180 CSV parser
│   │   ├── index.ts                              # Data layer exports
│   │   ├── transformer.ts                        # Metric pivot & rate calculators
│   │   ├── types.ts                              # Strongly typed CSV schema definitions
│   │   └── verify.ts                             # 11-point dataset verification script
│   ├── intelligence/                             # Actionable Intelligence Layer
│   │   ├── index.ts                              # Intelligence exports
│   │   ├── insightEngine.ts                      # Executive insight generator
│   │   ├── intelligence.test.ts                  # Intelligence unit test suite
│   │   ├── recommendationEngine.ts               # Action recommendation generator
│   │   ├── riskEngine.ts                         # Deterministic 0-100 risk scorer
│   │   ├── routingEngine.ts                      # Keyword taxonomy routing prototype
│   │   └── types.ts                              # Intelligence contracts & evidence types
│   ├── pages/                                    # Top-Level Application Pages
│   │   ├── GovernmentPage.tsx                    # National Operations & Intelligence Cockpit
│   │   ├── GrievancesPage.tsx                    # Citizen Grievance Portal (local history)
│   │   ├── HomePage.tsx                          # Citizen Landing & AI Input Hero
│   │   └── TrackPage.tsx                         # Live Grievance Tracking & Timeline
│   ├── services/                                 # Service & Client Layer
│   │   ├── apiClient.ts                          # Resilient frontend API bridge
│   │   ├── cpgramsService.ts                     # Core CPGRAMS intelligence service
│   │   ├── cpgramsService.test.ts                # Service layer test suite
│   │   ├── index.ts                              # Service layer exports
│   │   └── types.ts                              # Service query contracts
│   └── styles/
│       └── index.css                             # Material You MD3 global styling & tokens
```

---

## Getting Started

### Prerequisites
* Node.js &ge; 18.0.0
* npm &ge; 9.0.0

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd Samadhan

# Install dependencies
npm install
```

### Running the Application

#### Option A: Frontend Development Server (with in-browser CPGRAMS service)
```bash
npm run dev
# App will open at http://localhost:5173
```

#### Option B: Standalone Express API Server
```bash
npm run server
# API server starts on http://localhost:3000
```

#### Option C: Full Production Build
```bash
npm run build
npm run preview
```

---

## Facility Directory Enrichment

SAMADHAN integrates the National Public Healthcare Facility Directory (`data/facility_directory.csv`, 200,440 records) as an **administrative jurisdiction and geographic resolution layer**:

* **Dataset Purpose & Role**:
  * **CPGRAMS Dataset**: Powers grievance/authority operational intelligence, disposal velocity, aging pendency analytics, operational risk scoring, and evidence-backed recommendations.
  * **Facility Directory**: Provides healthcare-specific facility names, facility classifications (PHC, CHC, District Hospital), operational status (Active/Physical), urban/rural settings, and subdistrict/district administrative context.
  * **Distinct Provenance**: The Facility Directory provides local geographic context; it does not measure or prove grievance performance.
* **Healthcare-Only Activation & No Fabrication**:
  * Triggered only when healthcare intent or terminology is detected (e.g. *hospital, doctor, clinic, PHC, CHC, dispensary, medicine stock*).
  * If the citizen provides specific geographic/facility names (*"PHC in Adoni Kurnool"*), the system resolves the matching administrative entity.
  * If healthcare intent is recognized without specific location names (*"PHC near my village has no medicines"*), the system provides non-intrusive guidance rather than fabricating a false facility match.
  * Non-healthcare grievances (Income Tax, Railways, EPFO, Banking, Electricity, etc.) execute standard authority routing with zero facility directory processing.
* **Server-Side In-Memory Caching (Zero Client Bundle Bloat)**:
  * The ~20.9 MB facility dataset is stored in `data/facility_directory.csv` and is **never placed in `public/` or shipped to the client browser**.
  * The dataset is parsed once on the server and cached in memory, avoiding repeated disk reads. Subsequent bounded searches operate against the in-memory representation.
* **Evidence & Provenance Distinction**:
  * The system's `EvidenceBadge` and audit transparency layers clearly demarcate `Facility Directory` records from verified `CPGRAMS` grievance metrics, maintaining strict data lineage.

---

## Testing & Verification

```bash
# Run all unit, service, intelligence, i18n, facility, and API integration tests (90 tests)
npm test

# Run API integration test suite specifically (35 tests)
npm run test:api

# Run the 11-point Real CPGRAMS Dataset Verification Suite
npm run verify
```

### Test Suite Summary
* `src/data/facilityDirectory.test.ts`: **14 / 14 passing**
* `src/i18n/i18n.test.ts`: **8 / 8 passing**
* `src/services/cpgramsService.test.ts`: **18 / 18 passing**
* `src/intelligence/intelligence.test.ts`: **16 / 16 passing**
* `src/api/app.test.ts`: **35 / 35 passing**
* **Total**: **91 / 91 passing tests** (100% pass rate).

---

## Multilingual Support & Hindi Localization

SAMADHAN provides genuine, full-application Hindi (`हिन्दी`) and English (`English`) bilingual localization powered by a decoupled `LanguageContext` architecture (`src/i18n/`):
* **Decoupled Fast Refresh Architecture**: The React context provider (`LanguageContext.tsx`) and the translation hook (`useTranslation.ts`) are modularized separately to maintain clean React Fast Refresh boundaries during Vite development without HMR invalidations.
* **Dynamic Real-Time Switching**: Toggling the language selector immediately updates all page content, cards, navigation items, metrics, timelines, modals, and scenario workflows without requiring a page reload.
* **Persistent Preference**: Language preference is safely stored in client `localStorage` and automatically restored on return visits.
* **Natural Civic Phrasing**: Utilizes authentic Indian administrative terms (e.g. *लोक शिकायत निवारण*, *समीक्षाधीन*, *निराकृत*, *अपीलीय निवारण*, *समय-आधारित वितरण*, *सुविधा निर्देशिका*) while maintaining official department titles for data precision.

---

## Security & Privacy

The following security controls are **actually implemented** within the current application codebase:
1. **Input Validation & Sanitization**:
   * Numeric query parameters (`minDisposalRate`, `maxDisposalRate`, thresholds) validate bounds [0, 100] and reject non-numeric characters with clean `400 INVALID_PARAMETER` errors.
   * Text routing inputs (`/api/intelligence/routing`) are capped at 2,000 characters to prevent regex search exhaustion.
   * Facility search queries (`q`) are restricted to a maximum of 200 characters.
   * Facility result limit is bounded between 1 and 50 records.
   * Sort fields and ordering parameters are validated against strict allowed enums.
2. **Facility Data Isolation**:
   * Stored in `data/facility_directory.csv` (outside `public/`), preventing the 20.9 MB dataset from being exposed as a static asset or copied into production client builds (`dist/`).
   * Searches operate via server-side in-memory substring matching (`includes`) with zero dynamic regex compilation on user input.
   * Prevents arbitrary filesystem access by validating parameters and rejecting path traversal.
3. **Standardized Error Handling**:
   * API responses use a structured `{ error: { code, message } }` contract.
   * Centralized error middleware traps internal exceptions and prevents raw stack traces, file system paths, or internal server errors from leaking to clients.
4. **HTTP Security Headers**:
   * `X-Content-Type-Options: nosniff` (prevents MIME type sniffing).
   * `X-Frame-Options: SAMEORIGIN` (mitigates clickjacking attacks).
   * `Referrer-Policy: strict-origin-when-cross-origin` (protects referrer metadata).
   * `X-XSS-Protection: 1; mode=block`.
   * Baseline Content Security Policy (`CSP`) configured for Google Fonts and Vite development assets.
5. **Data Isolation & Read-Only Protection**:
   * Strict separation of master datasets; analytical transformations operate in immutable memory partitions without modifying or risking underlying dataset files.
6. **No Secret or Token Leakage**:
   * No API keys, credentials, or secrets are embedded in source files. `.env` and log files are excluded by `.gitignore`.
7. **No Unsafe HTML Injection**:
   * React component tree renders text safely through JSX escaping; no `dangerouslySetInnerHTML` is used for user or query-controlled strings.
8. **Transparent Demonstration Boundary**:
   * Generated grievance references (`SAM-2026-XXXX`) are clearly designated as demo/simulation records and stored locally in browser state.

---

## Production Security Requirements

For an actual enterprise or live government deployment of SAMADHAN, the following additional capabilities would be required:
* **Citizen Identity Verification**: Integration with official DigiLocker / Aadhaar OTP authentication or Jan Parichay Single Sign-On.
* **Role-Based Access Control (RBAC)**: Fine-grained permissions separating public citizen access, nodal grievance officers, appellate authorities, and national ministry directors.
* **Direct Government API Authorization**: Mutual TLS (mTLS) and OAuth 2.0 / API gateway keys for transmitting grievances directly to DARPG CPGRAMS central servers.
* **Rate Limiting & DDoS Protection**: Cloudflare / API Gateway token bucket rate limiting to prevent spam submissions or brute force endpoint discovery.
* **Audit Logging & SIEM**: Immutable centralized audit logs capturing all administrative actions, data exports, and status transitions for legal compliance.
* **Static Application Security Testing (SAST) & Dynamic Scanning**: Automated dependency CVE scanning, container image scanning, and regular third-party penetration testing.
* **Data Retention & Privacy Policies**: Formal data residency and citizen PII retention policies conforming to the Digital Personal Data Protection Act (DPDP).

---

## Prototype & Demonstration Disclosures

1. **Routing Engine**: The grievance routing engine is a deterministic keyword-taxonomy heuristic mapping 16 civic domains to 278 real public authorities. It is not an opaque machine learning or LLM model.
2. **Grievance Submission**: Generated reference numbers (`SAM-2026-XXXX`) are persisted in local browser storage for workflow demonstration. They are not transmitted to the official live CPGRAMS production portal.
3. **Dataset Freshness**: Official aggregate metrics reflect DARPG verified reporting rows as captured in the repository dataset (`10_MASTER_verified_cpgrams_metrics_long.csv`).

---

## License

Licensing is currently unspecified. Developed for the *Build What Moves India* initiative.
