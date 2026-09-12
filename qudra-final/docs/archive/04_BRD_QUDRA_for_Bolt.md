# QUDRA — BRD
## Business Requirements Document
### النسخة التنفيذية الموجهة لـ Bolt وAI Coding Agents

---

# 1. تعريف المنتج

**الاسم:** قُدرة (QUDRA)

**النوع:** Evidence-Based Problem-to-Team Platform

**القيمة الأساسية:**
> من الكلام إلى الدليل، ومن الدليل إلى الحل.

**المبدأ:**
> Evidence > Claims / Evidence > CV

---

# 2. Business Problem

الاختيار المهني الحالي يعتمد كثيراً على CV، المسميات، الكلمات المفتاحية، والشهادات.

هذه البيانات لا تجيب بالضرورة:
- هل يستطيع الشخص التنفيذ؟
- ما الدليل؟
- هل الدليل مرتبط بالمشكلة؟
- ما مستوى الثقة؟
- ما الذي ينقصه؟

QUDRA تحول المشكلة إلى قدرات مطلوبة ثم تربطها بأدلة حقيقية.

---

# 3. Product Objective

إثبات أن النظام يستطيع:

**Problem → Capability → Evidence → Explainable Match**

مع إظهار **Skill Gap**.

---

# 4. Target Users

### Primary
- Companies / Organizations.
- Developers / Freelancers / Technical Talent.
- Students / Graduates.

### Secondary / Future
- Challenge organizers.
- Hackathons.
- Training providers.
- Opportunity providers.

---

# 5. Core User Stories

## Company
As a company, I want to enter a real problem so QUDRA can identify the capabilities I need.

As a company, I want to see candidates ranked by evidence.

As a company, I want to understand why each candidate matches.

As a company, I want to see capability gaps before selecting a candidate.

## Talent
As a talent, I want to prove skills through evidence rather than claims.

As a talent, I want QUDRA to analyze my evidence and build my intelligence profile.

As a talent, I want to know what skills I lack for a target role/problem.

---

# 6. MVP Functional Requirements

## FR-01 Problem Input
The system shall allow a user/company to submit a natural-language problem.

## FR-02 Problem Analysis
The AI shall convert the problem into structured requirements.

Required fields:
- goal.
- problem.
- target users.
- constraints.
- tasks.
- capabilities.
- roles.
- technologies.
- priorities.
- confidence.

## FR-03 Evidence
The system shall store evidence as structured records.

## FR-04 User Intelligence Profile
The system shall maintain a pre-analyzed representation of a user's capabilities and evidence.

## FR-05 Matching
The system shall rank profiles against required capabilities.

## FR-06 Explainability
The system shall explain why a profile matches.

## FR-07 Skill Gap
The system shall identify missing capabilities relevant to the problem/target.

## FR-08 UX States
Every core workflow shall implement loading, success, empty, validation and error states.

---

# 7. Non-Functional Requirements

## NFR-01 Maintainability
Code must be modular and feature-oriented.

## NFR-02 Security
Authorization must be enforced server-side/database-side where applicable.

## NFR-03 Privacy
Only required evidence/data should be collected and exposed.

## NFR-04 Performance
Avoid unnecessary API calls and rendering.

## NFR-05 Accessibility
Core flows must be keyboard and contrast accessible.

## NFR-06 Responsiveness
Core screens must work across mobile and desktop.

## NFR-07 Reliability
AI output must be schema-validated.

---

# 8. UX Flow

### Company Flow
Problem → Analyze → Required Capabilities → Candidate Results → Evidence → Explainability → Skill Gap → Select

### Talent Flow
Join → Connect Evidence → Analyze → Intelligence Profile → Skills → Gaps → Opportunities

### Core System Flow
Evidence → AI Analysis → Rules Engine → Capability Score → Confidence → Matching

---

# 9. Screen Requirements

## 01 Landing
Communicate:
- What QUDRA does.
- Evidence-first value.
- Primary CTA.

## 02 Problem Input
Large but controlled input.
Clear submit action.
Loading state.

## 03 Analysis
Show progress and extracted requirements.
Do not expose meaningless technical details.

## 04 Capability Requirements
Display capabilities as structured cards/chips.
Show priority.

## 05 Candidate Results
Show:
- match.
- confidence.
- top evidence.
- capability coverage.
- gaps.

## 06 Candidate Evidence
Show evidence source, relevance, outcome and verification.

## 07 Skill Gap
Show:
- required.
- current.
- missing.
- impact.

## 08 Intelligence Profile
Show a concise capability summary with evidence.

---

# 10. Data Model

Core entities:

### User
- id.
- role.
- profile_id.
- created_at.

### Profile
- id.
- user_id.
- summary.
- capabilities.
- confidence.
- updated_at.

### Evidence
- id.
- user_id.
- source.
- source_url.
- type.
- title.
- skills.
- relevance.
- recency.
- difficulty.
- outcome.
- verification_status.
- confidence.
- metadata.
- analyzed_at.

### Problem
- id.
- creator_id.
- raw_description.
- structured_analysis.
- created_at.

### Capability
- id.
- name.
- category.

### ProblemCapability
- problem_id.
- capability_id.
- priority.
- required_level.

### Match
- problem_id.
- user_id.
- score.
- confidence.
- covered_capabilities.
- gaps.
- explanation.

---

# 11. Evidence Logic

Conceptual ranking:

**Company Challenge**
>
**Verified Practical Evidence**
>
**External Challenge**
>
**Outcome-backed Project**
>
**Certificate**
>
**Self-claim**

But score must also account for:
- relevance.
- recency.
- verification.
- difficulty.
- outcome.
- confidence.

---

# 12. AI Requirements

AI must have:
- system instructions.
- structured input.
- structured output.
- schema validation.
- fallback.
- retry.
- provider abstraction.
- prompt versioning where needed.

Do not let free-form AI text directly control business logic.

---

# 13. GitHub Integration — Future/B2

Architecture:

Connect → Authorize → Select Repositories → Fetch → Analyze → Evidence Record → Profile Update

MVP-friendly approach:
- public repositories first.
- minimal permissions.
- explicit consent.

Future:
- GitHub App.
- webhooks.
- incremental analysis.

---

# 14. Security Requirements

Every milestone must include:
- authentication test.
- authorization test.
- RLS test.
- input validation.
- secrets scan.
- dependency review.
- API permissions review.
- error leakage review.
- privacy review.

---

# 15. Testing Requirements

For each Feature:
- type check.
- lint.
- build.
- unit/integration where appropriate.
- browser/user-flow verification.
- responsive.
- accessibility.
- security.
- cache.
- regression.

A feature is not Done because code compiles.

---

# 16. Cache Requirements

The system must avoid stale deployments and stale frontend/backend configuration.

Verify:
- Service Worker.
- asset caching.
- API data.
- environment variables.
- auth/session.

Test from:
- normal session.
- hard refresh.
- clean session.

---

# 17. Design Requirements

Use QUDRA Design System.

Current visual direction:
- Deep/Turquoise family.
- Yellow accent.
- Tajawal.
- Inter.

Use centralized design tokens.

Motion:
- purposeful.
- lightweight.
- accessible.
- reduced-motion aware.

---

# 18. MVP Scope Control

### In
- Problem Analyzer.
- Evidence.
- User Intelligence Profile.
- Explainable Matching.
- Skill Gap.
- Core UI.
- Seed data.
- Optional public GitHub analysis if time allows.

### Out
- Full marketplace.
- Payments.
- Full Project Intelligence.
- Full company challenge management.
- Full oral interview.
- Huge multi-platform scraping.
- Full workspace.

---

# 19. Roadmap

### B0
Foundation.

### B1
Core Intelligence.

### B2
Evidence Integrations.

### B3
Productization.

### B4
Intelligence Expansion.

---

# 20. Acceptance Criteria — MVP

MVP is accepted only if a demo can:
1. submit a real problem.
2. analyze it.
3. extract capabilities.
4. show candidates.
5. show evidence.
6. explain ranking.
7. show skill gaps.
8. complete the workflow without broken interactions.
9. pass basic security review.
10. pass responsive/UI review.

---

# 21. Product Principles

1. Evidence over claims.
2. Problem-first.
3. Explainable AI.
4. Modular architecture.
5. Security by design.
6. UX is part of functionality.
7. Test as a user.
8. Build for the next feature.
9. Free-first for MVP.
10. Every outcome can become new evidence.

---

# 22. Instructions to Bolt / AI Coding Agent

Before changing code:
- inspect current architecture.
- inspect TASKS.
- inspect existing components.
- identify dependencies.
- plan minimal safe change.

After changing code:
- run checks.
- test feature.
- test regression.
- review security.
- review UX/UI.
- review responsive behavior.
- review cache if relevant.
- update TASKS.
- report exactly what was verified.

Never claim 100% verification without actually performing the verification.

---

# 23. Success Metric for the Hackathon

The strongest proof is not number of screens.

The proof is:

> A real problem enters QUDRA → AI extracts capabilities → QUDRA finds people with evidence → explains the match → exposes the skill gap.

That demonstrates the product thesis.
