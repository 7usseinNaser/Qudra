# قُدرة (QUDRA)

> **"بدل أن تقول إنك تعرف — أثبت أنك تستطيع."**
> *"Don't tell us what you know. Show us what you can do."*
> **من الكلام إلى الدليل، ومن الدليل إلى الحل.**

هذا الملف هو **المصدر الوحيد المعتمد** لفكرة مشروع QUDRA بالكامل، من أول مرحلة تفكير حتى آخر حالة توثيق. أي وكيل ذكاء اصطناعي (Bolt، Claude Code، Cursor، أو غيره) يجب أن يقرأ هذا الملف **أولاً** قبل أي عمل على المشروع.

> **العقد الثابت:** لا تفترض. لا تخترع. افحص الموجود أولاً. استخدم Find-Skills قبل التنفيذ. استخدم Grill-Me عند الغموض. نفّذ بأبسط بنية قابلة للتوسع، ثم اختبر كالمستخدم، وتحقق كأدمن، ووثّق كل شيء قبل إعلان الإنجاز.

**ترتيب الأولوية عند التعارض بين الملفات (لا تخالفه أبداً):**

```
1. prototype.html                  ← المرجع البصري والتفاعلي النهائي
2. design-system.html              ← التوكنز والمكونات القياسية
3. README.md (هذا الملف)            ← فكرة المنتج ونطاقه ومراحله
4. dev-handoff.md                   ← عقد الـ Backend وقاعدة البيانات
5. قواعد.md                          ← قواعد الهندسة والتنفيذ
6. QUDRA_FINAL_BOLT_PROMPT.md         ← تعليمات التنفيذ التفصيلية لهذه الجلسة
7. SKILLS.md                          ← المهارات المطلوب تحميلها قبل كل مهمة
8. أفضل الممارسات الهندسية العامة      ← الفيصل عند التعادل
```

إذا تعارض ملفان: **لا تخترع حلاً وسطاً. لا تستبدل مصدراً بآخر بصمت. اسأل حسين مباشرة.**

---

## جدول المحتويات

- [1. تعريف المشروع](#1-تعريف-المشروع)
- [2. المشكلة التي يحلها QUDRA](#2-المشكلة-التي-يحلها-qudra)
- [3. نموذج المنتج: Problem → Capability → Evidence → Match](#3-نموذج-المنتج-problem--capability--evidence--match)
- [4. الفلسفة الجوهرية: Evidence First](#4-الفلسفة-الجوهرية-evidence-first)
- [5. الجمهور المستهدف والمستخدمون](#5-الجمهور-المستهدف-والمستخدمون)
- [6. ما هو QUDRA وما هو ليس QUDRA](#6-ما-هو-qudra-وما-هو-ليس-qudra)
- [7. الـ Evidence Loop (دورة الأدلة)](#7-الـ-evidence-loop-دورة-الأدلة)
- [8. ملف القدرة (Capability Profile)](#8-ملف-القدرة-capability-profile)
- [9. تكامل GitHub وتحليل المشاريع](#9-تكامل-github-وتحليل-المشاريع)
- [10. المطابقة القابلة للتفسير (Explainable Matching)](#10-المطابقة-القابلة-للتفسير-explainable-matching)
- [11. Skill Gap (فجوة المهارة)](#11-skill-gap-فجوة-المهارة)
- [12. Core Loop لكل طرف](#12-core-loop-لكل-طرف)
- [13. الـ MVP الرسمي (أولويات P0–P3)](#13-الـ-mvp-الرسمي-أولويات-p0p3)
- [14. User Flows ولحظة الـ Wow](#14-user-flows-ولحظة-الـ-wow)
- [15. الهوية البصرية](#15-الهوية-البصرية)
- [16. الهيكل التقني والمعمارية](#16-الهيكل-التقني-والمعمارية)
- [17. مراحل المشروع (Roadmap)](#17-مراحل-المشروع-roadmap)
- [18. حالة المشروع الحالية](#18-حالة-المشروع-الحالية)
- [19. Definition of Done](#19-definition-of-done)
- [20. هيكل ملفات المشروع](#20-هيكل-ملفات-المشروع)
- [21. الرؤية المستقبلية (خارج نطاق B0-B1)](#21-الرؤية-المستقبلية-خارج-نطاق-b0-b1)
- [22. كيف تبدأ العمل على هذا المشروع (للوكيل)](#22-كيف-تبدأ-العمل-على-هذا-المشروع-للوكيل)
- [23. مقياس النجاح](#23-مقياس-النجاح)

---

## 1. تعريف المشروع

قُدرة (QUDRA) منصة عربية (RTL) لإثبات القدرات الفعلية ومطابقة الأشخاص مع المشكلات والمهام **بناءً على أدلة عملية حقيقية (Evidence)**، وليس بناءً على ما يكتبه الشخص عن نفسه في السيرة الذاتية أو الـ Job Titles أو الكلمات المفتاحية أو الشهادات وحدها.

**تعريف الـ Core بدقة:**

> **Evidence-Based Capability Matching**
> مطابقة الأشخاص مع المشكلات بناءً على أدلة حقيقية تثبت قدراتهم.

QUDRA **ليست**:
- منصة وظائف تقليدية (Job Board)
- منصة Freelancing عادية (زي Upwork)
- CV Builder
- AI Recruiter تقليدي يعتمد على تحليل نص السيرة الذاتية أو الكلمات المفتاحية فقط

---

## 2. المشكلة التي يحلها QUDRA

الاختيار المهني اليوم يعتمد كثيراً على CV، Job Titles، Keywords، Self-reported Skills، والشهادات. هذه الإشارات **لا تثبت بالضرورة** قدرة الشخص الفعلية على التنفيذ.

المشكلة ليست فقط أن الشركات لا تجد موظفين. المشكلة الأعمق: **الشركات لا تستطيع بسهولة التحقق** من:

- هل الشخص يمتلك المهارة فعلاً؟
- ما مستوى هذه المهارة الحقيقي؟
- هل يستطيع تطبيقها في مشروع حقيقي؟
- هل المشاريع الموجودة في الـ CV حقيقية وقوية، أم مجرد ادعاء؟
- هل الشخص كتب الكود بنفسه؟
- ما الفرق الحقيقي بين شخص كتب "Expert Java" وآخر أثبت قدرته فعلياً؟

QUDRA تجيب مباشرة على:
- ما القدرات المطلوبة للمشكلة تحديداً؟
- من يملكها فعلاً؟
- ما الدليل؟
- لماذا هذا الشخص مناسب تحديداً؟
- ما مستوى الثقة في هذه المطابقة؟
- ما الفجوات المتبقية؟

وفي المقابل، الشخص صاحب القدرة الحقيقية (خصوصاً الـ Junior، المستقلون، الطلاب) غالباً لا يملك وسيلة لإثبات قدرته الحقيقية عبر القنوات التقليدية.

---

## 3. نموذج المنتج: Problem → Capability → Evidence → Match

بدل النموذج التقليدي:

```
Job → Candidate
```

يبني QUDRA نموذجاً مختلفاً جذرياً:

```
Problem → Capability → Evidence → Match → Challenge/Project → Outcome → New Evidence
```

بمعنى: **المشكلة → القدرات المطلوبة → الأدلة → الشخص المناسب**

الشركة لا تبدأ بـ"أريد Backend Developer"، بل تبدأ بـ**"لدي هذه المشكلة، أحتاج من يحلها"**. عندها يقوم QUDRA بـ:

1. تحليل المشكلة واستخراج المهارات التقنية المطلوبة ومستوى كل مهارة
2. البحث عن الأشخاص بناءً على الأدلة الفعلية المرتبطة بهذه المهارات (وليس الكلمات المفتاحية في الـ CV)
3. تقديم مطابقة **قابلة للتفسير** (Explainable) — يعرف الباحث *لماذا* تم اختيار هذا الشخص تحديداً

---

## 4. الفلسفة الجوهرية: Evidence First

QUDRA لا تسأل فقط: **"ماذا تقول إنك تعرف؟"**

بل تسأل: **"ما الدليل الذي يثبت أنك تستطيع؟"**

هذا التمييز هو **قلب المنتج**، وليس تفصيلاً بصرياً:

| | Proven (مُثبت) | Claimed (مُدَّعى) |
|---|---|---|
| **المعنى** | دليل موثّق/متحقق منه | ادعاء ذاتي بلا Evidence موثّق كافٍ |
| **الشكل البصري** | حد صلب (solid border)، لون تركوازي (turquoise treatment) | حد متقطع (dashed border)، معالجة باهتة (muted treatment) |
| **عداد الأدلة** | يظهر (evidence count) | لا يظهر إطلاقاً (no evidence count) |
| **الوزن في المطابقة** | وزن كامل | وزن ضعيف جداً أو معدوم |

**قاعدة حرجة يجب على أي مطوّر أو وكيل ذكاء اصطناعي عدم كسرها أبداً: لا تدمج Proven وClaimed بصرياً.**
لا يجوز دمج أو خلط المعالجة البصرية بين "Proven" و"Claimed" في أي واجهة (الملف الشخصي، صفحة المرشحين، المقارنة، المطابقة، الأدلة، DNA القدرات، فجوة المهارة).

### قاعدة "Project Claim ≠ Project Evidence"

مجرد وجود Repository اسمه "AI SaaS Platform" لا يعني دليلاً قوياً إذا كان محتواه فقط ملف `README.md`. الدليل القوي هو مشروع فيه: Authentication + Database + API + Frontend + Backend + Testing + Deployment + Documentation.

### ترتيب قوة الأدلة (فلسفياً، وليس معادلة رياضية نهائية)

```
Real Company Challenge (تحدي شركة حقيقي)       ⬆️ الأقوى
Real Project (مشروع حقيقي مكتمل)               ⬆️
Verified Technical Challenge (تحدي تقني موثّق)  ⬆️
External Challenge (تحدي من منصة خارجية)        ⬆️
Course / Certificate (دورة / شهادة)             ⬆️
Self-Claim (ادعاء ذاتي)                         ⬇️ الأضعف
```

---

## 5. الجمهور المستهدف والمستخدمون

### Problem Owner (صاحب المشكلة)
شركة/مؤسسة/صاحب مشروع لديه مشكلة حقيقية/مشروع/مهمة/تحدٍ تقني، ويريد الوصول إلى Talent مثبت القدرة، ويسأل "من يستطيع حلها؟"

### Talent (صاحب القدرة)
مطور، مصمم، AI Engineer، Cybersecurity، عالم بيانات، أو أي صاحب قدرة يريد بناء Capability Profile قائم على Evidence حقيقي بدل الادعاء الذاتي.

### Project Seeker (الباحث عن مشروع/فرصة)
شخص يريد إيجاد أو بناء مشروع أو فرصة؛ يُدعَم لاحقاً ضمن منظومة Opportunities الأوسع.

### المستقبل
Challenge organizers، Hackathons، Training Providers، Opportunity Providers، الطلاب والمتعلمون (إثبات القدرة بدل الاعتماد فقط على الشهادات والدرجات).

**بداية الانطلاق (Cold Start):** يبدأ QUDRA بفئة محددة — المطورين/المستقلين التقنيين — قبل التوسع لاحقاً إلى AI، الأمن السيبراني، البيانات، التصميم، المنتج، والتسويق.

---

## 6. ما هو QUDRA وما هو ليس QUDRA

| المقارنة | الفرق الجوهري |
|---|---|
| **QUDRA مقابل LinkedIn** | LinkedIn: "هذه المهارات التي يقول المستخدم إنه يمتلكها." — QUDRA: "هذه المهارات التي توجد أدلة تدعم امتلاكها فعلياً." |
| **QUDRA مقابل Upwork** | Upwork يعتمد على Profile/Portfolio/Reviews. QUDRA يبني Evidence Graph يربط Problem ↔ Capability ↔ Person ↔ Evidence. |
| **QUDRA مقابل منصة وظائف** | منصة الوظائف تبدأ بـ"لدينا وظيفة". QUDRA يبدأ بـ"لدينا مشكلة". |
| **القيمة الحقيقية ليست الـ AI نفسه** | لو قلنا "QUDRA يستخدم ChatGPT لتحليل الأشخاص" — هذا ضعيف، لأن أي أحد يستطيع استخدام ChatGPT. القيمة الحقيقية: Evidence Infrastructure + Structured Capability Data + Matching Logic + Evidence History + Verification + Outcome Loop. الـ AI هو المحرك، لكن **النظام** هو المنتج. |

---

## 7. الـ Evidence Loop (دورة الأدلة)

هذه من أقوى أفكار المشروع — دورة ذاتية التحسّن:

```
Problem (مشكلة لدى شركة)
   ↓
Capability (QUDRA يحدد القدرات المطلوبة)
   ↓
Evidence (البحث عن الأدلة الداعمة)
   ↓
Match (اختيار الأشخاص المناسبين)
   ↓
Project / Challenge (تنفيذ المشروع/التحدي)
   ↓
Outcome (نتيجة موثّقة)
   ↓
New Evidence (تصبح النتيجة دليلاً جديداً)
   ↓
Profile becomes stronger (الملف يصبح أقوى، والدورة تتكرر)
```

بهذه الطريقة يصبح ملف كل مستخدم أدق مع الوقت — **ليس لأن المستخدم كتب ذلك، بل لأن الأدلة تراكمت فعلياً.**

---

## 8. ملف القدرة (Capability Profile)

بدل "حسين ناصر — Full Stack Developer"، يملك المستخدم **ملف قدرة** لا يعتمد فقط على ما يقوله عن نفسه، بل على البيانات التي يستطيع النظام إثباتها. مثال:

```
Front-End Development
Level: Advanced
الأدلة:
  - 7 مشاريع (4 React + 3 Flutter)
  - GitHub repositories محللة
  - تحديات محلولة
  - نتائج عملية موثقة
```

### الملف التحليلي الداخلي (المخفي جزئياً)

عند انضمام المستخدم، يبني QUDRA له **ملفاً تحليلياً داخلياً** يُنشأ تلقائياً، يُستخدم للمطابقة، ويتغيّر تلقائياً كلما أُضيف دليل جديد (`Evidence Updated → Profile Recomputed`) — بدل إعادة تحليل كل شيء من الصفر في كل مرة تبحث فيها شركة عن مرشح.

---

## 9. تكامل GitHub وتحليل المشاريع

GitHub هو أحد أهم مصادر الأدلة في QUDRA (المصدر الأساسي في الـ MVP).

```
GitHub → Repositories → Repository Analysis → Project Evidence → Skills → Capability Profile
```

**ما يحلله الذكاء الاصطناعي فعلياً** (وليس مجرد "عنده Repository اسمه X"):

- **Project Identity**: ما المشروع فعلياً؟
- **Technology Stack**: ما التقنيات المستخدمة؟
- **Complexity**: بسيط/متوسط/متقدم؟
- **Code Quality**: هل الكود منظم؟
- **Architecture**: هل توجد بنية واضحة؟
- **Testing**: هل توجد اختبارات؟
- **Documentation**: هل المشروع موثّق؟
- **Implementation**: تنفيذ حقيقي أم Prototype فقط؟
- **Engineering Evidence**: هل يدل فعلاً على امتلاك المهارة المدّعاة؟

عند إضافة Repository جديد، يعاد التحليل تلقائياً: `New Repository → Sync → Analyze → Compare → Update Evidence → Update Profile`.

**مصادر أدلة مستقبلية** (خارج MVP): Hack The Box، LeetCode، Codeforces، Kaggle، ومنصات تحديات تقنية أخرى — الهدف دائماً تحويل النشاط الخارجي إلى Evidence قابل للاستخدام، وليس مجرد تجميع روابط (QUDRA ليست Aggregator of Profiles).

---

## 10. المطابقة القابلة للتفسير (Explainable Matching)

المطابقة **ليست** مجرد "حسين 92%" وخلاص. يجب أن يعرف الباحث *لماذا*:

```
Match Score: 91%

لماذا؟
✓ 6 مشاريع ذات صلة
✓ 4 مشاريع Backend
✓ 2 نظام شبيه بالإنتاج (production-like)
✓ دليل GitHub
✓ مشكلة مشابهة تم حلها سابقاً
✓ دليل على تطوير APIs

Skill Gap:
△ Speech Processing
```

المطابقة لا تبحث عن أعلى مهارة منفردة، بل تحسب **Relevance to the Problem** (الصلة الفعلية بالمشكلة المطروحة)، مع مراعاة أن أفضل حل قد يكون **فريق** وليس شخصاً واحداً (`Best Individual` أو `Best Team` أو `Human + AI Solution` — الأخيرة رؤية مستقبلية).

---

## 11. Skill Gap (فجوة المهارة)

QUDRA لا يكتفي بـ"مناسب / غير مناسب"، بل يجيب: **"ما الذي ينقصك؟"**

### للفرد (Skill Gap شخصي)
```
Current Capability:
Frontend       █████████ 90%
React          ████████  80%
Backend        ████      40%
Databases      ███       30%

Target: Full Stack Developer

Gap:
Backend Architecture
REST APIs
Database Design
Authentication
Deployment

Roadmap:
1. REST APIs
2. Backend Architecture
3. Database Design
4. Authentication
5. Deployment
6. Build Project
7. Verification
```

### للشركة (Skill Gap عن المرشح)
```
حسين مناسب جداً للمشروع.

Strong: Frontend, React, TypeScript, UI
Gap: Backend, Speech Processing

⇒ هذا الشخص قوي في X، لكنه يحتاج شخصاً آخر لـ Y (يقود إلى Solution/Team Composer المستقبلي)
```

---

## 12. Core Loop لكل طرف

### Company (صاحب المشكلة)
```
Problem → Analyze → Required Capabilities → Candidates → Evidence → Explainability → Skill Gap → Select
```

### Talent (صاحب القدرة)
```
Join → Connect Evidence → Analyze → Intelligence Profile → Skills → Gaps → Opportunities
```

### Intelligence (المحرك الداخلي)
```
Problem → Required Capability → Evidence → Capability Score → Confidence → Matching
```

---

## 13. الـ MVP الرسمي (أولويات P0–P3)

> **قاعدة صارمة**: لا يُوسَّع نطاق الـ MVP من تلقاء نفس الوكيل. الأولويات التالية ملزمة وليست ترتيباً استرشادياً.

### P0 — يجب تنفيذه (لا MVP بدونها)
1. Capability Profile
2. Project Evidence
3. GitHub Evidence
4. AI Problem Analyzer
5. Explainable Matching
6. Evidence-based Ranking

### P1 — إذا توفر الوقت
7. Practical Challenge
8. Skills Gap
9. AI Interview
10. External Evidence

### P2 — بعد اكتمال MVP
11. Company Challenges
12. Solution Composer
13. Mini Project Workspace
14. Evidence Loop الكامل (تلقائي بالكامل)

### P3 — توسع مستقبلي بعيد
15. Market & Feasibility Analysis
16. Competitive Research
17. Revenue Intelligence
18. Startup Project Brief
19. AI/Human Work Decomposition
20. Freelance / Jobs / Grants / Hackathons Ecosystem

---

## 14. User Flows ولحظة الـ Wow

### Talent Flow
```
Register → Connect Evidence → Analyze → Capability Profile → Evidence → Skills → Skill Gap → Challenges
```

### Company Flow
```
Create Problem → AI Problem Analysis → Required Capabilities → Search → Explainable Ranking → Candidate Profile → Compare
```

### Wow Moment (اللحظة التي يجب أن يشعر فيها المستخدم بقيمة المنتج فعلياً)
```
Company enters real problem
→ AI analyzes it
→ Required Capabilities appear
→ QUDRA searches Profiles
→ best candidates appear
→ candidate opens
→ Evidence appears
→ explanation shows WHY
→ gap is visible
```

**أقوى Demo ليس عدد الشاشات، بل إثبات هذه الحلقة الكاملة** (راجع القسم 23).

---

## 15. الهوية البصرية

**المرجع النهائي الوحيد للتصميم الحالي هو `prototype.html` و `design-system.html` — ثابت، لا يُعاد تصميمه في B0/B1.**

### الخطوط (من design-system.html — تحقّق دائماً من الكود الفعلي، لا تفترض من هذا الجدول وحده)
| الاستخدام | الخط |
|---|---|
| Display (العناوين الكبيرة) | Readex Pro (400/500/700) |
| Body (النص الأساسي) | IBM Plex Sans Arabic (400/500/600/700) |
| Mono (بيانات: تواريخ، درجات، أكواد، معرّفات) | IBM Plex Mono (400/500) |

> **القاعدة الحاكمة**: الكود الفعلي في `design-system.html`/`prototype.html` يتفوق دائماً على أي وصف نصي عنه، حتى لو كان الوصف في هذا الملف بالذات. عند التنفيذ، افتح الملفين فعلياً واستخرج قيم `font-family` الحرفية بدل الاعتماد على هذا الجدول وحده.

### الألوان (توكنز مستخرجة مباشرة من الكود الفعلي في prototype.html)

**Dark Mode:**
```css
--accent: #00B8B8       /* تركوازي أساسي — Proven/Verified */
--accent-2: #39D6D6      /* تركوازي فاتح */
--gapc: #FFC107          /* أصفر — Gap/Missing/Attention (ليس خطأً أبداً) */
--danger: #F08379        /* أحمر — أخطاء فعلية فقط، لا يُستخدم للـ Gap */
```

### دلالات اللون (قاعدة صارمة لا تُخالف)

| اللون | الدلالة | ممنوع استخدامه لـ |
|---|---|---|
| تركوازي (Teal) | مُثبت / متحقق منه / مكتمل / دليل | الفجوات (Gaps) |
| أصفر (Yellow) | ناقص / فجوة / يحتاج انتباه | الأخطاء الفعلية |
| أحمر (Red) | أخطاء حقيقية / إجراءات هدّامة فقط | مجرد نقص مهارة |

### الشعار
موجود في `/assets/`: `qudra-icon.png`, `qudra-icon.webp` (أيقونة)، `qudra-mark.svg` (شعار فاتح)، `qudra-mark-dark.svg` (شعار للخلفية الداكنة).

### Design Research (مصادر إلهام بصري مستقبلية فقط — ليست للتصميم الحالي)
عند تطوير **مزايا جديدة مستقبلاً** (بعد B1)، يمكن استلهام أفكار حركة/تفاصيل بصرية إضافية (وليس إعادة تصميم) من: [21st.dev](https://21st.dev)، [refero.design/styles](https://refero.design/styles)، [supahero.io](https://supahero.io)، [motion.dev](https://motion.dev)، [60fps.design](https://60fps.design). **هذه مصادر إلهام فقط وليست مصادر حقيقة للمنتج، ولا تنطبق على التصميم الحالي إطلاقاً.**

---

## 16. الهيكل التقني والمعمارية

### التقنية الأساسية
- **React** (أحدث نسخة مستقرة) + TypeScript (strict mode)
- **Vite** كأداة بناء
- **React Router** للتوجيه
- **CSS Modules** + CSS Custom Properties (توكنز) — **بدون** Tailwind/Bootstrap/MUI/Chakra/Ant Design أو أي مكتبة UI جاهزة عامة

### مبدأ المعمارية: بُنية اليوم يجب ألا تحتاج إعادة كتابة غداً

**B0:**
```
UI → Service Layer → Typed Mock Data
```

**B1+:**
```
UI → Service / Repository Boundary → API → Backend → Database / AI / Integrations
```

**لا تربط الـ UI مباشرة بمصدر البيانات أبداً**، حتى في B0.

للتفاصيل الكاملة (بنية المجلدات، مواصفات كل مكوّن، قواعد RTL، الوصولية، إلخ) → راجع **`قواعد.md`** و**`QUDRA_FINAL_BOLT_PROMPT.md`** كمرجعين هندسيين تفصيليين ملزمين.

---

## 17. مراحل المشروع (Roadmap)

| المرحلة | الهدف | الحالة |
|---|---|---|
| **Pre-B0** | التوثيق الكامل + `prototype.html` + `design-system.html` | ✅ مكتمل |
| **B0** | React reconstruction + demo data + Mock Services (بدون Backend حقيقي) | 🔵 قيد البدء |
| **B1** | Core Intelligence + Backend حقيقي (Authentication، قاعدة بيانات، Endpoints) | ⚪ لم يبدأ |
| **B2** | Evidence Integrations + محرك تقييم الأدلة الحقيقي (Scoring، Weights، Decay) | ⚪ لم يبدأ |
| **B3** | Productization + تكامل GitHub الحقيقي + محرك مطابقة حقيقي | ⚪ لم يبدأ |
| **B4** | Intelligence Expansion (راجع القسم 21) | ⚪ رؤية بعيدة المدى |

**B0 لا يخترع Backend حقيقياً أو Auth حقيقياً أو APIs خارجية لمجرد إكمال الشكل.**

---

## 18. حالة المشروع الحالية

> **يُحدَّث هذا القسم من قبل الوكيل بعد كل مهمة منجزة، حسب البروتوكول الموصوف في `قواعد.md` وقسم التتبع في `QUDRA_FINAL_BOLT_PROMPT.md`.**
> السجل التفصيلي للمهام موجود في `TASKS.md`. آخر حالة معروفة وقت كتابة هذا الملف: **مرحلة ما قبل التنفيذ (Pre-B0)** — التوثيق مكتمل، لم يبدأ التنفيذ الفعلي في Bolt بعد.

---

## 19. Definition of Done

لا تُعتبر أي Feature منتهية إلا بعد التحقق من:

- Implementation
- States (loading/empty/error)
- Integration مع باقي النظام
- Typecheck (TypeScript strict = 0 errors)
- Lint (0 blocking errors)
- Build ناجح
- Functional testing
- Responsive (mobile/tablet/desktop)
- Accessibility
- Security review
- Regression (لم تكسر ميزة كانت تعمل سابقاً)
- Admin/User verification فعلي
- Documentation محدَّثة (TASKS/STATUS/CHANGELOG/DECISIONS/PROJECT_MAP)

**إذا تعذّر اختبار شيء، الحالة تكون `DONE_UNVERIFIED` وليس `VERIFIED`.** لا يجوز الادّعاء بأن شيئاً "تم التحقق منه بنسبة 100%" أو "جاهز للإنتاج" بدون دليل فعلي موثّق في `TEST_REPORT.md`.

---

## 20. هيكل ملفات المشروع

```
/
├── README.md                     ← هذا الملف (مصدر الحقيقة لفكرة المنتج)
├── قواعد.md                       ← القواعد الهندسية الملزمة (المرجع التفصيلي)
├── QUDRA_FINAL_BOLT_PROMPT.md      ← تعليمات التنفيذ الكاملة (يُلصق في Bolt)
├── SKILLS.md                       ← المهارات الواجب فحصها/تحميلها قبل أي مهمة
├── AGENTS.md                       ← نقطة دخول موجزة للوكيل (تشير لبقية الملفات)
├── dev-handoff.md                  ← عقد الـ Backend: Endpoints + قاعدة البيانات + الأوزان
├── prototype.html                  ← المرجع البصري/التفاعلي النهائي (لا يُعدَّل، يُقرأ فقط)
├── design-system.html              ← التوكنز والمكونات القياسية (يُقرأ فقط)
├── PROJECT_MAP.md                   ← خريطة تفصيلية لكل ملف كود: ماذا يفعل وكيف يرتبط بالباقي
├── assets/
│   ├── qudra-icon.png / .webp
│   ├── qudra-mark.svg               (نسخة فاتحة)
│   └── qudra-mark-dark.svg          (نسخة للخلفية الداكنة)
├── TASKS.md                        ← سجل المهام الحي (Living Log) بالتفصيل
├── STATUS.md                       ← ملخص الحالة الحالية السريع
├── DECISIONS.md                     ← سجل القرارات الهندسية المتخذة وسببها
├── CHANGELOG.md                     ← سجل التغييرات لكل نسخة/مهمة
├── TEST_REPORT.md                   ← نتائج فحص الأدمن بعد كل إضافة
├── .memory/
│   ├── decisions.md                  ← تفاصيل قرارات معمارية دقيقة
│   ├── glossary.md                    ← قاموس مصطلحات QUDRA (Evidence, Capability...)
│   ├── notes.md                        ← ملاحظات عمل متفرقة
│   └── tasks/YYYY-MM-DD_<TASK-ID>.md   ← سجل تفصيلي لكل مهمة (Goal/Context/Skills/Tests/Verification)
└── docs/archive/                    ← الملفات القديمة (مسودات، نسخ سابقة) — مرجع تاريخي فقط، لا تُقرأ من الوكيل
```

---

## 21. الرؤية المستقبلية (خارج نطاق B0-B1)

هذه أفكار **موثقة كرؤية**، لكنها **ليست جزءاً من الـ Core الحالي** ويجب عدم تنفيذها إلا عند اتخاذ قرار صريح بالانتقال إليها (راجع P2/P3 في القسم 13):

- **Oral Evidence**: مقابلة صوتية تكيّفية بالذكاء الاصطناعي، تُبنى أسئلتها بناءً على نقاط قوة/ضعف ملف المستخدم الفعلي (Adaptive AI Interview)
- **Practical Challenge**: تحدٍّ عملي حقيقي بدل سؤال نظري، يُحلَّل تنفيذه وجودته كدليل جديد
- **Company Challenges**: الشركات تنشئ تحديات حقيقية بدل الوظائف التقليدية
- **AI Solution / Solution Composer**: اقتراح تشكيلة فريق (بشر + AI) بدل شخص واحد فقط
- **Mini Project Workspace**: بيئة عمل مصغّرة لتنفيذ المشروع بعد المطابقة، تُغذّي نتيجتها الـ Evidence Loop
- **Capability Graph**: شبكة مترابطة تصل بين Person ↔ Skills ↔ Evidence ↔ Projects ↔ Challenges ↔ Companies ↔ Outcomes
- **Market & Feasibility / Project Intelligence**: تحليل جدوى فكرة مشروع (سوق، منافسون، نموذج عمل، إيرادات متوقعة) — تم استبعادها عمداً من الـ Core الحالي لأنها منتج مختلف تقريباً؛ السؤال الجوهري لـ QUDRA يبقى "من يستطيع حل المشكلة؟" وليس "هل هذه الفكرة Startup جيدة؟"
- **External Challenge Integration**: Hack The Box، LeetCode، Codeforces، Kaggle
- **Freelance / Jobs / Grants / Hackathons Ecosystem**: منظومة فرص أوسع حول نفس البنية التحتية للأدلة

---

## 22. كيف تبدأ العمل على هذا المشروع (للوكيل)

**قبل أي سطر كود، اتبع هذا الترتيب حرفياً:**

1. اقرأ `AGENTS.md` أولاً — نقطة الدخول التي تحدد ترتيب كل شيء آخر.
2. اقرأ هذا الملف (`README.md`) كاملاً لفهم فكرة المنتج.
3. اقرأ `قواعد.md` كاملاً — القواعد الهندسية ملزمة وليست اختيارية.
4. اقرأ `QUDRA_FINAL_BOLT_PROMPT.md` — تعليمات التنفيذ التفصيلية (Phases، Quality Gate بمعرّفات QG-01→QG-30).
5. افحص `SKILLS.md` وحمّل/فعّل المهارة المناسبة للمهمة المطلوبة (خصوصاً `find-skills` أولاً في كل مهمة، و`grill-me` عند أي غموض).
6. افتح `prototype.html` و `design-system.html` كمرجع بصري مباشر — لا تصف الشكل من الذاكرة، افتحهما فعلياً.
7. راجع `dev-handoff.md` لفهم عقد البيانات المستقبلي حتى عند استخدام Demo Data.
8. تحقق من `TASKS.md`، `STATUS.md`، و`PROJECT_MAP.md` لمعرفة آخر نقطة توقف فعلية وأين توجد كل ميزة موجودة بالفعل.
9. **إذا كان أي شيء غير موثّق بوضوح في الملفات أعلاه → توقف واسأل حسين مباشرة. لا تخترع، لا تفترض.**
10. بعد إنجاز أي مهمة → اتبع بروتوكول التوثيق والفحص كأدمن الموصوف في `قواعد.md` و`QUDRA_FINAL_BOLT_PROMPT.md` قبل الانتقال للمهمة التالية، بما في ذلك تحديث `PROJECT_MAP.md`.

---

## 23. مقياس النجاح

أقوى Demo ليس عدد الشاشات، بل إثبات الحلقة الكاملة:

```
Real Problem
→ Required Capabilities
→ Evidence
→ Best Match
→ Explainable Result
→ Skill Gap
```

إذا كانت هذه الحلقة تعمل بأمانة كاملة (حتى ببيانات Demo)، فإن B0 نجح في مهمته الحقيقية — إظهار جوهر QUDRA، وليس مجرد واجهة جميلة بلا منطق.
