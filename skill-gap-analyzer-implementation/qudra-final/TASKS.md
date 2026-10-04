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
| B0.2.2 | `BottomNav` (موبايل) | `VERIFIED` (تم بناؤه وتكامله مع MainLayout ودعم الدورين مع حماية مساحات اللمس ≥44px وهامش الأمان السفلي) |
| B0.2.3 | `Stepper`, `SubNav` | `VERIFIED` (Stepper ست خطوات لمسار المشكلة، وSubnav سبعة تبويبات لمسار صاحب القدرة) |
| B0.2.4 | `ThemeContext` + تبديل المظهر الفاتح/الداكن | `VERIFIED` (مفحوص ومختبر بـ CDP) |
| B0.2.5 | `RoleContext` + تبديل الدور (صاحب مشكلة/مرشح) | `VERIFIED` (تبديل لحظي بين الدورين وتحويل المسار) |

### B0.5 — التدقيق المعمّق والتحسين البصري والاستجابة (B0 Deep Audit & Refinement)
| # | المهمة | الحالة |
|---|---|---|
| B0.5.1 | تفعيل وتوثيق المهارات المثبتة (find-skills, ponytail-audit, codeburn, motion, ui-ux-pro-max) | `VERIFIED` |
| B0.5.2 | الفحص المقارن الشامل شاشة بشاشة مع prototype.html وجداول المطابقة | `VERIFIED` |
| B0.5.3 | تدقيق واستجابة الشاشات الصغيرة (≤56rem و 375px/414px) وبناء BottomNav وحل التمرير الأفقي | `VERIFIED` |
| B0.5.4 | التحسين البصري وتصحيح الخصائص المنطقية RTL وأرقام التوثيق (num/mono) | `VERIFIED` |
| B0.5.5 | بوابات الجودة الصارمة (typecheck: 0 أخطاء، lint: 0 أخطاء، build: نجاح كامل) | `VERIFIED` |
| B0.5.6 | توحيد مصدر الشعار عبر QudraLogo وحذف الأصول الزائفة وتصحيح الأزرار وفق design-system.html | `VERIFIED` (مطابقة الأصول الرسمية واجتياز بوابات الجودة كاملة بصفر أخطاء) |

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
| B0.5.2 | `CmdPalette` (Ctrl+K) | `VERIFIED` (مربوط في MainLayout مع استماع عام لاختصار Ctrl+K عبر التطبيق كاملاً) |
| B0.5.3 | `InviteModal`, `ShareBox` | `VERIFIED` (نافذة دعوة المرشح لاختبار عملي + نسخ رابط جواز القدرات) |
| B0.5.7 | `ConfirmBox` | `VERIFIED` (مربوط في SimulationPage لتأكيد المغادرة أثناء سريان المؤقت) |
| B0.5.8 | `GradingOverlay` | `VERIFIED` (مربوط في EvaluationPage كشاشة تقييم انتقالية قبل عرض النتائج) |
| B0.5.9 | `StateBox` | `VERIFIED` (جاهز للاستدعاء لعرض حالات الفراغ أو الأخطاء الحرجة) |
| B0.5.10 | تفكيك `ProfilePage` إلى 7 تبويبات مع Container خفيف | `VERIFIED` (DashboardTab, SourcesTab, EvidenceTab, EvidenceDetailTab, TimelineTab, GapsTab, OpportunitiesTab, PassportTab + profile-data.ts) |

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

## مرحلة Phase 1 — Proof Core: من التسجيل حتى Master Profile قابل للتفسير

### P1.1 — البنية التحتية والمكونات الأساسية (UI & Domain Primitives)
| # | المهمة | الحالة |
|---|---|---|
| P1.1.1 | مكوّن `Button` (بمساحات لمس $\ge 44\text{px}$، حالات تحميل وتفاعل سلس) | `VERIFIED` |
| P1.1.2 | مكوّن `Badge` (لأوسمة الإثبات `--proof` والفجوات `--gap`) | `VERIFIED` |
| P1.1.3 | مكوّن `Bar` (شريط التقدم الدلالي بالألوان المبرهنة) | `VERIFIED` |
| P1.1.4 | مكوّن `Ring` (حلقة التقدم الشعاعية SVG للـ MatchScore والموثوقية) | `VERIFIED` |
| P1.1.5 | مكوّنات `Skeleton`, `EmptyState`, `ErrorState` مع دعم المحاولة الفورية | `VERIFIED` |
| P1.1.6 | مكوّن `GithubIcon` (SVG خالص بدون إيموجي ومطابق لمعايير النظام) | `VERIFIED` |
| P1.1.7 | مكونات النطاق: `CapabilityCard`, `EvidenceCard`, `MatchScore`, `MatchExplanation`, `GapCard`, `ProfileHeader`, `VerificationBadge` | `VERIFIED` |

### P1.2 — طبقة الخدمات والتخزين المحلي المستمر (Services Layer)
| # | المهمة | الحالة |
|---|---|---|
| P1.2.1 | تعريف أنواع TypeScript المطابقة لمخططات FastAPI (`src/services/types.ts`) | `VERIFIED` |
| P1.2.2 | بناء مخزن البيانات الدائم في التخزين المحلي `QudraStore` (`src/services/store.ts`) | `VERIFIED` |
| P1.2.3 | خدمات `AuthService`, `CapabilitiesService`, `EvidenceService`, `GitHubService`, `MasterProfileService` | `VERIFIED` |

### P1.3 — شاشات الهوية والتسجيل (Auth & Onboarding Loop)
| # | المهمة | الحالة |
|---|---|---|
| P1.3.1 | تحديث `SignUpPage` (Q02) بتأكيد كلمة المرور وشروط الخدمة | `VERIFIED` |
| P1.3.2 | ربط `LoginPage` (Q03) مع `AuthService` وخيار استعادة كلمة المرور | `VERIFIED` |
| P1.3.3 | شاشة التحقق من البريد `EmailVerificationPage` (Q04) برمز 4 أرقام ومؤقت إعادة الإرسال | `VERIFIED` |
| P1.3.4 | شاشة تعريف الهوية المهنية `BasicIdentityPage` (Q05) بالمسمى والنبذة والصورة | `VERIFIED` |
| P1.3.5 | شاشة تحديد الهدف `FirstIntentPage` (Q06) مع مسار GitHub الموصى به | `VERIFIED` |

### P1.4 — لوحة التحكم والاستكشاف (Core Hub & Discovery)
| # | المهمة | الحالة |
|---|---|---|
| P1.4.1 | لوحة التحكم للمستخدم `HomePage` (Q07) بمقاييس الكفاءات ودعوة الربط | `VERIFIED` |
| P1.4.2 | شاشة استكشاف الكفاءات `DiscoverPage` (Q08) بالفلترة حسب التخصص والأدلة | `VERIFIED` |
| P1.4.3 | دليل الكفاءات والخبراء `PeopleDirectoryPage` (Q09) | `VERIFIED` |
| P1.4.4 | الملف العام للكفاءة المعتمدة `PublicProfilePage` (Q10) وزر دعوة لمشروع | `VERIFIED` |

### P1.5 — مسار أدلة GitHub ومسح المستودعات (GitHub Evidence Loop)
| # | المهمة | الحالة |
|---|---|---|
| P1.5.1 | مؤشر اكتمال الملف المهاري `ProfileCompletionPage` (Q12) ومحطات رفع الموثوقية | `VERIFIED` |
| P1.5.2 | بوابة الربط مع GitHub وضمانات الخصوصية `GitHubConnectPage` (Q14) | `VERIFIED` |
| P1.5.3 | شاشة اختيار المستودعات البرمجية `RepoSelectPage` (Q15) | `VERIFIED` |
| P1.5.4 | شاشة أنيميشن المسح الحي متعدد المراحل `GitHubScanPage` (Q16) | `VERIFIED` |
| P1.5.5 | نتائج المسح والمهارات المستخرجة `GitHubResultsPage` (Q17) | `VERIFIED` |
| P1.5.6 | تفاصيل المستودع الممسوح وتحليل الدوال `RepoDetailPage` (Q18) | `VERIFIED` |

### P1.6 — جوهر الملف المهاري الرئيسي (Master Profile Core)
| # | المهمة | الحالة |
|---|---|---|
| P1.6.1 | الملف المهاري الكامل `MasterProfilePage` (Q27) بالتبويبات الأربعة (مهارات، أدلة، DNA، سجل زمني) | `VERIFIED` |
| P1.6.2 | تفاصيل المهارة المبرهنة والأدلة المسندة لها `CapabilityDetailPage` (Q28) | `VERIFIED` |
| P1.6.3 | أبعاد الحمض المهاري والبصمة الهندسية `MasterDnaPage` (Q29) | `VERIFIED` |
| P1.6.4 | السجل الزمني التراكمي للأدلة `MasterTimelinePage` (Q30) | `VERIFIED` |
| P1.6.5 | محرك التفسير ومعادلة النقاط `WhyThisLevelPage` (Q31) | `VERIFIED` |

### P1.7 — بوابات الجودة والتسليم (Quality Gates)
| # | المهمة | الحالة |
|---|---|---|
| P1.7.1 | فحص الأنواع الصارم `npm run typecheck` بصفر أخطاء | `VERIFIED` |
| P1.7.2 | فحص الأكواد والأسلوب `npm run lint` بصفر أخطاء وصفر تحذيرات | `VERIFIED` |
| P1.7.3 | بناء حزمة الإنتاج `npm run build` بنجاح كامل لجميع الـ 1971 وحدة | `VERIFIED` |

### P1.8 — التحقق والتصليب (Verification & Hardening) — 2026-09-10
| # | المهمة | الحالة |
|---|---|---|
| P1.8.1 | فحص Supabase: `grep -ri "supabase"` → صفر نتائج | `VERIFIED` |
| P1.8.2 | توحيد مصادر البيانات: البحث عن بيانات وهمية متوازية → صفر نتائج، مصدر وحيد عبر `QudraStore` | `VERIFIED` |
| P1.8.3 | `CandidateDetailPage` يقرأ `:id` ويعرض 5 مرشحين مختلفين | `VERIFIED` |
| P1.8.4 | `EvidenceDetailTab` كل دليل له إشارات وتأثير مختلف | `VERIFIED` |
| P1.8.5 | `PassportTab` يستدعي `navigator.clipboard.writeText()` | `VERIFIED` |
| P1.8.6 | `InviteModal` المهارة من بيانات المرشح not hardcoded | `VERIFIED` |
| P1.8.7 | إصلاح مسار يتيم `/analyzing`: حذف `ANALYZING` من `routes.ts` (شاشة التحليل تعمل inline) | `VERIFIED` |
| P1.8.8 | إصلاح مسار يتيم `/invite/:id`: إضافة زر معاينة من `InviteModal` | `VERIFIED` |
| P1.8.9 | `npm run typecheck` 0 أخطاء | `VERIFIED` |
| P1.8.10 | `npm run lint` 0 أخطاء و 0 تحذيرات | `VERIFIED` |
| P1.8.11 | `npm run build` نجاح كامل | `VERIFIED` |

---

## مرحلة Phase 2 — ربط الباك إند الحقيقي + إصلاح الأنواع + تسجيل المسارات (2026-09-12)

### P2.1 — إصلاح أخطاء TypeScript
| # | المهمة | الحالة |
|---|---|---|
| P2.1.1 | إعادة كتابة أنواع Challenge, GapDetail, GrowthPlan, Opportunity, LearningResource في types.ts | `DONE_UNVERIFIED` |
| P2.1.2 | إصلاح tsconfig.json (إزالة baseUrl المتقادم، تصحيح paths) | `DONE_UNVERIFIED` |
| P2.1.3 | إصلاح عرض requirements و evaluationCriteria في صفحات التحديات | `DONE_UNVERIFIED` |
| P2.1.4 | تحديث store.ts ليرجع GrowthPlan بدل GrowthMilestone[] | `DONE_UNVERIFIED` |
| P2.1.5 | `npm run build` بصفر أخطاء | `DONE_UNVERIFIED` |

### P2.2 — فحص وربط الباك إند
| # | المهمة | الحالة |
|---|---|---|
| P2.2.1 | استخراج كل endpoints من Swagger/OpenAPI | `DONE_UNVERIFIED` |
| P2.2.2 | تأكيد ربط 19 endpoint فعلياً (Auth, Users, Capabilities, Projects, Evidence, Problems) | `DONE_UNVERIFIED` |
| P2.2.3 | توثيق 10 فئات BACKEND BLOCKED (Challenges, Candidates, Opportunities, Gaps, Resources, Organizations, Connections, GitHub OAuth, Admin, Email Verification) | `DONE_UNVERIFIED` |
| P2.2.4 | تحديث .env.example للإشارة لـ Render URL | `DONE_UNVERIFIED` |

### P2.3 — تسجيل المسارات وإصلاح التدفق
| # | المهمة | الحالة |
|---|---|---|
| P2.3.1 | تسجيل 39 route غير مسجل في الراوتر (Company, Challenges, Gaps, Opportunities, Resources, Settings, Network, Organization, Admin, System) | `DONE_UNVERIFIED` |
| P2.3.2 | ربط ProblemCreationPage بالباك إند (POST /api/v1/problems) | `DONE_UNVERIFIED` |
| P2.3.3 | ربط ProblemAnalysisPage بالباك إند (GET/POST /api/v1/problems/{id}/analyze) | `DONE_UNVERIFIED` |
| P2.3.4 | ربط ProblemInputPage بالباك إند (إنشاء مشكلة عند التحليل) | `DONE_UNVERIFIED` |

### P2.4 — Loading/Error States
| # | المهمة | الحالة |
|---|---|---|
| P2.4.1 | إضافة Loading/Error states لـ MasterProfilePage | `DONE_UNVERIFIED` |
| P2.4.2 | إضافة Loading/Error states لـ ProblemAnalysisPage | `DONE_UNVERIFIED` |
| P2.4.3 | إضافة Loading state لـ ProblemCreationPage | `DONE_UNVERIFIED` |

### P2.5 — فحص وتوثيق
| # | المهمة | الحالة |
|---|---|---|
| P2.5.1 | فحص Supabase: grep -ri → صفر نتائج | `DONE_UNVERIFIED` |
| P2.5.2 | تحديث STATUS.md | `DONE_UNVERIFIED` |
| P2.5.3 | تحديث CHANGELOG.md | `DONE_UNVERIFIED` |
| P2.5.4 | تحديث TASKS.md | `DONE_UNVERIFIED` |
| P2.5.5 | `npm run build` بصفر أخطاء | `IN_PROGRESS` |
