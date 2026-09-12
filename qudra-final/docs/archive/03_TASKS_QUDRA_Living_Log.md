# QUDRA — TASKS
## سجل التنفيذ الحي (Living Execution Log)

> **الغرض:** هذا الملف هو مصدر الحقيقة لحالة المشروع.
>
> لا نعيد كتابة التاريخ. نحدّث الحالة ونضيف سجلات جديدة.

---

# 0. الحالة الحالية

**Current Phase:** MVP  
**Current Block:** B0  
**Status:** In Progress

### آخر إنجاز
- لم يتم تسجيل إنجاز جديد في هذا الملف بعد.

### الخطوة التالية
- تثبيت Foundation وDesign System وArchitecture قبل التوسع في features.

---

# 1. حالات المهام

- `⬜ TODO` لم تبدأ.
- `🟡 IN PROGRESS` قيد التنفيذ.
- `🟢 DONE` مكتملة ومختبرة.
- `🔴 BLOCKED` متوقفة بسبب مشكلة.
- `⚠️ NEEDS REVIEW` تعمل وتحتاج مراجعة.
- `🔵 DEFERRED` مؤجلة عمداً.

---

# 2. قواعد تحديث الملف

بعد كل مهمة:
1. غيّر الحالة.
2. أضف تاريخ الإنجاز.
3. أضف الملفات المتغيرة.
4. أضف ما تم اختباره.
5. أضف نتائج Security/UX إذا كانت مطلوبة.
6. أضف المشاكل.
7. أضف الخطوة التالية.

لا تحذف السجل السابق.

---

# 3. B0 — Foundation

## B0.1 Repository & Project Structure
Status: ⬜ TODO

Checklist:
- [ ] repository structure.
- [ ] feature-based folders.
- [ ] environment configuration.
- [ ] development setup.
- [ ] build works.

## B0.2 Design Tokens
Status: ⬜ TODO

- [ ] QUDRA colors.
- [ ] typography.
- [ ] spacing.
- [ ] radius.
- [ ] shadows.
- [ ] motion tokens.
- [ ] responsive breakpoints.

## B0.3 App Shell & Routing
Status: ⬜ TODO

- [ ] routing.
- [ ] navigation.
- [ ] layout.
- [ ] loading boundary.
- [ ] error boundary.

## B0.4 Auth
Status: ⬜ TODO

- [ ] sign in.
- [ ] sign up.
- [ ] session.
- [ ] authorization.
- [ ] logout.

## B0.5 Database Foundation
Status: ⬜ TODO

- [ ] users.
- [ ] profiles.
- [ ] evidence.
- [ ] problems.
- [ ] capabilities.
- [ ] matches.
- [ ] skill gaps.
- [ ] migrations.
- [ ] RLS.

## B0.6 Security Baseline
Status: ⬜ TODO

- [ ] secrets.
- [ ] permissions.
- [ ] RLS.
- [ ] input validation.
- [ ] error leakage.
- [ ] dependency check.

---

# 4. B1 — Core Intelligence

## B1.1 Problem Input
Status: ⬜ TODO

- [ ] text input.
- [ ] validation.
- [ ] loading.
- [ ] error.
- [ ] submit.

## B1.2 Problem Analyzer
Status: ⬜ TODO

Output:
- [ ] goal.
- [ ] problem.
- [ ] target users.
- [ ] constraints.
- [ ] tasks.
- [ ] capabilities.
- [ ] roles.
- [ ] technologies.
- [ ] priorities.
- [ ] confidence.

## B1.3 Evidence Model
Status: ⬜ TODO

- [ ] evidence record.
- [ ] source.
- [ ] type.
- [ ] skill mapping.
- [ ] relevance.
- [ ] verification.
- [ ] confidence.

## B1.4 User Intelligence Profile
Status: ⬜ TODO

- [ ] profile generation.
- [ ] capability summary.
- [ ] evidence summary.
- [ ] confidence.
- [ ] gaps.
- [ ] update mechanism.

## B1.5 Explainable Matching
Status: ⬜ TODO

- [ ] candidate ranking.
- [ ] capability coverage.
- [ ] evidence support.
- [ ] score.
- [ ] explanation.
- [ ] confidence.

## B1.6 Skill Gap
Status: ⬜ TODO

- [ ] target capability set.
- [ ] current capability set.
- [ ] missing skills.
- [ ] severity/priority.
- [ ] company-facing explanation.
- [ ] user-facing explanation.

## B1.7 MVP UI Polish
Status: ⬜ TODO

- [ ] responsive.
- [ ] empty states.
- [ ] loading.
- [ ] error.
- [ ] accessibility.
- [ ] design consistency.
- [ ] motion review.

---

# 5. B2 — Evidence Integration

## B2.1 GitHub Public Integration
Status: ⬜ TODO

- [ ] connect/authorize.
- [ ] repository selection.
- [ ] metadata retrieval.
- [ ] analysis.
- [ ] evidence creation.
- [ ] profile update.

## B2.2 Evidence Normalization
Status: ⬜ TODO

- [ ] normalize skills.
- [ ] normalize source.
- [ ] normalize difficulty.
- [ ] normalize recency.
- [ ] normalize verification.

## B2.3 Re-analysis
Status: ⬜ TODO

- [ ] new evidence trigger.
- [ ] re-analysis.
- [ ] profile update.
- [ ] matching update.

## B2.4 Practical Challenge
Status: 🔵 DEFERRED

---

# 6. B3 — Productization

## B3.1 Company Workflow
Status: ⬜ TODO

## B3.2 Company Challenges
Status: 🔵 DEFERRED

## B3.3 Solution / Team Composer
Status: ⬜ TODO

## B3.4 Mini Project Workspace
Status: ⬜ TODO

---

# 7. B4 — Intelligence Expansion

## B4.1 Oral Evidence
Status: ⬜ TODO

## B4.2 Project Intelligence
Status: ⬜ TODO

## B4.3 Market Research
Status: ⬜ TODO

## B4.4 Competitor Analysis
Status: ⬜ TODO

## B4.5 Risk Analysis
Status: ⬜ TODO

## B4.6 Revenue Signals
Status: ⬜ TODO

## B4.7 Evidence Graph
Status: ⬜ TODO

## B4.8 Evidence Passport
Status: ⬜ TODO

## B4.9 Opportunity Readiness
Status: ⬜ TODO

## B4.10 Marketplace / Opportunities
Status: ⬜ TODO

---

# 8. Testing Checklist

لكل Feature:

- [ ] Type check.
- [ ] Lint.
- [ ] Build.
- [ ] Happy path.
- [ ] Validation.
- [ ] Loading.
- [ ] Empty.
- [ ] Error.
- [ ] Retry.
- [ ] User-flow test.
- [ ] Responsive.
- [ ] Accessibility.
- [ ] Security.
- [ ] Cache/Service Worker عند الحاجة.
- [ ] Regression.

---

# 9. Milestone Gate

## MVP Gate
يجب أن تعمل:
- [ ] Problem Input.
- [ ] Problem Analyzer.
- [ ] Required Capabilities.
- [ ] Evidence.
- [ ] User Intelligence Profile.
- [ ] Explainable Match.
- [ ] Skill Gap.

## Demo Gate
- [ ] Seed users.
- [ ] Seed evidence.
- [ ] Realistic problem.
- [ ] ranking.
- [ ] explanation.
- [ ] skill gap.
- [ ] no broken buttons.
- [ ] clean UI.
- [ ] no critical security issue.

---

# 10. Change Log

### Entry Template
```text
## YYYY-MM-DD — [Task ID]
Status:
What changed:
Files:
Tests:
Security:
UX/UI:
Cache:
Issues:
Next:
```

---

# 11. Current Change Log

لا توجد entries مسجلة بعد.
