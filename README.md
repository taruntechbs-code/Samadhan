# SAMADHAN
## Public Grievance Intelligence & Routing Platform

> **"A citizen-centric grievance intelligence layer that helps people understand, prepare, and route their complaint to the right authority — while keeping final registration and submission on the official CPGRAMS portal."**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-samadhan--mquc.onrender.com-blue?style=flat-square&logo=render)](https://samadhan-mquc.onrender.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7%20Strict-3178C6?style=flat-square&logo=typescript)](package.json)
[![Tests](https://img.shields.io/badge/Tests-207%20Passed%20(12%20Files)-brightgreen?style=flat-square&logo=vitest)](package.json)
[![CPGRAMS Verification](https://img.shields.io/badge/CPGRAMS%20Telemetry-2%2C134%20Verified%20Rows-orange?style=flat-square)](src/data/verify.ts)
[![Nodal Officers](https://img.shields.io/badge/Nodal%20Officers-129%20Verified%20Directory-teal?style=flat-square)](src/data/cpgramsNodalOfficers.ts)

---

### Quick Links

* 🌐 **Live Application**: [https://samadhan-mquc.onrender.com](https://samadhan-mquc.onrender.com)
* 🔍 **API Health Check**: `https://samadhan-mquc.onrender.com/api/health`
* 📊 **Dataset Catalog & Provenance**: `https://samadhan-mquc.onrender.com/api/datasets`
* 📈 **10-Year Historical Trends**: `https://samadhan-mquc.onrender.com/api/historical/trends?limit=5`

> [!NOTE]
> **Prototype & Live Deployment Notice**: The demo web service is hosted on Render's free tier and may take 30–50 seconds to spin up after periods of inactivity.
>
> **Clear Product Boundary**: SAMADHAN is an independent civic-tech intelligence and grievance preparation layer. It is **not** an unauthorized substitute for the government grievance system. Grievances prepared in SAMADHAN are formatted for citizen review and copy, directing the user to the official [Centralised Public Grievance Redress and Monitoring System (CPGRAMS)](https://pgportal.gov.in) for formal registration and submission.

---

## Overview

Public grievance portals in India often present citizens with administrative complexity: selecting from hundreds of ministry hierarchies, deciphering departmental abbreviations, identifying jurisdictional boundaries, and struggling to find the competent nodal public grievance officer. As a result, citizens frequently submit complaints to the wrong department or abandon their submissions entirely.

On the operational side, administrators receive aggregate tables of receipts and pendencies without explainable causal risk scores, aging concentration alerts, or automated guidance on where operational interventions are needed most urgently.

**SAMADHAN** bridges this gap by acting as an assistive intelligence and preparation layer:
1. **Understands Natural-Language Complaints**: Interprets everyday descriptions in English, Hindi (`हिन्दी`), or spoken voice without requiring bureaucratic knowledge.
2. **Deterministic Authority Routing**: Maps complaints to the competent statutory authority across 278 real public authorities with calibrated certainty and alternative candidates.
3. **Clarification on Ambiguity (`NEEDS_INFORMATION`)**: Asks targeted follow-up questions (such as city/municipality for sanitation issues) instead of guessing.
4. **Verified CPGRAMS Nodal Officer Intelligence**: Matches the designated Nodal Public Grievance Officer across 129 official Central and State/UT records (92 Central, 37 State/UT).
5. **Submission Preparation**: Structures the complaint into a clean, submission-ready format for the citizen to review, copy, and continue to the official CPGRAMS portal.
6. **National Operational Telemetry**: Empowers public administrators with live disposal throughput (2.17M+ cases), 4-tier aging pendency distribution, deterministic 0–100 risk scoring, 10-year historical baselines, and secondary appeals audits.

---

## The Problem

```
CITIZEN-SIDE BURDEN
Citizens face 278+ ministry boundaries, departmental jargon, obscure nodal codes,
and confusing jurisdictional levels (Union vs. State vs. Urban Local Body).

                      ❌ Without SAMADHAN
Citizen with problem ───────► Guesses ministry ───────► Misfiles complaint ───────► Delay / Rejection

                      ✅ With SAMADHAN
Citizen describes issue ────► Intelligence Layer ────► Structured Complaint ────► Official CPGRAMS Submission
```

### Citizen-Side Challenges
* **Bureaucratic Opaque Hierarchies**: Distinguishing whether an issue belongs to *Department of Financial Services*, *CBDT*, *Ministry of Power*, or a local *Municipal Corporation (ULB)* is challenging for non-specialists.
* **Missing Essential Information**: When citizens write brief complaints (e.g. *"Garbage has not been collected in my area"*), standard systems fail silently or misroute because the local municipal jurisdiction was omitted.
* **Finding the Right Officer**: Locating the designated Nodal Public Grievance Officer with official contact details and designations is difficult.

### Operational-Side Challenges
* **Unstructured Misfiles**: Departments spend administrative bandwidth manually transferring misdirected complaints.
* **Static Aggregate Tables**: Operational dashboards often display raw counts without highlighting chronic aging, disposal velocity degradation, or root causes.
* **Lack of Historical Baselines**: Administrators cannot easily determine whether an authority's current disposal velocity is an emerging issue or consistent with its 10-year historical trend.

---

## What SAMADHAN Does

SAMADHAN establishes a clean, structured workflow connecting citizen intent to official government redressal:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        THE SAMADHAN JOURNEY                            │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
                     Citizen Describes Problem
        (Natural language text in English / Hindi, or spoken voice)
                                    │
                                    ▼
                       SAMADHAN Analyzes Intent
                (Detects service category & key context)
                                    │
                                    ▼
                  Missing Information Identified?
                 ┌──────────────────┴──────────────────┐
                 │ YES                                 │ NO
                 ▼                                     ▼
        Clarification Prompt                   Correct Authority
      (e.g., location, doc type)                   Identified
                 │                                     │
                 └──────────────────┬──────────────────┘
                                    │
                                    ▼
            Relevant CPGRAMS Nodal Officer Identified
        (Official name, designation, phone, email & source URL)
                                    │
                                    ▼
               Submission-Ready Grievance Prepared
                                    │
                                    ▼
                     Citizen Reviews & Copies Text
                                    │
                                    ▼
                   Continue to Official CPGRAMS →
                                    │
                                    ▼
       Official Government Registration & Final Redressal
                   (https://pgportal.gov.in)
```

---

## Why SAMADHAN?

| Capability | Traditional Grievance Experience | SAMADHAN Modern Platform |
|:---|:---|:---|
| **Authority Discovery** | Citizens must manually navigate ministry dropdowns & organizational codes. | Natural-language query auto-matches destination authority with transparent rationale. |
| **Missing Information** | Opaque failure or rejected submission when key parameters are absent. | `NEEDS_INFORMATION` modal actively prompts for missing details (e.g. city/municipality). |
| **Grievance Preparation** | Unstructured freeform text often missing critical context. | Formats complaint into a structured, submission-ready format for review and copy. |
| **Nodal Officer Discovery** | Hard-to-find statutory contact directories across government portals. | Deterministic resolver surfaces verified officer name, designation, phone, and email. |
| **Transparency & Rationale** | Black-box routing with no explanation. | Clear match reasons, alternative candidate authorities, and source dataset lineage. |
| **Operational Intelligence** | Static aggregate tables without automated prioritization. | Executive cockpit with 4-bucket aging pendency and secondary appeals audit telemetry. |
| **Risk Detection** | Retrospective manual reviews. | Deterministic 0–100 risk scoring explaining velocity drops and chronic backlogs. |
| **Historical Analysis** | Single-period static view. | Directional trajectory (`IMPROVING`, `STABLE`, `DETERIORATING`) vs. 10-year DARPG baselines. |
| **Data Provenance** | Unverified or disconnected reports. | Every figure is linked to verified DARPG / data.gov.in / pgportal source URLs. |

---

## Core Capabilities

### 1. Natural-Language Grievance Routing
* **Deterministic Keyword-Taxonomy Heuristic**: Operates across 17 civic domains (Banking, Income Tax, GST/Customs, Railways, Telecom, Posts, Labour/EPFO, External Affairs/Passport, Highways, Higher Education, Health, Ayush, Housing/Urban Affairs, Agriculture/PM-Kisan, Power, Petroleum/LPG, and Municipal Sanitation).
* **Multi-Script Matching**: Supports both English and Hindi (`हिन्दी`) vocabulary with word-boundary regex and Unicode substring matching.
* **Calibrated Confidence**: Computes certainty based on keyword density and rule specificity.
* **Alternative Candidates**: Surfaces related public authorities with individual confidence scores and contextual justifications.
* **Transparent Explainability**: Details why the authority was selected and which verified dataset records support the allocation.
* *Note: The routing engine is a deterministic, rule-driven taxonomy prototype, not a black-box machine learning model.*

### 2. Clarification Intelligence (`NEEDS_INFORMATION`)
* **Proactive Context Detection**: When a query is underspecified, SAMADHAN avoids guessing a false authority and instead triggers an interactive clarification modal.
* **Location Resolution for Municipal Grievances**: Grievances like *"Garbage has not been collected in my area"* are flagged for missing location. Once the citizen provides *"Kurnool, Andhra Pradesh"*, the platform routes to the competent Urban Local Body (ULB) under the 74th Constitutional Amendment.
* **Service Domain Disambiguation**: Queries mentioning generic document issues or portal downtime prompt the user to choose between Income Tax PAN, EPFO, Passport, or Health portals.

### 3. Verified CPGRAMS Nodal Officer Intelligence
* **Official Statutory Directory**: Integrates 129 verified Nodal Public Grievance Officer records (92 Central Ministries/Departments and 37 States/UTs).
* **Deterministic Matching & Aliases**: Resolves department acronyms (e.g. *CBDT*, *MeitY*, *EPFO*, *Railway Board*) and standardizes organizational names.
* **State/UT Escalation for Municipal Cases**: Local municipal grievances automatically resolve to the respective State/UT Nodal Escalation Officer (e.g. Kurnool &rarr; Andhra Pradesh Nodal Cell; PCMC &rarr; Maharashtra Nodal Cell).
* **Verified Contact Data**: Displays officer name, designation, office address, phone number, and normalized official email.
* **Zero-Fabrication Fallback**: If an authority has no verified directory match, SAMADHAN provides a transparent unavailable state rather than generating artificial details.

### 4. Structured Submission Preparation & Citizen Guidance
* **Assisted Complaint Composer**: Prepares structured grievance statements ready for review.
* **Bilingual Speech-to-Text**: Real-time microphone dictation in English (`en-IN`) and Hindi (`hi-IN`) using the browser SpeechRecognition API.
* **Document Evidence & Passage Retrieval**: In-memory document parsing (PDF, DOCX, TXT, CSV, Images up to 5 files) extracting reference numbers, dates, and domain keywords to corroborate grievance text.
* **Copy & Official Portal Continuation**: Enables citizens to copy their structured grievance and proceeds with "Continue to Official CPGRAMS &rarr;" to submit on the official portal.

### 5. National Operational Telemetry & Risk Cockpit
* **Executive Macro KPIs**: Monitors 2.17M+ grievances, 1.90M+ disposals (87.36% overall velocity), and active backlog across 127 live reporting authorities.
* **4-Bucket Aging Distribution**: Segregates pendency into `0–60 days`, `60–180 days`, `180–365 days`, and `> 1 year`.
* **Deterministic Risk Engine (0–100)**: Evaluates disposal velocity drops, chronic 1-year pendency, 180–365 day aging volume, backlog strain, and longitudinal degradation.
* **Actionable Recommendations**: Rule-driven interventions categorized by urgency (`URGENT`, `HIGH`, `ROUTINE`).
* **Secondary Appeals Intelligence**: Audits 2.30L+ secondary appeals across 88 central ministries with a 93.02% appellate disposal velocity.
* **10-Year Longitudinal Baselines**: Compares current 2026 performance against historical baselines (2016–2026) to detect directional trajectory (`IMPROVING`, `STABLE`, `DETERIORATING`).

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CITIZEN CLIENT                                 │
│  Assisted Composer • Voice Input (Speech API) • Clarification Modal         │
│  Prepared Grievance Review • Nodal Officer Card • Official Portal Link      │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
┌──────────────────────────────────────▼──────────────────────────────────────┐
│                            REACT 19 / VITE 6 UI                             │
│     National Civic Design System • Hindi/English i18n Context               │
│     Executive Cockpit • Aging Distribution • Authority Leaderboard          │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
┌──────────────────────────────────────▼──────────────────────────────────────┐
│                            API CLIENT / BRIDGE                              │
│       Typed Client Bridge • Resilient Fallback • Query Bounds Checking      │
└──────────────────────┬───────────────────────────────┬──────────────────────┘
                       │ (HTTP)                        │ (Direct ESM)
┌──────────────────────▼───────┐                       │
│        EXPRESS 5 API         │                       │
│   Standardized JSON Envelope │                       │
└──────────────────────┬───────┘                       │
                       │                               │
┌──────────────────────▼───────────────────────────────▼──────────────────────┐
│                          INTELLIGENCE SERVICE LAYER                         │
│  CpgramsService • System Overview • Department Profiles • Historical Deltas │
└──────────────────────┬───────────────────────────────┬──────────────────────┘
                       │                               │
┌──────────────────────▼───────┐               ┌───────▼──────────────────────┐
│     INTELLIGENCE ENGINES     │               │      DATA ENGINE LAYER       │
│  • Routing Engine            │               │  • CSV Parser (RFC 4180)     │
│  • Nodal Officer Resolver    │               │  • Transformer & Analytics   │
│  • Risk Engine (0-100)       │               │  • Entity Normalizer         │
│  • Recommendation Engine     │               │  • Dataset Registry          │
│  • Document Intelligence/RAG │               │  • Facility Directory Cache  │
└──────────────────────┬───────┘               └───────┬──────────────────────┘
                       │                               │
┌──────────────────────▼───────────────────────────────▼──────────────────────┐
│                         VERIFIED DATASET LAYER                              │
│  • Master CPGRAMS Metrics (2,134 Rows / 278 Public Entities)                │
│  • CPGRAMS Nodal Officer Directory (129 Verified Records)                   │
│  • National Healthcare Facility Directory (200,440 Records)                 │
│  • PCMC Municipal Case Study (Segregated)                                   │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Intelligence Architecture

### 1. Grievance Routing Engine (`src/intelligence/routingEngine.ts`)
* **Function**: Evaluates citizen text and attached document keywords to recommend the statutory authority.
* **Inputs**: Grievance text string (&le; 2,000 characters), optional extracted document context.
* **Outputs**: `RoutingRecommendation` object including `outcomeKind` (`ROUTED` vs. `NEEDS_INFORMATION`), `detectedCategory`, `recommendedEntity`, `confidence` (0.0 to 1.0), `jurisdictionLevel`, `explanations`, `alternativeCandidates`, and `nodalOfficer`.
* **Methodology**: Deterministic keyword and phrase matching with regex word boundaries and Unicode support.

### 2. Nodal Officer Resolver (`src/data/cpgramsNodalOfficers.ts`)
* **Function**: Deterministically resolves the official CPGRAMS Nodal Public Grievance Officer for any given public authority or state.
* **Resolution Steps**:
  1. Exact match in Central directory.
  2. Normalized case-insensitive matching.
  3. Known alias lookup (e.g. *CBDT*, *MeitY*, *EPFO*, *Railway Board*, *Power*).
  4. State/UT escalation matching for local municipal entities (e.g. *Kurnool* &rarr; *Andhra Pradesh*; *PCMC* &rarr; *Maharashtra*).
  5. Fallback state with clear unavailable status (no fabrication).

### 3. Deterministic Operational Risk Engine (`src/intelligence/riskEngine.ts`)
* **Function**: Assigns an operational risk score (0–100) and risk tier (`CRITICAL`, `HIGH`, `MEDIUM`, `LOW`) to public authorities.
* **Scoring Rules**:
  * **Disposal Rate**: `< 50%` (+45 pts), `50%–70%` (+35 pts), `70%–80%` (+25 pts), `80%–90%` (+15 pts).
  * **Chronic Pendency (> 1 Year)**: `> 10 cases` (+35 pts), `1–10 cases` (+25 pts).
  * **Approaching 1-Year (180–365 Days)**: `> 100 cases` (+20 pts), `20–100 cases` (+10 pts).
  * **Volume Strain**: `Total pending > 5,000` with `disposal < 85%` (+10 pts).
  * **Historical Deterioration**: Trailing 10-year baseline by &ge; 5 pp (+10 to +15 pts).

### 4. Recommendation Engine (`src/intelligence/recommendationEngine.ts`)
* **Function**: Produces actionable, trigger-based operational recommendations for department leadership.
* **Output Priorities**:
  * `URGENT`: Workflow bottleneck review for disposal rates trailing 70% or active 1-year pendency.
  * `HIGH`: Aging queue clearance for cases in the 180–365 day window.
  * `ROUTINE`: Workflow documentation and maintenance for high-performing authorities (&ge; 90% disposal rate).

### 5. Document Intelligence & In-Memory RAG (`src/intelligence/documentIntelligence.ts`, `documentRag.ts`)
* **Function**: Parses client-uploaded document text and attachments without sending files to external third-party AI APIs.
* **Capabilities**: Regex-based extraction of reference numbers, dates, and domain keywords; sliding-window chunking; TF-IDF passage retrieval; convergence verification across multiple documents.

### 6. Longitudinal Historical Intelligence (`src/data/cpgramsHistorical.ts`)
* **Function**: Evaluates 10-year historical performance baselines (2016–2026) across receipts, disposals, and resolution turnaround days.
* **Classification**: `IMPROVING` (&ge; +2.5 pp delta), `STABLE` (&plusmn;2.5 pp variance), `DETERIORATING` (&le; -5.0 pp delta), or `INSUFFICIENT_HISTORY`.

---

## Data & Provenance

SAMADHAN enforces strict data provenance and isolation across all datasets through a central registry (`src/data/datasetRegistry.ts`):

| Dataset Name | Publisher / Source | Period | Classification | Records / Rows | Usage in Platform |
|:---|:---|:---|:---|:---|:---|
| **CPGRAMS Central Live Dashboard** | DARPG / [pgportal.gov.in](https://pgportal.gov.in/darpgdashboard) | Jan 1 – Aug 24, 2026 | `CPGRAMS_CURRENT` | 889 metric rows (127 entities) | Real-time Executive KPIs, 4-tier aging pendency, live risk scoring. |
| **CPGRAMS Appellate Telemetry** | DARPG / [pgportal.gov.in](https://pgportal.gov.in/darpgdashboard) | Snapshot Aug 25, 2026 | `CPGRAMS_CURRENT` | 352 metric rows (88 ministries) | Secondary appeals volume, disposal velocity, and appellate audits. |
| **Department 10-Year History** | DARPG / [data.gov.in](https://www.data.gov.in) | Jan 2016 – Feb 2026 | `CPGRAMS_HISTORICAL` | 178 metric rows | 10-year longitudinal baselines, historical turnaround, trend variance. |
| **Monthly Central Progress** | DARPG / [data.gov.in](https://www.data.gov.in) | Jan – Jun 2026 | `CPGRAMS_HISTORICAL` | 468 metric rows | Monthly central snapshots, CSC intake, citizen feedback ratings. |
| **CPGRAMS Nodal Officer Directory** | DARPG / [pgportal.gov.in](https://pgportal.gov.in/Home/NodalPgOfficers) | Verified Aug 26, 2026 | `OFFICER_DIRECTORY` | 129 verified records (92 Central, 37 State/UT) | Contact directory resolution for Central Ministries and State Nodal Cells. |
| **National Healthcare Facility Directory** | NHA / MoHFW / [facility.ndhm.gov.in](https://facility.ndhm.gov.in) | 2025–2026 | `FACILITY_DIRECTORY` | 200,440 records | Geographic jurisdiction and facility classification (PHC/CHC/Hospital). |
| **PCMC Municipal Case Study** | PCMC / [data.gov.in](https://www.data.gov.in) | 2025 | `MUNICIPAL_CASE_STUDY` | Isolated case study | Demonstrates ULB municipal-level scalability; segregated from CPGRAMS. |

---

## CPGRAMS Nodal Officer Intelligence

```
                     Official CPGRAMS Directories
 ┌──────────────────────────────────────┬──────────────────────────────────────┐
 │ Central Ministries & Departments     │ States & Union Territories           │
 │ (92 Verified Records)                │ (37 Verified Records)                │
 │ https://pgportal.gov.in/Home/        │ https://pgportal.gov.in/Home/        │
 │ NodalPgOfficers                      │ NodalPgOfficersState                 │
 └──────────────────┬───────────────────┴──────────────────┬───────────────────┘
                    │                                      │
                    └──────────────────┬───────────────────┘
                                       │
                                       ▼
                       Normalized In-Memory Registry
                (Zero duplicates, normalized emails & phones)
                                       │
                                       ▼
                     Deterministic Authority Matching
      ┌────────────────────────────────┼────────────────────────────────┐
      │ Exact / Normalized             │ Known Aliases                  │ State / Municipal Escalation
      │ Match                          │ (CBDT, MeitY, EPFO, etc.)      │ (Kurnool -> AP, PCMC -> MH)
      └────────────────────────────────┴────────────────────────────────┘
                                       │
                                       ▼
                         Nodal Officer Contact Card
                  • Officer Name & Designation
                  • Office Address, Phone & Official Email
                  • Official Directory Source Link
                  • Graceful Unavailable Fallback (No Hallucination)
```

---

## Working Demonstration Scenarios

Evaluators can test these verified flows directly in the application:

### Scenario 1 — ATM Cash Withdrawal Failure
* **Citizen Input**: `"Cash debited from ATM but bank machine failed to dispense money"`
* **SAMADHAN Routing**: `Financial Services (Banking Division)` (Certainty: 95%)
* **Resolved Nodal Officer**: `SHRI SWAPNIL AGRAWAL`, Director, Department of Financial Services
* **Verified Contact**: `01123346785` | `dir.sa-dfs@gov.in` | 3rd Floor, Jeevan Deep Building, Sansad Marg, New Delhi
* **Next Action**: Prepared grievance ready for review, copy, and continuation to official CPGRAMS portal.

### Scenario 2 — Delayed Income Tax Refund
* **Citizen Input**: `"My income tax refund has not been credited to my bank account for six months despite e-filing."`
* **SAMADHAN Routing**: `Central Board of Direct Taxes (Income Tax)` (Certainty: 91%)
* **Resolved Nodal Officer**: `Swapna Devireddy`, Addl. Director of Income Tax TPS-II, CBDT
* **Verified Contact**: `01123416133` | `delhi.addldit.eservices@incometax.gov.in` | Mayur Bhawan, Connaught Circus, New Delhi

### Scenario 3 — EPFO Pension & PF Balance Transfer
* **Citizen Input**: `"My PF balance transfer request from previous employer was rejected without reason."`
* **SAMADHAN Routing**: `Labour and Employment` (Certainty: 95%)
* **Resolved Nodal Officer**: `Shri G. Sajith Kumar`, Deputy Secretary and Nodal PGO
* **Verified Contact**: `01123719054` | `sajith.edu@nic.in` | Shram Shakti Bhavan, Rafi Marg, New Delhi

### Scenario 4 — Local Municipal Sanitation with Location
* **Citizen Input**: `"Garbage has not been collected for 7 days in Kurnool, Andhra Pradesh."`
* **SAMADHAN Routing**: `Local Municipal Authority (Kurnool, Andhra Pradesh)` (Jurisdiction: `LOCAL_MUNICIPAL`)
* **State Nodal Escalation Officer**: `Chinna Rao`, CGO-CMO, Andhra Pradesh State Nodal Cell
* **Verified Contact**: `09154267973` | `pgrs-helpdesk@ap.gov.in`

### Scenario 5 — Ambiguous Municipal Grievance (`NEEDS_INFORMATION`)
* **Citizen Input**: `"Garbage has not been collected in my area."`
* **SAMADHAN Behavior**: Identifies municipal sanitation domain but recognizes missing city/municipality context.
* **Clarification Modal**: Prompts the user: *"Which city or municipality is this in?"* with quick-select options (*Kurnool*, *Pimpri Chinchwad*, *Jaipur*, *Bengaluru*, etc.).
* **Result Upon Clarification**: Submitting *"Kurnool"* immediately resolves the complaint to the competent local authority and Andhra Pradesh State Nodal Cell.

### Scenario 6 — Healthcare Facility with Geographic Context
* **Citizen Input**: `"The PHC in Adoni Kurnool has no medicines and doctor is absent."`
* **SAMADHAN Routing**: `Health & Family Welfare`
* **Facility Resolution**: Searches 200,440-record facility directory and resolves geographic context to `PHC Adoni Rural (Kurnool, Andhra Pradesh)` with active operational status and rural classification.

---

## API Specification

All backend endpoints return standardized JSON envelopes with structured HTTP status codes.

### Endpoints Overview

| Method | Endpoint | Description |
|:---|:---|:---|
| `GET` | `/api/health` | Service health status, version (`0.6.0`), loaded row count, entity count, and engine status |
| `GET` | `/api/meta` | System metadata, dataset registry summary, metric definitions, and methodology |
| `GET` | `/api/datasets` | Master catalog of all 6 registered datasets with publisher, period, and record counts |
| `GET` | `/api/overview` | Aggregated system overview with optional scope filters (`ALL`, `Department`, `State/UT`) |
| `GET` | `/api/departments` | Filterable summary list of all 278 public authorities with disposal rates |
| `GET` | `/api/departments/ranking` | Authority leaderboard sorted by volume, disposal rate, or pendency |
| `GET` | `/api/departments/:entity` | Detailed performance profile for a specific authority |
| `GET` | `/api/attention` | Operational triage list of flagged authorities with configurable thresholds |
| `GET` | `/api/aging` | 4-bucket aging distribution breakdown (system-wide or entity-specific) |
| `GET` | `/api/trends` | Longitudinal series partitioned by dataset (monthly central, 10-year history) |
| `GET` | `/api/appeals` | CPGRAMS secondary appeals audit telemetry across 88 central ministries |
| `GET` | `/api/entities` | Master catalog of 278 reporting entities with scope tags |
| `GET` | `/api/periods` | Catalog of reporting periods across loaded datasets |
| `GET` | `/api/metrics` | Catalog of 31 distinct CPGRAMS metrics |
| `GET` | `/api/metrics/:metric` | Raw metric rows with optional entity and period filters |
| `GET` | `/api/intelligence/overview` | Executive analytical findings and aging concentration summaries |
| `GET` | `/api/intelligence/attention` | Action cockpit with 0–100 risk scores, causal factors, and recommendations |
| `GET` | `/api/intelligence/routing?text=...` | Grievance routing with category detection, confidence, and nodal officer |
| `GET` | `/api/intelligence/trends/:entity` | Directional performance trajectory (`IMPROVING`, `DECLINING`, `STABLE`) |
| `POST` | `/api/evidence/analyze` | Multi-document evidence analysis (up to 5 documents) and joint routing |
| `POST` | `/api/evidence/retrieve` | TF-IDF passage retrieval for attached document chunks |
| `GET` | `/api/historical/overview` | 10-year historical system overview and macro metrics |
| `GET` | `/api/historical/trends` | Filterable list of all authorities compared against 10-year baselines |
| `GET` | `/api/historical/departments/:entity` | Detailed 10-year historical comparison profile for a single authority |
| `GET` | `/api/historical/compare/:entity` | Current vs. historical delta variance and trajectory breakdown |
| `GET` | `/api/facilities/search?q=...` | Search public healthcare facilities by name, district, or state |
| `GET` | `/api/facilities/:id` | Lookup individual healthcare facility by ID or National Identification Number |
| `GET` | `/api/municipal/pcmc` | Segregated municipal case study dataset for Pimpri Chinchwad (2025) |

---

## Responsible AI & Transparency

1. **Deterministic Heuristic Routing**: The grievance routing engine uses an explainable keyword taxonomy mapping citizen problem vocabulary to 278 real public authorities. It is not an opaque machine learning or LLM model.
2. **Zero Officer Hallucination**: Nodal Officer contact details are derived strictly from official DARPG CPGRAMS published directories. When no directory record exists for an authority, the platform displays a transparent unavailable notice.
3. **Clarification Over Guessing**: When essential context (such as city or document type) is omitted, SAMADHAN triggers a `NEEDS_INFORMATION` clarification state rather than assigning an incorrect authority.
4. **Data Lineage**: Every operational metric, disposal percentage, aging figure, and appeals metric is traceable to official DARPG and data.gov.in source datasets.
5. **No Administrative Adjudication**: SAMADHAN assists in intake and preparation; it does not make binding legal or administrative decisions.

---

## Government Integration Boundary

```
CURRENT DEMO PROTOTYPE                          FUTURE PRODUCTION REQUIREMENTS
┌────────────────────────────────────────┐     ┌────────────────────────────────────────┐
│ • Deterministic grievance preparation  │     │ • DigiLocker / Aadhaar OTP / Jan       │
│ • Structured complaint review & copy   │     │   Parichay Single Sign-On (SSO)        │
│ • No new local tracking references     │ ──► │ • Authorized CPGRAMS REST API Gateway  │
│ • "Continue to Official CPGRAMS →"     │     │   with mTLS and signed payloads        │
│ • No unauthorized API transmission     │     │ • Role-Based Access Control (RBAC)     │
│ • Official portal remains destination  │     │ • Centralized immutable SIEM audit logs│
│   for registration & submission        │     │ • DPDP Act data retention compliance   │
└────────────────────────────────────────┘     └────────────────────────────────────────┘
```

---

## Technology Stack

| Layer | Technologies Used | Purpose |
|:---|:---|:---|
| **Frontend Framework** | React 19 (`react`, `react-dom`) | Modern component architecture, concurrent rendering |
| **Routing** | React Router DOM v7 (`react-router-dom`) | Client-side routing and deep linking |
| **Build Tool** | Vite 6 (`vite`, `@vitejs/plugin-react`) | Development server and production bundling |
| **Language** | TypeScript 5.7 (`typescript`) | Strict end-to-end static typing |
| **Styling** | Vanilla CSS (`src/styles/index.css`) | National Civic Design System, design tokens |
| **Icons** | Lucide React (`lucide-react`) | Accessible SVG iconography |
| **Backend Framework** | Express 5 (`express`, `@types/express`) | REST API service and route handlers |
| **CORS** | CORS (`cors`, `@types/cors`) | Cross-origin resource sharing middleware |
| **Runtime Execution** | TSX (`tsx`), Node.js (v18+) | TypeScript runtime execution for API server |
| **Testing Framework** | Vitest 4 (`vitest`) | Unit and integration test runner |
| **API Testing** | Supertest 7 (`supertest`, `@types/supertest`) | HTTP endpoint integration testing |

---

## Project Structure

```
Samadhan/
├── 10_MASTER_verified_cpgrams_metrics_long.csv   # Verified CPGRAMS master dataset (2,134 rows)
├── package.json                                   # Dependencies and build scripts
├── tsconfig.json                                  # Base TypeScript project reference config
├── tsconfig.app.json                              # Frontend client TypeScript configuration
├── tsconfig.node.json                             # Backend/Node TypeScript configuration
├── tsconfig.test.json                             # Test suite TypeScript configuration
├── vite.config.ts                                 # Vite 6 bundler configuration
├── index.html                                     # Web application entry HTML
├── data/
│   └── facility_directory.csv                     # National Healthcare Facility Directory (200,440 rows)
├── src/
│   ├── main.tsx                                   # React application root mount
│   ├── App.tsx                                    # Main application layout and routes
│   ├── api/                                       # Backend Express API Layer
│   │   ├── app.ts                                 # Express application setup & middleware
│   │   ├── routes.ts                              # Standardized REST endpoint handlers
│   │   ├── server.ts                              # Standalone server entry point (port 3000)
│   │   ├── serviceInit.ts                         # Singleton service initialization
│   │   └── app.test.ts                            # Supertest API endpoint test suite (44 tests)
│   ├── components/                                # Reusable UI Components
│   │   ├── citizen/                               # Citizen Experience Components
│   │   │   ├── ClarificationModal.tsx             # Missing info & location clarification dialog
│   │   │   ├── EvidenceViewerModal.tsx            # Attached document evidence inspector
│   │   │   ├── FacilityContextCard.tsx            # Geographic healthcare resolution card
│   │   │   ├── GrievanceInputHero.tsx             # Primary assisted intake composer & mic
│   │   │   ├── GrievancePreparationModal.tsx      # Grievance preparation & review dialog
│   │   │   ├── GrievanceTimeline.tsx              # 30-day milestone progress timeline
│   │   │   ├── NodalOfficerCard.tsx               # Verified CPGRAMS Nodal Officer card
│   │   │   └── SamadhanJourney.tsx                # Process architecture explanation
│   │   ├── common/                                # Core Design Primitives
│   │   │   ├── AtmosphericBg.tsx                  # Subtle civic background styling
│   │   │   ├── Badge.tsx                          # Status and category badges
│   │   │   ├── Button.tsx                         # Accessible button primitives
│   │   │   ├── Card.tsx                           # Tonal surface container
│   │   │   ├── Charts.tsx                         # SVG/CSS data visualizations
│   │   │   ├── EvidenceBadge.tsx                  # Data lineage and source audit trigger
│   │   │   ├── LoadingState.tsx                   # Loading spinner component
│   │   │   ├── MetricCard.tsx                     # Formatted KPI metric display card
│   │   │   └── TransparencyModal.tsx              # Trust, methodology, and dataset disclosures
│   │   ├── government/                            # Operational Intelligence Cockpit
│   │   │   ├── AgingDistributionCard.tsx          # 4-tier aging pendency distribution
│   │   │   ├── AppealsIntelligenceCard.tsx        # CPGRAMS secondary appeals audit card
│   │   │   ├── AttentionActionCockpit.tsx         # Prioritized triage list with 0-100 risk
│   │   │   ├── DepartmentDetailModal.tsx          # Single-authority audit drilldown
│   │   │   ├── DepartmentLeaderboard.tsx          # Sortable/searchable authority leaderboard
│   │   │   ├── ExecutiveKpis.tsx                  # Top macro KPIs (Received, Disposed, Backlog)
│   │   │   ├── HistoricalIntelligenceCard.tsx     # 10-year trend comparison card
│   │   │   └── SystemInsightsCard.tsx             # AI/Rule synthesized executive findings
│   │   └── layout/                                # Page Layout Structure
│   │       ├── Footer.tsx                         # Institutional footer with provenance
│   │       ├── Layout.tsx                         # Shared page layout wrapper
│   │       └── Navbar.tsx                         # Header with navigation & language toggle
│   ├── data/                                      # Data Layer & Registries
│   │   ├── analytics.ts                           # Aggregations, rankings & attention triage
│   │   ├── cpgramsHistorical.ts                   # 10-year longitudinal baselines & variance
│   │   ├── cpgramsHistorical.test.ts              # Historical intelligence test suite
│   │   ├── cpgramsNodalOfficers.ts                # Verified Nodal Officer directory (129 records)
│   │   ├── cpgramsNodalOfficers.test.ts           # Nodal Officer resolver test suite
│   │   ├── csvLoader.ts                           # RFC 4180 CSV parser
│   │   ├── datasetRegistry.ts                     # Central dataset metadata registry
│   │   ├── entityNormalizer.ts                    # Name standardization & alias mapping
│   │   ├── entityNormalizer.test.ts               # Entity normalizer test suite
│   │   ├── facilityDirectory.ts                   # In-memory healthcare facility search
│   │   ├── facilityDirectory.test.ts              # Facility directory test suite
│   │   ├── index.ts                               # Data layer module exports
│   │   ├── municipal/                             # Segregated Municipal Case Studies
│   │   │   ├── pcmc.ts                            # Pimpri Chinchwad municipal data (2025)
│   │   │   └── pcmc.test.ts                       # Municipal test suite
│   │   ├── transformer.ts                         # Metric pivot & disposal rate calculators
│   │   ├── types.ts                               # Strongly typed data models
│   │   └── verify.ts                              # 12-point CPGRAMS verification script
│   ├── i18n/                                      # Bilingual Localization (English & Hindi)
│   │   ├── en.ts                                  # English translation dictionary
│   │   ├── hi.ts                                  # Hindi (`हिन्दी`) translation dictionary
│   │   ├── i18n.test.ts                           # Localization test suite
│   │   ├── index.ts                               # i18n exports
│   │   ├── LanguageContext.tsx                    # Decoupled React Language Provider
│   │   ├── types.ts                               # Translation key interfaces
│   │   └── useTranslation.ts                      # Fast Refresh safe translation hook
│   ├── intelligence/                              # Intelligence Engines
│   │   ├── documentIntelligence.ts                # Multi-document extraction & convergence
│   │   ├── documentIntelligence.test.ts           # Document intelligence test suite
│   │   ├── documentParser.ts                      # In-memory document text & entity parser
│   │   ├── documentRag.ts                         # TF-IDF chunking & passage retrieval
│   │   ├── frontendQa.test.ts                     # Comprehensive frontend QA test suite
│   │   ├── index.ts                               # Intelligence exports
│   │   ├── insightEngine.ts                       # Executive summary generator
│   │   ├── intelligence.test.ts                   # Core intelligence unit test suite
│   │   ├── recommendationEngine.ts                # Rule-driven operational recommendations
│   │   ├── riskEngine.ts                          # Deterministic 0-100 risk scorer
│   │   ├── routingEngine.ts                       # Keyword taxonomy & clarification routing
│   │   ├── scenarioTests.test.ts                  # End-to-end scenario verification
│   │   └── types.ts                               # Intelligence contracts and evidence types
│   ├── pages/                                     # Top-Level Application Pages
│   │   ├── GovernmentPage.tsx                     # Operations & Intelligence Cockpit
│   │   ├── GrievancesPage.tsx                     # Citizen Local Grievances History
│   │   ├── HomePage.tsx                           # Assisted Grievance Intake & Pulse
│   │   └── TrackPage.tsx                          # Official CPGRAMS handoff & legacy demo lookup
│   ├── services/                                  # Service & Client Layer
│   │   ├── apiClient.ts                           # Frontend API bridge with fallback
│   │   ├── cpgramsService.ts                      # Core CPGRAMS data service
│   │   ├── cpgramsService.test.ts                 # Service layer test suite
│   │   ├── index.ts                               # Service layer exports
│   │   ├── speechService.ts                       # Browser Web Speech API provider
│   │   └── types.ts                               # Service query interfaces
│   └── styles/
│       └── index.css                              # Design system tokens and styling
```

---

## Getting Started

### Prerequisites
* **Node.js**: Version &ge; 18.0.0 (Node 20+ recommended)
* **npm**: Version &ge; 9.0.0

### Installation

```bash
# Clone the repository
git clone https://github.com/taruntechbs-code/Samadhan.git
cd Samadhan

# Install dependencies
npm install
```

### Running Locally

#### 1. Full Development Mode (Frontend + In-Browser CPGRAMS Service)
```bash
npm run dev
# Opens at http://localhost:5173
```

#### 2. Standalone Express API Server
```bash
npm run server
# Starts API server on http://localhost:3000
```

#### 3. Production Build & Preview
```bash
npm run build
npm run preview
```

---

## Testing & Verification

The repository maintains an automated test suite across unit, intelligence, data normalization, localization, and API layers:

```bash
# 1. Typecheck (0 TypeScript errors across App, Node, and Test projects)
npm run typecheck

# 2. Run all unit and integration tests (207 passed across 12 files)
npm test

# 3. Run API endpoint integration tests specifically (44 passed)
npm run test:api

# 4. Run the 12-point Real CPGRAMS Dataset Verification Suite
npm run verify

# 5. Build production distribution bundle
npm run build
```

### Verified Test Suite Breakdown (207 / 207 Tests Passing)

* `src/data/entityNormalizer.test.ts`: **5 / 5 passed** (Entity name standardization & alias mapping)
* `src/data/municipal/pcmc.test.ts`: **3 / 3 passed** (Isolated municipal dataset validation)
* `src/data/facilityDirectory.test.ts`: **14 / 14 passed** (Healthcare facility in-memory search)
* `src/intelligence/documentIntelligence.test.ts`: **23 / 23 passed** (Document parsing & RAG retrieval)
* `src/data/cpgramsNodalOfficers.test.ts`: **16 / 16 passed** (Nodal officer resolver & directory integrity)
* `src/services/cpgramsService.test.ts`: **18 / 18 passed** (Data queries, pivots & rankings)
* `src/i18n/i18n.test.ts`: **9 / 9 passed** (Bilingual Hindi/English localization)
* `src/intelligence/frontendQa.test.ts`: **39 / 39 passed** (UI interaction contracts & flows)
* `src/intelligence/intelligence.test.ts`: **22 / 22 passed** (Risk & recommendation engines)
* `src/data/cpgramsHistorical.test.ts`: **4 / 4 passed** (10-year longitudinal baselines)
* `src/intelligence/scenarioTests.test.ts`: **10 / 10 passed** (End-to-end benchmark scenarios)
* `src/api/app.test.ts`: **44 / 44 passed** (Express REST endpoint integration)

---

## Security & Privacy

### Implemented Security Controls
* **Strict Input Bounds Checking**: Query parameters (`minDisposalRate`, `maxDisposalRate`, thresholds) validate ranges [0, 100] and return structured `400 INVALID_PARAMETER` errors.
* **Input Length Constraints**: Grievance text input is capped at 2,000 characters to prevent regex search exhaustion. Facility search strings are bounded at 200 characters.
* **Large Dataset Isolation**: The 20.9 MB facility dataset (`data/facility_directory.csv`) is cached in server memory and is never placed in `public/` or bundled into client production builds.
* **Safe Rendering (XSS Mitigation)**: React component tree renders text safely through JSX escaping; no `dangerouslySetInnerHTML` is used for user-controlled strings.
* **Standardized Error Handling**: API responses use a structured `{ error: { code, message } }` envelope. Internal error details or stack traces are never exposed to clients.
* **HTTP Security Headers**: Configured with `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, and `Referrer-Policy: strict-origin-when-cross-origin`.
* **Zero Secret Leakage**: No API keys, credentials, or secrets are embedded in source code. `.env` files are excluded by `.gitignore`.

### Production Security Requirements (Future Live Deployment)
For live government infrastructure deployment, the following additional capabilities are planned:
* **Citizen Identity Verification**: Aadhaar OTP / DigiLocker or Jan Parichay Single Sign-On (SSO).
* **Role-Based Access Control (RBAC)**: Distinct permissions for Citizens, Nodal Officers, Appellate Authorities, and System Administrators.
* **Mutual TLS (mTLS) & API Gateway**: Secure government network connectivity for direct submission transmission to DARPG central servers.
* **Centralized SIEM Audit Logging**: Immutable audit logs capturing administrative actions, status transitions, and data access.
* **Data Residency & DPDP Compliance**: Formal data retention policies adhering to the Digital Personal Data Protection Act.

---

## Roadmap

### Current Implementation
- [x] Natural-language grievance intake in English and Hindi (`हिन्दी`)
- [x] Spoken voice input using the browser SpeechRecognition API
- [x] Deterministic keyword-taxonomy routing across 17 civic categories
- [x] Interactive `NEEDS_INFORMATION` clarification flow for underspecified complaints
- [x] Verified CPGRAMS Nodal Public Grievance Officer directory (129 records: 92 Central, 37 State/UT)
- [x] Nodal Officer matching with aliases and State/UT escalation for municipal cases
- [x] Submission-ready grievance structuring, review, copy, and continuation link
- [x] In-memory document evidence parsing and passage retrieval (RAG)
- [x] Operational intelligence cockpit with 4-bucket aging pendency and disposal velocity
- [x] Deterministic 0–100 operational risk scoring and rule-driven recommendations
- [x] Secondary appeals audit telemetry across 88 central ministries
- [x] 10-year longitudinal baselines (2016–2026) and directional trajectory tracking
- [x] 200,440-record healthcare facility directory for geographic jurisdiction resolution
- [x] Isolated municipal case study adapter (PCMC 2025)
- [x] 207 automated tests with 100% pass rate

### Future Enhancements
- [ ] Authorized direct CPGRAMS API integration for automated submission upon citizen consent
- [ ] Citizen identity verification via DigiLocker / Aadhaar OTP / Jan Parichay
- [ ] Additional Indian language support (Tamil, Telugu, Bengali, Marathi, Gujarati, Kannada)
- [ ] Expanded municipal-level officer directories for major municipal corporations
- [ ] SMS and WhatsApp status notification webhook integrations
- [ ] Production-grade SIEM audit logging and role-based administrative access

---

## License

License: Not currently specified. Developed for the *Build What Moves India* initiative.
