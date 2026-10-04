# QUDRA — FINAL BOLT PROMPT
## الإصدار النهائي التنفيذي — v1.2 (النسخة المعتمدة الوحيدة)
## الهدف: بناء B0 من الـprototype بأمانة، مع أساس قابل للتوسع

> **ملاحظة تصحيح النسخة:** هذه هي النسخة النهائية المعتمدة، وتلغي أي نسخة سابقة (v1.0 أو v1.1) بشكل كامل. التعديلات المتراكمة عن المسودات السابقة: (1) شرط تنفيذ فعلي واضح لـSkill Discovery عبر أوامر `npx skills` حقيقية (بدل افتراض توفر Web Access غير مضمون)، (2) إزالة تناقض داخلي في قسم الخطوط بحيث لا يُفترض أي اسم خط دون تحقق من الكود الفعلي، (3) ترقيم كل بند في Quality Gate بمعرّف QG-XX قابل للتتبع، (4) إضافة قسم 0.5 لسد الفجوة الزمنية قبل قراءة الملفات الرسمية، (5) إضافة إلزامية `PROJECT_MAP.md` وتعليقات الكود المرجعية (القسم 35 وQG-29/QG-30).
>
> **أي نسخة أخرى من هذا الملف تحمل اسماً مشابهاً (`_v1_1`، بدون رقم إصدار، إلخ) موجودة في `docs/archive/` كمرجع تاريخي فقط — هذه النسخة وحدها هي المعتمدة للتنفيذ.**

> **هذه الرسالة هي تعليمات التنفيذ الخاصة بـ Bolt.**
>
> **لا تفترض. لا تخترع. افحص الموجود أولاً. استخدم Find-Skills قبل التنفيذ. استخدم Grill-Me عند الغموض. نفّذ بأبسط بنية قابلة للتوسع، ثم اختبر كالمستخدم، وتحقق كأدمن، ووثّق كل شيء قبل إعلان الإنجاز.**

---

# 0. EXECUTION CONTRACT — اقرأ هذا أولاً

أنت تعمل كـ:

**Principal Full-Stack Software Architect + Senior React Engineer + UX Engineer + Design-System Engineer + Product Engineer.**

اعمل بعقلية مهندس Production حقيقي، وليس مولد واجهات.

مهمتك الحالية:

> **إعادة بناء QUDRA `prototype.html` كتطبيق React/TypeScript نظيف وقابل للصيانة، مطابق بصرياً وتفاعلياً للـprototype، دون Redesign أو اختراع Features، مع Architecture جاهزة للنسخ القادمة.**

**لا تبدأ بكتابة الكود قبل تنفيذ الـPreflight التالي.**

---

# 0.5 — البروتوكول اللحظي قبل قراءة أي ملف (Bootstrap Gate)

قبل حتى الانتقال للقسم 1، طبّق هذا التسلسل الثابت الذي لا يحتاج ملفات خارجية ولا أدوات:

```text
1. هل الطلب الحالي واضح 100% بدون أي افتراض ضمني؟
   → إذا نعم: انتقل للقسم 1 مباشرة.
   → إذا لا: توقف هنا فوراً.

2. إذا توقفت، اطرح 3-5 أسئلة استقصائية متتابعة (نفس منهجية Grill-Me
   الموصوفة في SKILLS.md) قبل أي قراءة أخرى — حتى قبل قراءة README.md.
   هذه هي الشبكة الأولى التي تمنع أي افتراض من أن يتسلل قبل أن تبدأ
   حتى عملية القراءة الرسمية في القسم 1.

3. لا تعتبر "الفكرة عندي واضحة من الاسم" إجابة كافية. مثال: لو طُلب
   منك "أضف صفحة Compare"، لا تفترض شكلها — اسأل: أين تظهر؟ من يدخل
   إليها؟ ما مصدر بياناتها الآن؟ هل موجودة في prototype.html أصلاً؟
```

هذا القسم موجود لسد الفجوة الزمنية بين لحظة استلام الطلب ولحظة قراءة SKILLS.md كاملاً (القسم 2 أدناه) — فلا تدخل في القسم 1 وأنت تحمل افتراضاً لم تُسائله بعد.

---

# 1. PRE-FLIGHT — يجب تنفيذه قبل أول سطر كود

اقرأ هذه الملفات الموجودة في المشروع:

```text
AGENTS.md
README.md
قواعد.md
SKILLS.md
STATUS.md
TASKS.md
DECISIONS.md
CHANGELOG.md
TEST_REPORT.md
PROJECT_MAP.md
prototype.html
design-system.html
dev-handoff.md
```

**ملاحظة عن `PROJECT_MAP.md`:** إذا لم يكن هذا الملف موجوداً بعد (بداية المشروع)، أنشئه فارغاً بهيكل أولي بسيط (عنوان + جدول محتويات فارغ) في أول Task تكتب فيه أي كود. من تلك اللحظة فصاعداً هو ملف إلزامي يُحدَّث مع كل ملف جديد أو مُعدَّل — راجع القسم 35 لمعرفة الصيغة الدقيقة المطلوبة لكل إدخال فيه.

إذا وجدت ملفات أخرى مرتبطة بالمشروع:
- افحصها قبل اتخاذ قرار قد يتأثر بها.
- لا تحذفها.
- لا تستبدلها لمجرد أنها قديمة.
- حدّد إن كانت Current Source أو Historical Reference.

ثم افحص:
- package.json إن وجد.
- src/ إن وجد.
- assets.
- existing routes.
- existing components.
- existing configuration.
- existing tests.

**أعد استخدام الموجود المناسب. لا تعِد بناء الموجود بلا سبب.**

---

# 2. SKILL DISCOVERY — MANDATORY

قبل تنفيذ B0، وقبل **كل Task لاحق**:

```text
Understand Task
→ Inspect Project
→ Find-Skills
→ Select relevant skills
→ Activate/load when supported
→ Execute
```

ابحث عن Skills من:

- Command Code Skills: https://commandcode.ai/skills
- Skills.sh: https://www.skills.sh/
- Awesome Skill: https://awesomeskill.ai/

## شرط التنفيذ الفعلي — اقرأ قبل أي محاولة

**Bolt.new يملك Terminal فعلياً وينفذ أوامر `npx` بشكل حقيقي — هذا ليس افتراضاً، هذه قدرة موثقة.** استخدم الأوامر الفعلية أدناه (وليس تصفح الروابط كصفحات ويب فقط):

```bash
# البحث عن مهارة مناسبة للمهمة الحالية:
npx skills find <keyword-مشتق-من-طبيعة-المهمة>

# مثال عملي: تبني الآن مكون Ring (SVG donut):
npx skills find svg animation

# مثال عملي: تكتب RTL layout:
npx skills find rtl
npx skills find "css logical properties"

# تثبيت مهارة بعد العثور عليها:
npx skills add <owner>/<repo> --skill <skill-name> --agent claude-code
```

```text
IF (أمر npx skills نجح فعلياً في الـTerminal):
    → اقرأ نتيجة البحث الفعلية.
    → قيّم وثبّت المهارة الأنسب فعلياً عبر npx skills add.
    → استخدم محتواها في تنفيذ المهمة.
ELSE (فشل الأمر لأي سبب — بيئة لا تدعم npx، مشكلة شبكة، إلخ):
    → لا تتظاهر بأنك بحثت أو ثبّتت شيئاً لم يحدث فعلياً.
    → سجّل سبب الفشل صراحة في تقرير المهمة.
    → انتقل مباشرة لاستخدام `SKILLS.md` المحلي كمرجع كافٍ ونهائي.
```

**هذا الشرط غير قابل للتجاوز.** الادّعاء بتنفيذ أمر أو تثبيت مهارة لم يحدث فعلياً هو انتهاك مباشر لقاعدة "NO FALSE COMPLETION" (قسم 39).

## إلزامي

`find-skills` ليست ميزة اختيارية — لكنها مشروطة بتوفر الأداة كما هو موضح أعلاه.

يجب استخدامها لتحديد Skills الأنسب **للمهمة الحالية** عندما تكون متاحة.

لا تحمل عشرات المهارات بلا حاجة.

قيّم:
- relevance.
- quality.
- compatibility.
- maintenance/recency عند توفرها.
- security/audit signals عند توفرها.

## Grill-Me

استخدم Grill-Me عندما يبقى غموض مؤثر بعد قراءة الملفات.

المصدر:
https://awesomeskill.ai/skill/julianoczkowski-designer-skills-grill-me

البروتوكول:
1. افحص المشروع أولاً.
2. لا تسأل عن شيء موثق.
3. اسأل 3–5 أسئلة متتابعة في الجولة.
4. اجعل كل جولة مبنية على الإجابات السابقة.
5. لا تنفذ قراراً منتجياً/معمارياً مهماً غير محسوم.
6. بعد الحسم، سجّل القرار في `DECISIONS.md` أو `.memory/decisions.md`.

إذا لم تكن Skill قابلة للتحميل في بيئة Bolt، أو لم تكن أداة Grill-Me نفسها قابلة للتفعيل الفعلي:
- لا تتظاهر بأنها محملة أو مفعّلة.
- سجّل ذلك صراحة في تقرير المهمة.
- طبّق **نفس منهجية الاستقصاء** يدوياً بالاعتماد على القسم `2. grill-me` في `SKILLS.md` — فهو يحتوي البروتوكول الكامل (3-5 أسئلة متتابعة، مبنية على الإجابة السابقة، بدون قائمة جاهزة) بغض النظر عن نجاح تحميل الأداة الخارجية.
- لا يُعفيك عدم توفر الأداة الخارجية من واجب الاستقصاء نفسه — الأداة وسيلة، والمبدأ (لا تفترض، لا تخترع) هو الإلزام الحقيقي.

## أمر التثبيت الفعلي (نفّذه فعلياً عبر الـTerminal المتاح في Bolt)

الأداة الحقيقية هي `skills` من Vercel Labs — تُستخدم عبر `npx` مباشرة، وBolt.new يملك Terminal ينفذ أوامر npx فعلياً. هذا ليس افتراضاً — هذه أوامر حقيقية موثقة:

```bash
# تثبيت مهارة Grill Me (الاستقصاء العميق قبل التنفيذ):
npx skills add julianoczkowski/designer-skills --skill grill-me --agent claude-code

# أو المصدر البديل الموثق لنفس المهارة:
npx skills add https://github.com/mattpocock/skills --skill grill-me

# البحث التفاعلي عن مهارة مناسبة للمهمة الحالية (بدل تصفح الموقع يدوياً):
npx skills find <keyword>
# مثال: npx skills find react
# مثال: npx skills find typescript
# مثال: npx skills find accessibility

# عرض المهارات المتاحة داخل مستودع معيّن قبل التثبيت:
npx skills add <owner>/<repo> --list

# تثبيت مهارة محددة من مستودع معروف:
npx skills add <owner>/<repo> --skill <skill-name>

# عرض المهارات المثبتة حالياً في هذا المشروع:
npx skills list
```

**نفّذ الأمر الأول (`grill-me`) فعلياً في بداية المشروع، قبل أي كتابة كود، عبر الـTerminal.** إذا نجح التنفيذ، تعامل مع المهارة كمفعّلة. إذا فشل الأمر (خطأ شبكة، بيئة لا تدعم npx، إلخ)، سجّل الفشل صراحة وطبّق المنهجية يدوياً كما هو موضح في `SKILLS.md`.

---

# 3. SOURCE OF TRUTH — ترتيب غير قابل للتجاهل

عند اتخاذ أي قرار:

```text
1. prototype.html
2. design-system.html
3. README.md
4. قواعد.md
5. dev-handoff.md
6. QUDRA_FINAL_BOLT_PROMPT.md
7. Engineering best practices
```

ملاحظة:
- `prototype.html` هو المرجع النهائي للـUI والـinteraction للشاشات الموجودة.
- `design-system.html` هو المرجع النهائي للتوكنز والمكونات.
- `README.md` هو المرجع النهائي لفكرة المنتج والنطاق والمراحل.
- `قواعد.md` هو المرجع الهندسي.
- `dev-handoff.md` هو العقد المستقبلي للـBackend/Data.

إذا تعارض مصدران:
1. لا تخترع حلاً وسطاً.
2. استخدم المصدر الأعلى.
3. سجّل التعارض.
4. إذا كان القرار غير قابل للحسم من المصادر، توقف واسأل.

---

# 4. PRODUCT — افهم ماذا تبني

QUDRA:

> **Evidence-Based Capability Matching**

المعادلة:

```text
Problem
→ Required Capabilities
→ Evidence
→ Capability Profile
→ Explainable Match
→ Real Work
→ Outcome
→ New Evidence
```

القيمة:

> **من الكلام إلى الدليل، ومن الدليل إلى الحل.**

QUDRA ليست:
- Job Board.
- CV Builder.
- Generic Recruitment Tool.
- Generic Freelancing Marketplace.
- Generic AI Recruiter.

## المستخدمون

### Problem Owner
شركة/مؤسسة/صاحب مشكلة.

### Talent
Developer / Designer / AI Engineer / Cybersecurity / Technical Talent.

### Project Seeker
مستخدم يبحث عن مشروع/فرصة.

---

# 5. MVP — لا توسّع النطاق من نفسك

## P0

- Capability Profile.
- Project Evidence.
- GitHub Evidence.
- AI Problem Analyzer.
- Explainable Matching.
- Evidence-based Ranking.

## P1

- Practical Challenge.
- Skill Gap.
- AI Interview.
- External Evidence.

## P2

- Company Challenges.
- Solution Composer.
- Mini Project Workspace.
- Evidence Loop الكامل.

## P3

- Market/Feasibility.
- Competitive Research.
- Revenue Intelligence.
- Startup Project Brief.
- AI/Human Work Decomposition.
- Jobs/Freelance/Grants/Hackathons ecosystem.

**لا تنفذ P1/P2/P3 كميزات حقيقية في B0 إلا إذا كانت موجودة فعلياً في prototype ضمن تدفق الـdemo الحالي.**

لا تضف:
- Payments.
- Full marketplace.
- Chat system كامل.
- Massive scraping.
- Custom AI model from scratch.
- أي Feature جديدة من خيالك.

---

# 6. B0 MISSION

نفّذ B0 بهذا الترتيب:

```text
Foundation
→ Design System
→ Types
→ Demo Data
→ Context/State
→ Services
→ UI Components
→ Domain Components
→ Layout
→ Overlays
→ Routing
→ Pages
→ Polish
→ QA
→ Documentation
```

الهدف هو أن تصبح نسخة الـprototype تطبيق React حقيقياً.

**لا تكتفِ بصفحة Landing.**

---

# 7. TECH STACK

استخدم Stack متوافقاً مع المشروع والـprototype:

- React + TypeScript.
- Vite.
- React Router.
- CSS Modules.
- CSS Custom Properties.
- Vitest.
- React Testing Library.
- ESLint + typescript-eslint.

## Styling

ممنوع:
- Tailwind.
- Bootstrap.
- MUI.
- Chakra.
- Ant Design.
- generic UI kit.

## Fonts

**لا تفترض الخطوط من أي مستند نصي — لا من BRD، ولا حتى من هذا الملف نفسه.**

الإجراء الإلزامي الوحيد:
1. افتح `design-system.html` فعلياً وابحث عن كل `font-family` declaration.
2. افتح `prototype.html` فعلياً وتحقق من تطابقه مع design-system.
3. استخرج القيم الحرفية الفعلية الموجودة في الكود — وليس أي اسم خط مذكور في أي وثيقة نصية أخرى بما فيها هذا الملف.
4. إذا وجدت القيم الفعلية تطابق: Readex Pro / IBM Plex Sans Arabic / IBM Plex Mono — استخدمها لأنها موجودة فعلياً في الكود، وليس لأن هذا الملف ذكرها.
5. إذا وجدت قيماً مختلفة عمّا هو مذكور في أي وثيقة نصية (بما فيها هذا الملف) — التزم بما هو موجود فعلياً في `design-system.html`/`prototype.html` دون استثناء، وسجّل الفرق في `DECISIONS.md`.

**القاعدة الحاكمة: الكود الفعلي دائماً يتفوق على أي وصف نصي عنه، حتى لو كان الوصف في هذا المستند بالذات.**

---

# 8. ARCHITECTURE

استخدم Feature/Domain-oriented architecture.

```text
src/
├── app/
├── pages/
├── features/
├── components/
│   ├── layout/
│   ├── ui/
│   ├── domain/
│   └── overlays/
├── services/
├── contexts/
├── hooks/
├── types/
├── data/
├── lib/
├── constants/
└── styles/
```

## المبدأ

```text
UI → Service Boundary → Data/API
```

B0:
```text
UI → Mock Services → Typed Demo Data
```

B1+:
```text
UI → Services/Repositories → API → Backend → DB/AI/Integrations
```

الهدف:
**استبدال Mock Service بالـAPI لاحقاً دون إعادة كتابة UI.**

---

# 9. FILE STRUCTURE

حافظ على البنية الموجودة في `قواعد.md`، ومنها:

```text
src/app/
src/pages/
src/features/
src/components/layout/
src/components/ui/
src/components/domain/
src/components/overlays/
src/services/api/
src/services/ai/
src/services/storage/
src/contexts/
src/hooks/
src/types/
src/data/
src/lib/
src/constants/
src/styles/
```

لا تضع التطبيق كله في `App.tsx`.

لا تجعل Page عملاقة.

إذا زاد الملف تعقيداً، استخرج المسؤوليات إلى ملفات واضحة.

---

# 10. DESIGN RECONSTRUCTION — أهم جزء

**هذا Reconstruction وليس Redesign.**

افتح `prototype.html` و`design-system.html` فعلياً واستخرج:

- exact colors.
- exact tokens.
- spacing.
- radii.
- shadows.
- typography.
- breakpoints.
- component dimensions.
- states.
- animations.
- responsive behavior.
- navigation.
- modal behavior.
- command palette.
- dark mode.
- RTL.

لا تستبدل التصميم بـ"نسخة أجمل" من وجهة نظرك.

**إذا كان prototype فيه قرار تصميمي غريب، طبّقه كما هو.**

---

# 11. PROVEN VS CLAIMED — NON-NEGOTIABLE

هذا قلب QUDRA.

```typescript
type TagVariant = 'proven' | 'claimed';
```

### Proven

- solid border.
- turquoise.
- evidence counter.
- يدل على Evidence.

### Claimed

- dashed border.
- muted.
- بدون evidence counter.
- يدل على self-claim.

ممنوع دمجهما.

يجب الحفاظ على الفرق في:
- Profiles.
- Candidates.
- Matching.
- Comparison.
- Evidence.
- Capability DNA.
- Skill Gap.

---

# 12. COLOR SEMANTICS

```text
Teal    = Proven / Verified / Complete
Yellow  = Gap / Missing / Attention
Red     = Real Error / Destructive Action
```

ممنوع:
- Red للـSkill Gap.
- Yellow للأخطاء.
- Teal للـGap.

---

# 13. TYPOGRAPHY + NUMBERS

الأرقام والنسب والـscores في RTL يجب عزلها:

```text
className="num"
```

وتكون:
- tabular numbers.
- direction: ltr.
- unicode-bidi: isolate.

التواريخ والروابط وIDs/code:
```text
className="mono"
```

لا تكتب أرقاماً RTL بطريقة تكسر ترتيبها.

---

# 14. RTL FIRST

استخدم:

```css
padding-inline
margin-inline
inset-inline
border-inline-start
border-inline-end
```

ممنوع اعتماد:
```css
padding-left/right
margin-left/right
```

للـlayout.

اختبر:
- arrows.
- chevrons.
- timelines.
- steppers.
- cards.
- forms.
- navigation.

---

# 15. COMPONENT SYSTEM

ابنِ Components قابلة لإعادة الاستخدام.

## UI

- Button.
- Tag.
- Pill.
- Badge.
- Ring.
- Bar.
- Skeleton.
- EmptyState.
- ErrorState.
- LoadingState.

## Domain

- EvidenceCard.
- EvidenceList.
- CandidateCard.
- CapabilityCard.
- SkillTag.
- SkillGap.
- MatchScore.
- MatchExplanation.
- CapabilityDNA.
- CapabilityTimeline.
- RoadStep.
- ChallengeCard.
- ProofCard.
- ShareCard.

## Layout

- AppShell.
- TopBar.
- Stepper.
- SubNav.
- BottomNav.

## Overlays

- Modal.
- InviteModal.
- CmdPalette.
- StatePanel.
- ShareBox.

لا تجعل UI components تعتمد على منطق QUDRA.

---

# 16. ROUTES

استخدم constants/routes.ts.

المسارات:

```text
/
 /signup
 /login
 /onboarding/role
 /problem
 /capabilities
 /simulation
 /evaluation
 /skill-dna
 /matching
 /compare
 /candidates
 /candidates/:id
 /re-ranking
 /profile
 /profile/evidence
 /profile/opportunities
 /profile/passport
```

اجعل routes lazy-loaded.

دعم:
- direct URL.
- refresh.
- back.
- forward.
- deep links.

لا تكتب route strings عشوائياً داخل Components.

---

# 17. STATE

Shared cross-feature state فقط في Context.

```text
ThemeContext
RoleContext
ProblemContext
SimContext
```

لا تضع كل state في Context.

Local UI state يبقى محلياً.

---

# 18. SERVICE LAYER

كل data access يمر عبر Services.

مثال:

```typescript
getCandidates()
getCandidate(id)
getEvidence(userId)
analyzeProblem(description)
getMatches(problemId)
extractCapabilities(text)
```

في B0:
- services تستخدم typed demo fixtures.

في B1+:
- نفس interfaces تتصل بالـAPI.

Components لا تستورد من `data/`.

---

# 19. DEMO DATA

استخرج البيانات الموجودة في prototype إلى:

```text
demo-candidates.ts
demo-evidence.ts
demo-capabilities.ts
demo-tasks.ts
demo-reasons.ts
demo-dna.ts
demo-opportunities.ts
demo-commands.ts
```

لا تضع Demo Data داخل JSX.

كل البيانات typed.

---

# 20. AI ENGINEERING

أي AI Feature يجب أن تكون:

```text
Input Contract
→ System Instructions
→ Structured Output
→ Schema Validation
→ Retry
→ Fallback
→ Safe Error Handling
→ Safe Logging
→ Versioning
```

لا تجعل free-form AI text يتحكم مباشرة في business logic.

## Problem Analyzer

الـoutput يجب أن يدعم:

```text
goal
problem_statement
target_users[]
constraints[]
tasks[]
capabilities[]
roles[]
technologies[]
priorities[]
clarifying_questions[]
confidence
```

---

# 21. EVIDENCE MODEL

Evidence ليس نصاً فقط.

يجب أن يحتفظ بالمعلومات التي يدعمها المشروع مثل:

```text
source
source_url / source_id
type
title
skills
relevance
recency
difficulty
outcome
verification_status
confidence
metadata
analyzed_at
```

لا تقل `Verified` إلا إذا كانت هناك آلية تحقق.

الترتيب المفاهيمي:

```text
Company Challenge
>
Verified Practical Evidence
>
External Challenge
>
Outcome-backed Project
>
Certificate
>
Self-claim
```

لكن score النهائي يجب أن يأخذ في الاعتبار:
- relevance.
- recency.
- verification.
- difficulty.
- outcome.
- confidence.

---

# 22. MATCHING

المطابقة يجب أن تكون Explainable.

أي Score يجب أن يستطيع النظام تفسيره عبر:

```text
inputs
rules/weights
covered capabilities
evidence
gaps
confidence
explanation
```

لا تعرض Score وحيداً بلا تفسير.

---

# 23. UX STATES

كل Flow يحتوي:

```text
idle
loading
success
empty
validation error
system/API error
retry
```

## Loading
لا تستخدم Full-page Spinner كحل عام.

استخدم Skeleton يناسب الـlayout.

## Empty
اشرح:
1. ما الناقص.
2. لماذا يهم.
3. ماذا يفعل المستخدم.

## Error
- Field error inline.
- API error مع retry.
- System error قابل للإغلاق.
- الأحمر للأخطاء الحقيقية فقط.

---

# 24. ACCESSIBILITY

استهدف WCAG 2.2 AA.

يجب وجود:
- semantic HTML.
- keyboard navigation.
- visible focus.
- `aria-label` للأيقونات.
- modal focus trap.
- Escape لإغلاق modal.
- focus restoration.
- `aria-current` للـStepper.
- `aria-live` لتحديثات النتائج المهمة.
- reduced motion.
- labels واضحة.
- contrast مناسب.

---

# 25. RESPONSIVE

اختبر:
- mobile.
- tablet.
- desktop.
- 320px على الأقل كاختبار عدم وجود horizontal overflow.

حافظ على breakpoints الموجودة فعلياً في prototype/design-system.

لا تخترع responsive layout جديداً.

---

# 26. MOTION

Motion يخدم UX ولا يصبح هو UX.

إذا كان prototype يحتوي animation:
- طبّقه كما هو.
- حافظ على timing/easing قدر الإمكان من المرجع.
- استخدم `prefers-reduced-motion`.

لا تضف animations لمجرد الاستعراض.

---

# 27. SPECIAL INTERACTIONS

نفّذ السلوك الموجود فعلياً في prototype، بما في ذلك عند وجوده:

### Splash
- auto dismiss.
- click dismiss.
- session behavior.
- reduced-motion behavior.

### Simulation Timer
- countdown.
- pause when tab hidden.
- resume on visibility.
- cleanup.
- stop on submission.

### Challenge WOW
يجب الحفاظ على الـWOW sequence الموجودة في prototype:
- loading.
- score transition.
- evidence update.
- gap closed state.
- verdict update.

### Share Passport
- copy link.
- feedback مؤقت.
- الحفاظ على التصميم.

### Command Palette
- Ctrl+K / Cmd+K.
- Escape.
- arrows.
- Enter.
- fuzzy search.
- focus restoration.

**هذه ليست اقتراحات؛ هي behaviors يجب استخراجها من prototype وتنفيذها إذا كانت جزءاً منه.**

---

# 28. CLEAN CODE

ممنوع:

```text
giant App.tsx
giant page components
any
innerHTML
dangerouslySetInnerHTML غير الضروري
DOM state manipulation
document.querySelector لإدارة state
global mutable state
duplicate logic
magic numbers
business logic inside JSX
API calls inside presentational components
demo data scattered in components
unnecessary dependencies
premature abstraction
fake backend
```

مطلوب:

```text
Single Responsibility
DRY
Composition
Typed contracts
Named constants
Reusable components
Feature boundaries
Service abstraction
Testable logic
Small readable files
```

لا تستخدم abstraction فقط لكي تبدو المعمارية "احترافية". استخدمها عندما تحل مشكلة حقيقية.

---

# 29. SECURITY

بعد كل Module/Feature:

- auth.
- authorization.
- input validation.
- output validation.
- secrets.
- API permissions.
- dependency risk.
- information leakage.
- XSS/injection.
- external links.
- storage.

ممنوع وضع:
- API keys.
- service-role keys.
- secrets.
- private tokens

في frontend أو Git.

عند Backend/Supabase لاحقاً:
- Auth للهوية.
- RLS للصلاحيات.
- migrations versioned.
- authorization server/database-side.

---

# 30. GITHUB

MVP:
- public repositories أولاً حيث يكفي ذلك.
- explicit consent.
- least privilege.

Future:
- OAuth/GitHub App.
- webhooks.
- incremental analysis.

لا تدّعي تحليل repository إذا لم يتم جلب وتحليل البيانات فعلياً.

---

# 31. PERFORMANCE

فكّر في:

- lazy routes.
- bundle size.
- unnecessary renders.
- memoization بحكمة.
- API call count.
- debounce.
- pagination.
- caching.
- race conditions.
- cleanup.
- failure/retry.
- idempotency.

لا تضف chart library ضخمة إذا كان SVG/CSS كافياً.

---

# 32. CACHE / DEPLOYMENT

عند ظهور stale UI أو بعد deployment مهم:
- افحص Service Worker.
- assets.
- API cache.
- environment.
- auth/session.
- browser cache.

اختبر:
- normal session.
- hard refresh.
- clean session.

لا تعتبر "امسح الكاش" حلاً هندسياً دائماً إذا كان السبب invalidation/versioning.

---

# 33. TESTING

لكل Feature:

```text
Typecheck
→ Lint
→ Build
→ Unit/Integration
→ User Flow
→ Responsive
→ Accessibility
→ Security
→ Regression
→ Cache when relevant
```

ثم Browser QA إن كانت الأدوات متاحة.

---

# 34. ADMIN VERIFICATION — إلزامي

بعد كل إضافة:

1. سجّل دخول Admin/Test User عندما تكون البيئة متاحة.
2. افتح Feature.
3. جرّب كل زر جديد.
4. جرّب كل Link/Tab/Modal/Form.
5. جرّب كل state.
6. تحقق من انتقال البيانات بين الشاشات.
7. تحقق من عدم وجود dead ends.
8. راجع Console/Network إذا كانت أدوات المتصفح متاحة.
9. راجع Mobile/Desktop/Dark/RTL.
10. سجّل النتيجة في `TEST_REPORT.md`.

**لا تستخدم كلمة Verified دون تنفيذ الاختبار.**

إذا لم تكن Browser/Admin tools متاحة:
`DONE_UNVERIFIED`.

---

# 35. TRACKING — بعد كل Task مباشرة

لا تؤجل التوثيق إلى نهاية المشروع.

بعد نجاح Task:

### `TASKS.md`
أضف:
- Task ID.
- التاريخ.
- الوصف.
- الملفات.
- status.

### `PROJECT_MAP.md` — إلزامي عند أي ملف/صفحة/مكوّن جديد أو مُعدَّل

هذا الملف هو **الخريطة المرجعية التفصيلية للمشروع بالكامل** — الهدف منه أن يستطيع أي شخص (أو أي AI يدخل المشروع لاحقاً) فتح هذا الملف فقط ويعرف فوراً: أين يوجد أي شيء، وماذا يفعل بالتفصيل، وكيف يرتبط بالباقي — دون الحاجة للبحث في كامل الشجرة أو قراءة كل ملف كود على حدة.

**لا يكفي وصف مختصر من سطر واحد. كل إدخال يجب أن يكون تفصيلياً بما يكفي لفهم الوظيفة الكاملة دون فتح الملف.**

لكل ملف/صفحة/مكوّن تم إنشاؤه أو تعديله في هذه المهمة، أضف أو حدّث قسماً بهذا الشكل بالضبط:

```markdown
## `<المسار الكامل للملف>`

**الغرض:** ماذا يفعل هذا الملف بالتحديد؟ لماذا هو موجود؟

**يحتوي على:**
- العنصر/الدالة/الحالة الأولى وماذا تفعل بالتفصيل
- العنصر الثاني وماذا يفعل بالتفصيل
- (استمر لكل عنصر جوهري في الملف)

**الترابط مع باقي المشروع:**
- يستورد من: <قائمة الملفات/الخدمات/الأنواع المستوردة ولماذا>
- يُستخدم من قبل: <أي صفحات/مكوّنات أخرى تعتمد على هذا الملف>
- مرتبط بـ Route: <إن وجد>
- مرتبط بـ Context/Service: <إن وجد>

**حالات خاصة يجب معرفتها:**
- <أي سلوك غير بديهي، شرط، أو استثناء يجب الانتباه له عند التعديل>

**آخر تحديث:** Task ID + تاريخ
```

**مثال فعلي للتوضيح (هذا مثال، وليس نصاً يُنسخ حرفياً):**

```markdown
## `src/pages/profile/DashboardPage.tsx`

**الغرض:** الصفحة الرئيسية لملف صاحب القدرة (Talent) — تعرض ملخص Capability
Profile الكامل: القدرات المثبتة، عدد الأدلة، نسبة الجاهزية العامة.

**يحتوي على:**
- Header علوي: صورة المستخدم + اسمه + دوره + toggle التوفر (متاح/غير متاح)
- بطاقة إحصائيات علوية: عدد الأدلة الكلي، عدد المشاريع، نسبة الجاهزية %
- شبكة Capability Cards: كل مهارة تُعرض كبطاقة Tag منفصلة (proven أو claimed)
- CTA سفلي: "أضف دليلاً +" يفتح Modal إضافة دليل جديد

**الترابط مع باقي المشروع:**
- يستورد من: `services/api/candidates.service.ts` (getCandidate)،
  `contexts/RoleContext.tsx` (لمعرفة الدور الحالي)،
  `components/domain/CapabilityCard/`، `components/ui/Tag/`
- يُستخدم من قبل: Route `/profile` في `app/router/routes.tsx`
- مرتبط بـ Route: `/profile` (default landing بعد تسجيل الدخول لدور Talent)
- مرتبط بـ Context: `RoleContext` (owner/user)، `ThemeContext` (لعرض الألوان الصحيحة)

**حالات خاصة يجب معرفتها:**
- إذا لم يكن للمستخدم أي Evidence بعد، تُعرض EmptyState بدل الشبكة الفارغة
- نسبة الجاهزية تُحسب من `services/api/capabilities.service.ts` وليست
  محسوبة داخل الصفحة نفسها — لا تضف منطق حساب هنا عند التعديل

**آخر تحديث:** T014 — 2026-09-03
```

**قاعدة الصيانة:** لا يُسمح بإغلاق أي Task يتضمن ملفاً جديداً أو تعديلاً جوهرياً على ملف موجود دون تحديث القسم المقابل في `PROJECT_MAP.md`. هذا الملف يُعامل بنفس إلزامية `TASKS.md` — إغفاله يعني أن الـTask غير مكتمل.

### `STATUS.md`
حدّث:
- current phase.
- completed.
- in progress.
- blockers.
- next step.

### `CHANGELOG.md`
أضف التغيير البشري المقروء.

### `DECISIONS.md`
أضف أي قرار معماري/منتجي غير بديهي.

### تعليقات داخل الكود — إلزامية على كل ملف

بالإضافة إلى `PROJECT_MAP.md`، كل ملف كود يجب أن يحتوي تعليقات توضيحية حقيقية (وليست بديهية) تشرح "لماذا" وليس فقط "ماذا":

```typescript
/**
 * DashboardPage — صفحة لوحة قدرتي الشخصية.
 *
 * تعرض Capability Profile الكامل لصاحب القدرة، مبنية على مبدأ
 * Evidence First: كل مهارة تُعرض بشكل مختلف بصرياً حسب كونها
 * proven (مدعومة بدليل) أو claimed (مُدخلة يدوياً فقط).
 *
 * مرتبطة بـ: RoleContext (owner/user)، candidates.service.ts
 * راجع PROJECT_MAP.md → src/pages/profile/DashboardPage.tsx للتفاصيل الكاملة
 */
```

قاعدة الحد الأدنى لكل ملف:
- تعليق رأسي (Header comment) في أعلى كل ملف: الغرض + الارتباطات الرئيسية + إشارة لـPROJECT_MAP.md
- تعليق قبل كل دالة/hook غير بديهي: ماذا يفعل ولماذا (وليس إعادة صياغة اسم الدالة)
- تعليق عند أي منطق شرطي معقد أو غير بديهي داخل الكود
- **لا تُعلّق على البديهيات** (مثل `// increment counter` فوق `count++`) — هذا ضوضاء تقلل قيمة التعليقات الحقيقية

### `.memory/tasks/YYYY-MM-DD_<TASK-ID>.md`

أنشئ:

```markdown
# Task

## Goal

## Context

## Skills Used

## Changes

## Tests

## Admin/User Verification

## Security Review

## What Was Not Verified

## Decisions

## Next Step
```

---

# 36. TASK STATUS

استخدم:

```text
NOT_STARTED
IN_PROGRESS
DONE_UNVERIFIED
VERIFIED
BLOCKED
```

لا تحول `DONE_UNVERIFIED` إلى `VERIFIED` بدون دليل.

---

# 37. IMPLEMENTATION ORDER

نفّذ بالترتيب:

## Phase 1 — Inspect & Foundation
1. فحص المشروع.
2. Find-Skills.
3. استخرج tokens.
4. استخرج fonts.
5. أنشئ structure.
6. types.
7. demo data.

## Phase 2 — Core Architecture
8. Theme.
9. Role.
10. Problem.
11. Simulation.
12. providers.
13. hooks.

## Phase 3 — Services
14. API mock services.
15. AI abstraction.
16. storage.

## Phase 4 — UI
17. Button.
18. Tag.
19. Pill/Badge.
20. Ring.
21. Bar.
22. Skeleton.
23. Empty/Error/Loading.

## Phase 5 — Domain
24. Evidence.
25. Candidate.
26. Capability.
27. Match.
28. Skill Gap.
29. DNA.
30. Timeline.
31. Challenge/Proof/Share.

## Phase 6 — Layout
32. TopBar.
33. Stepper.
34. SubNav.
35. BottomNav.
36. AppShell.

## Phase 7 — Overlays
37. Modal.
38. Invite.
39. CmdPalette.
40. StatePanel.
41. ShareBox.

## Phase 8 — Routing
42. routes constants.
43. router.
44. App.

## Phase 9 — Pages
45. Landing.
46. Auth.
47. Role selection.
48. Problem.
49. Capabilities.
50. Simulation.
51. Evaluation.
52. Skill DNA.
53. Matching.
54. Candidates.
55. Candidate Detail.
56. Compare.
57. Re-ranking.
58. Profile.
59. Evidence.
60. Opportunities.
61. Passport.

## Phase 10 — QA
62. Splash.
63. route transitions.
64. Suspense skeletons.
65. accessibility.
66. RTL.
67. responsive.
68. dark mode.
69. security.
70. full manual QA.
71. build.
72. documentation.

**لا تتجاوز خطوة لأنك تراها غير مهمة.**

---

# 38. QUALITY GATE

قبل إعلان B0، تحقق من كل بند بمعرّفه (ID) — واستخدم نفس الـID عند الإشارة لأي فشل في `TASKS.md` أو `TEST_REPORT.md` أو `DECISIONS.md`. هذا يجعل أي مشكلة قابلة للتتبع مباشرة لبندها الأصلي بدل وصفها من جديد كل مرة.

```text
□ QG-01  npm run build
□ QG-02  TypeScript strict = 0 errors
□ QG-03  ESLint blocking errors = 0
□ QG-04  All prototype routes render
□ QG-05  Direct URLs work
□ QG-06  Refresh works
□ QG-07  Back/Forward works
□ QG-08  RTL works
□ QG-09  Dark mode works
□ QG-10  Mobile works
□ QG-11  Tablet works
□ QG-12  Desktop works
□ QG-13  No horizontal overflow (320px minimum)
□ QG-14  Proven/Claimed visual distinction correct everywhere
□ QG-15  Scores/counts correctly isolated LTR (className="num")
□ QG-16  Loading states present per screen (no generic spinner)
□ QG-17  Empty states present and explain what/why/next
□ QG-18  Error states present with recovery action
□ QG-19  Modal focus trap + Escape + focus restoration
□ QG-20  Command palette keyboard controls (Ctrl+K, arrows, Enter, Escape)
□ QG-21  Simulation timer behavior (countdown, pause, resume, cleanup)
□ QG-22  Splash behavior (auto-dismiss, click-dismiss, reduced-motion skip)
□ QG-23  Challenge WOW behavior (score transition + evidence update)
□ QG-24  Share Passport behavior (copy link + feedback)
□ QG-25  Security review passed (Section 29)
□ QG-26  Regression review passed (no previously-working feature broken)
□ QG-27  Admin/User manual verification passed (Section 34)
□ QG-28  Tracking files updated (TASKS/STATUS/CHANGELOG/DECISIONS)
□ QG-29  PROJECT_MAP.md يحتوي إدخالاً محدّثاً لكل ملف تم إنشاؤه/تعديله في B0
□ QG-30  كل ملف كود رئيسي يحتوي Header Comment يشير إلى PROJECT_MAP.md
```

**استخدام الـID إلزامي:** أي بند يفشل يُذكر في التقارير كـ"QG-14 FAILED: <السبب>" — وليس وصفاً حراً بدون رقم مرجعي.

---

# 39. NO FALSE COMPLETION

إذا فشل:
- build.
- test.
- browser QA.
- Admin QA.
- accessibility.
- security.

لا تخفِ المشكلة.

اكتب:

```text
BLOCKED
```

أو:

```text
DONE_UNVERIFIED
```

مع السبب.

لا تصلح فشل الاختبار بحذف الاختبار.

---

# 40. WHEN SOMETHING IS MISSING

إذا لم تجد معلومة:

1. ابحث في جميع ملفات المشروع.
2. ابحث في `prototype.html`.
3. ابحث في `design-system.html`.
4. ابحث في `dev-handoff.md`.
5. استخدم Find-Skills إذا كان الأمر متعلقاً بمهارة/تقنية.
6. استخدم Grill-Me إذا كان الغموض منتجياً أو تصميمياً أو معمارياً.

**لا تملأ الفراغ من خيالك.**

---

# 41. WHEN YOU NEED TO MAKE A TECHNICAL CHOICE

اختر:
- أبسط حل.
- أقل dependencies.
- قابلية توسع.
- قابلية اختبار.
- security.
- performance.
- consistency مع الموجود.

لا تعمل rewrite شامل.

---

# 42. FINAL RULE

> **QUDRA يجب أن تبقى QUDRA.**
>
> لا تجعلها generic SaaS dashboard.
>
> لا تحول Evidence إلى مجرد Portfolio.
>
> لا تحول Matching إلى مجرد keyword search.
>
> لا تحول Capability Profile إلى CV.
>
> لا تحول AI إلى chatbot.
>
> ابنِ النظام حول:
>
> **Problem → Capability → Evidence → Explainable Match.**

---

# 43. FINAL REPORT TO THE OWNER

بعد اكتمال كل Task، اكتب في الرد:

```text
TASK:
STATUS:

WHAT I UNDERSTOOD:

WHAT I CHANGED:

FILES CHANGED:

SKILLS USED:
- find-skills:
- selected skills:
- grill-me:

TESTS:
- typecheck:
- lint:
- build:
- functional:
- browser:

ADMIN VERIFICATION:
- user flow:
- every new interaction:
- integration:

SECURITY:

RESPONSIVE / RTL / DARK:

NOT VERIFIED:

DECISIONS:

NEXT TASK:
```

ولا تقل `Verified` إلا إذا كان هناك دليل فعلي.

---

# 44. FIRST ACTION — الآن

**لا تبدأ بكتابة الكود مباشرة.**

نفّذ أولاً:

```text
1. Read all project files.
2. Inspect current repository.
3. Compare prototype vs existing implementation.
4. Run Find-Skills.
5. Select the skills needed for B0 Foundation.
6. State the B0 implementation plan internally.
7. Then implement B0 sequentially.
8. After each task: test + Admin/User verification + update docs.
```

**ابدأ من الواقع الموجود، وليس من افتراض أن المشروع فارغ.**

> **لا تفترض. لا تخترع. افحص الموجود أولاً. استخدم Find-Skills قبل التنفيذ. استخدم Grill-Me عند الغموض. نفّذ بأبسط بنية قابلة للتوسع، ثم اختبر كالمستخدم، وتحقق كأدمن، ووثّق كل شيء قبل إعلان الإنجاز.**
