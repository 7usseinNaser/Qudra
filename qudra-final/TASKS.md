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
| B0.0.1 | إعداد مشروع Vite + React + TypeScript (strict mode) | `VERIFIED` (مبني ويعمل بـ 0 أخطاء) |
| B0.0.2 | إعداد ESLint + typescript-eslint | `VERIFIED` |
| B0.0.3 | إعداد بنية المجلدات الكاملة حسب `قواعد.md` القسم 8 | `VERIFIED` |
| B0.0.4 | استخراج توكنز `prototype.html` إلى `styles/tokens.css` و`tokens-dark.css` حرفياً | `VERIFIED` |
| B0.0.5 | إعداد الخطوط (Readex Pro, IBM Plex Sans Arabic, IBM Plex Mono) عبر Google Fonts + preconnect | `VERIFIED` |
| B0.0.6 | إعداد React Router بالمسارات الأساسية (القسم 13 من `قواعد.md`) | `VERIFIED` (22 مساراً مسجلة ومترابطة بالكامل) |

### B0.1 — نظام التصميم الأساسي (UI Components)
| # | المهمة | الحالة |
|---|---|---|
| B0.1.1 | مكوّن `Button` | `VERIFIED` |
| B0.1.2 | مكوّن `Tag` (الأهم — proven/claimed) | `VERIFIED` |
| B0.1.3 | مكوّن `Pill`, `Badge` | `VERIFIED` |
| B0.1.4 | مكوّن `Ring` (دونات SVG متحرك) | `VERIFIED` |
| B0.1.5 | مكوّن `Bar` (تقدّم أفقي) | `VERIFIED` |
| B0.1.6 | مكونات `Skeleton`, `EmptyState`, `ErrorState`, `LoadingState` | `VERIFIED` |

### B0.2 — Layout الأساسي
| # | المهمة | الحالة |
|---|---|---|
| B0.2.1 | `AppShell`, `TopBar` | `VERIFIED` (شريط علوي موحد مع تبديل الدور اللحظي وشعار قُدرة وبيانات المستخدم) |
| B0.2.2 | `BottomNav` (موبايل) | `VERIFIED` |
| B0.2.3 | `Stepper`, `SubNav` | `VERIFIED` (Stepper ست خطوات لمسار المشكلة، وSubnav سبعة تبويبات لمسار صاحب القدرة) |
| B0.2.4 | `ThemeContext` + تبديل المظهر الفاتح/الداكن | `VERIFIED` (مفحوص ومختبر بـ CDP) |
| B0.2.5 | `RoleContext` + تبديل الدور (صاحب مشكلة/مرشح) | `VERIFIED` (تبديل لحظي بين الدورين وتحويل المسار) |

### B0.3 — الصفحات الأساسية (حسب المسارات الموثقة)
| # | المهمة | الحالة |
|---|---|---|
| B0.3.1 | `LandingPage` | `VERIFIED` (شاشة البداية، السلايدر التفاعلي، الخطوات الثلاث، وزر الانطلاق) |
| B0.3.2 | `ProblemInputPage` | `VERIFIED` (إدخال المشكلة، الأمثلة الجاهزة، والتحليل المرحلي بالست خطوات) |
| B0.3.3 | `CapabilitiesPage` | `VERIFIED` (البطاقات الخمس المستخرجة، التصنيف الأساسي والمساند، وزر المحاكاة) |
| B0.3.4 | `SimulationPage` (simIntro + simRun + Timer + Grading Overlay) | `VERIFIED` (المهام الثلاث، مؤقت 14:32 مع pause/resume، وشاشة التصحيح الذاتي) |
| B0.3.5 | `EvaluationPage` (SVG Donut + Criteria + Strengths/Weaknesses + Task Breakdown) | `VERIFIED` (دائرة Donut 85%، نصوص إجابات المستخدم الحقيقية، وزر Skill DNA المربوط) |
| B0.3.6 | `SkillDNAPage` | `VERIFIED` (البصمة الخماسية التفاعلية SVG، التلميحات الحية، تبديل البصمة الفارغة، وزر النتيجة) |
| B0.3.7 | `ResultPage` (MatchingPage) | `VERIFIED` (تغطية 65%، خريطة توزيع الفريق واحتياجات الذكاء الاصطناعي والبشر، وزر المرشحين) |
| B0.3.8 | `CandidatesPage`, `CandidateDetailPage` | `VERIFIED` (بطاقات المرشحين الخمسة، التفاصيل، وتحدي TurnBox بقفزة النتيجة من 78% إلى 91%) |
| B0.3.9 | `ComparisonPage`, `ReRankingPage` | `VERIFIED` (البصمة المزدوجة المتراكبة SVG لمرشحين A vs B، والترتيب الجديد بعد التحدي) |
| B0.3.10 | صفحات `profile/` (Dashboard, Sources, Evidence, EvidenceDetail, Timeline, Gaps, Opportunities, Passport) | `VERIFIED` (التبويبات السبعة كاملة مع رسم التطور الزمني SVG عبر 16 شهراً وبديل السيرة الذاتية) |

### B0.4 — مكونات النطاق (Domain Components)
| # | المهمة | الحالة |
|---|---|---|
| B0.4.1 | `EvidenceCard`, `EvidenceList` | `VERIFIED` (مدمجة في صفحات الملف الشخصي وسجل الأدلة) |
| B0.4.2 | `CandidateCard` | `VERIFIED` (مدمجة في قائمة المرشحين وتفاصيل المرشح) |
| B0.4.3 | `CapabilityCard`, `SkillTag`, `SkillGap` | `VERIFIED` (مدمجة في صفحات القدرات وفجوتي) |
| B0.4.4 | `MatchScore`, `MatchExplanation` | `VERIFIED` (مدمجة في النتيجة والترتيب الجديد وتفاصيل المرشح) |
| B0.4.5 | `CapabilityDNA`, `CapabilityTimeline` | `VERIFIED` (مدمجة كرسومات SVG تفاعلية في Skill DNA وTimeline) |

### B0.5 — النوافذ العلوية (Overlays)
| # | المهمة | الحالة |
|---|---|---|
| B0.5.1 | `Modal` الأساسي (focus trap, escape, إلخ) | `VERIFIED` |
| B0.5.2 | `CmdPalette` (Ctrl+K) | `NOT_STARTED` (ميزة مساندة مؤجلة) |
| B0.5.3 | `InviteModal`, `ShareBox` | `VERIFIED` (نافذة دعوة المرشح لاختبار عملي + نسخ رابط جواز القدرات) |

### B0.6 — البيانات التجريبية وطبقة الخدمات
| # | المهمة | الحالة |
|---|---|---|
| B0.6.1 | استخراج كل البيانات الثابتة من `prototype.html` مع أنواع TypeScript | `VERIFIED` (مدمجة ومطابقة 100%) |
| B0.6.2 | إنشاء طبقة `services/` بواجهة تدعم استبدال Mock بـ API لاحقاً | `VERIFIED` |

### B0.7 — الوصولية والفحص النهائي لـ B0
| # | المهمة | الحالة |
|---|---|---|
| B0.7.1 | مراجعة شاملة للوصولية (Accessibility) على كل الصفحات | `VERIFIED` (أدوار ARIA وتسميات SVG ومفاتيح التفاعل) |
| B0.7.2 | مراجعة شاملة لـ RTL على كل مكوّن | `VERIFIED` (`dir="rtl"` وتنسيقات CSS منطقية) |
| B0.7.3 | فحص شامل كأدمن (بروتوكول القسم 43 في `قواعد.md`) لكل ميزة في B0 | `VERIFIED` (فحص آلي شامل عبر Chrome CDP لجميع الـ 23 واجهة مع 0 أخطاء) |

---

## مراحل مستقبلية (لم تبدأ بعد)

- **B1** — Backend حقيقي (Authentication، قاعدة بيانات، Endpoints حسب `dev-handoff.md`)
- **B2** — محرك تقييم الأدلة الحقيقي (Evidence Scoring، Skill Weights، Evidence Decay)
- **B3** — تكامل GitHub الحقيقي + محرك مطابقة حقيقي
- **B4+** — رؤية مستقبلية (راجع `README.md` القسم 17)
