# TASKS.md — سجل المهام الحي (Living Log)

> السجل التفصيلي لكل مهمة تُنفَّذ على مشروع QUDRA. حالات المهمة: `NOT_STARTED` → `IN_PROGRESS` → `DONE_UNVERIFIED` → `VERIFIED` → `BLOCKED`.
>
> **قاعدة إلزامية**: لا تنتقل أي مهمة لحالة `VERIFIED` إلا بعد تنفيذ بروتوكول الفحص الكامل الموصوف في `قواعد.md` (القسمين 43 و46) و`QUDRA_FINAL_BOLT_PROMPT.md` (القسم 34-38): تسجيل دخول كأدمن + تجربة فعلية لكل زر/تفاعل جديد + توثيق النتيجة في `TEST_REPORT.md` + تحديث `PROJECT_MAP.md` + إنشاء سجل `.memory/tasks/YYYY-MM-DD_<TASK-ID>.md`.
>
> عند فشل أي بند من Quality Gate (`QUDRA_FINAL_BOLT_PROMPT.md` القسم 38)، اذكر معرّفه بالضبط هنا (مثال: "QG-14 FAILED: ...") بدل وصف حر بدون رقم مرجعي.

---

## مرحلة B0 — إعادة البناء كتطبيق React (Frontend فقط، بيانات Demo)

### B0.0 — الإعداد الأساسي
| # | المهمة | الحالة |
|---|---|---|
| B0.0.1 | إعداد مشروع Vite + React + TypeScript (strict mode) | `NOT_STARTED` |
| B0.0.2 | إعداد ESLint + typescript-eslint | `NOT_STARTED` |
| B0.0.3 | إعداد بنية المجلدات الكاملة حسب `قواعد.md` القسم 8 | `NOT_STARTED` |
| B0.0.4 | استخراج توكنز `prototype.html` إلى `styles/tokens.css` و`tokens-dark.css` حرفياً | `NOT_STARTED` |
| B0.0.5 | إعداد الخطوط (Readex Pro, IBM Plex Sans Arabic, IBM Plex Mono) عبر Google Fonts + preconnect | `NOT_STARTED` |
| B0.0.6 | إعداد React Router بالمسارات الأساسية (القسم 13 من `قواعد.md`) | `NOT_STARTED` |

### B0.1 — نظام التصميم الأساسي (UI Components)
| # | المهمة | الحالة |
|---|---|---|
| B0.1.1 | مكوّن `Button` | `NOT_STARTED` |
| B0.1.2 | مكوّن `Tag` (الأهم — proven/claimed) | `NOT_STARTED` |
| B0.1.3 | مكوّن `Pill`, `Badge` | `NOT_STARTED` |
| B0.1.4 | مكوّن `Ring` (دونات SVG متحرك) | `NOT_STARTED` |
| B0.1.5 | مكوّن `Bar` (تقدّم أفقي) | `NOT_STARTED` |
| B0.1.6 | مكونات `Skeleton`, `EmptyState`, `ErrorState`, `LoadingState` | `NOT_STARTED` |

### B0.2 — Layout الأساسي
| # | المهمة | الحالة |
|---|---|---|
| B0.2.1 | `AppShell`, `TopBar` | `NOT_STARTED` |
| B0.2.2 | `BottomNav` (موبايل) | `NOT_STARTED` |
| B0.2.3 | `Stepper`, `SubNav` | `NOT_STARTED` |
| B0.2.4 | `ThemeContext` + تبديل المظهر الفاتح/الداكن | `NOT_STARTED` |
| B0.2.5 | `RoleContext` + تبديل الدور (صاحب مشكلة/مرشح) | `NOT_STARTED` |

### B0.3 — الصفحات الأساسية (حسب المسارات الموثقة)
| # | المهمة | الحالة |
|---|---|---|
| B0.3.1 | `LandingPage` | `NOT_STARTED` |
| B0.3.2 | `ProblemInputPage` | `NOT_STARTED` |
| B0.3.3 | `CapabilitiesPage` | `NOT_STARTED` |
| B0.3.4 | `SimulationPage` + `useSimulation` + `useTimer` | `NOT_STARTED` |
| B0.3.5 | `EvaluationPage` | `NOT_STARTED` |
| B0.3.6 | `SkillDNAPage` | `NOT_STARTED` |
| B0.3.7 | `MatchingPage` | `NOT_STARTED` |
| B0.3.8 | `CandidateListPage`, `CandidateDetailPage` | `NOT_STARTED` |
| B0.3.9 | `ComparisonPage` | `NOT_STARTED` |
| B0.3.10 | صفحات `profile/` (Dashboard, Evidence, Opportunities, Passport) | `NOT_STARTED` |

### B0.4 — مكونات النطاق (Domain Components)
| # | المهمة | الحالة |
|---|---|---|
| B0.4.1 | `EvidenceCard`, `EvidenceList` | `NOT_STARTED` |
| B0.4.2 | `CandidateCard` | `NOT_STARTED` |
| B0.4.3 | `CapabilityCard`, `SkillTag`, `SkillGap` | `NOT_STARTED` |
| B0.4.4 | `MatchScore`, `MatchExplanation` | `NOT_STARTED` |
| B0.4.5 | `CapabilityDNA`, `CapabilityTimeline` | `NOT_STARTED` |

### B0.5 — النوافذ العلوية (Overlays)
| # | المهمة | الحالة |
|---|---|---|
| B0.5.1 | `Modal` الأساسي (focus trap, escape, إلخ) | `NOT_STARTED` |
| B0.5.2 | `CmdPalette` (Ctrl+K) | `NOT_STARTED` |
| B0.5.3 | `InviteModal`, `ShareBox` | `NOT_STARTED` |

### B0.6 — البيانات التجريبية وطبقة الخدمات
| # | المهمة | الحالة |
|---|---|---|
| B0.6.1 | استخراج كل البيانات الثابتة من `prototype.html` إلى `src/data/` مع أنواع TypeScript | `NOT_STARTED` |
| B0.6.2 | إنشاء طبقة `services/` (candidates, evidence, capabilities, problems, matching) بواجهة تدعم استبدال Mock بـ API لاحقاً | `NOT_STARTED` |

### B0.7 — الوصولية والفحص النهائي لـ B0
| # | المهمة | الحالة |
|---|---|---|
| B0.7.1 | مراجعة شاملة للوصولية (Accessibility) على كل الصفحات | `NOT_STARTED` |
| B0.7.2 | مراجعة شاملة لـ RTL على كل مكوّن | `NOT_STARTED` |
| B0.7.3 | فحص شامل كأدمن (بروتوكول القسم 43 في `قواعد.md`) لكل ميزة في B0 | `NOT_STARTED` |

---

## مراحل مستقبلية (لم تبدأ بعد)

- **B1** — Backend حقيقي (Authentication، قاعدة بيانات، Endpoints حسب `dev-handoff.md`)
- **B2** — محرك تقييم الأدلة الحقيقي (Evidence Scoring، Skill Weights، Evidence Decay)
- **B3** — تكامل GitHub الحقيقي + محرك مطابقة حقيقي
- **B4+** — رؤية مستقبلية (راجع `README.md` القسم 17)
