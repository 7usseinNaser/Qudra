# PROJECT_MAP.md — خريطة قُدرة التفصيلية

> **هذا الملف هو المرجع الوحيد الذي يجب فتحه أولاً عند الحاجة لفهم أو تعديل أي جزء من المشروع.**
> الهدف: معرفة "أين يوجد أي شيء، وماذا يفعل بالتفصيل، وكيف يرتبط بالباقي" — دون البحث في كامل شجرة المشروع أو قراءة كل ملف كود على حدة.

**قاعدة الصيانة الإلزامية:** لا يُغلق أي Task يتضمن ملفاً جديداً أو تعديلاً جوهرياً على ملف موجود دون تحديث هذا الملف. راجع القسم 35 من `QUDRA_FINAL_BOLT_PROMPT.md` للصيغة الدقيقة المطلوبة لكل إدخال.

**آخر تحديث:** لم يبدأ التنفيذ بعد — هذا الهيكل الابتدائي فقط.

---

## كيف تُقرأ هذه الخريطة

كل قسم أدناه يمثل منطقة من المشروع. داخل كل منطقة، كل ملف له إدخال بهذا الشكل الثابت:

```markdown
## `<المسار الكامل للملف>`

**الغرض:** ماذا يفعل هذا الملف بالتحديد؟ لماذا هو موجود؟

**يحتوي على:**
- عنصر أول وماذا يفعل بالتفصيل
- عنصر ثانٍ وماذا يفعل بالتفصيل

**الترابط مع باقي المشروع:**
- يستورد من: ...
- يُستخدم من قبل: ...
- مرتبط بـ Route: ...
- مرتبط بـ Context/Service: ...

**حالات خاصة يجب معرفتها:**
- ...

**آخر تحديث:** Task ID + تاريخ
```

لا تُقبل إدخالات بسطر واحد مختصر — الهدف فهم الوظيفة الكاملة دون فتح الملف.

---

## فهرس سريع (Table of Contents)

يُحدَّث تلقائياً مع كل إضافة. حالياً فارغ لأن التنفيذ لم يبدأ.

- [ ] `app/` — نقطة الدخول، Router، Providers
- [ ] `pages/` — كل شاشة من شاشات المنتج
- [ ] `features/` — منطق الدومين لكل Feature
- [ ] `components/layout/` — عناصر التخطيط العامة
- [ ] `components/ui/` — مكوّنات عامة قابلة لإعادة الاستخدام
- [ ] `components/domain/` — مكوّنات خاصة بمنطق QUDRA
- [ ] `components/overlays/` — Modal، CmdPalette، إلخ
- [ ] `services/` — طبقة الوصول للبيانات (API/AI/Storage)
- [ ] `contexts/` — الحالة المشتركة عبر المشروع
- [ ] `hooks/` — Hooks قابلة لإعادة الاستخدام
- [ ] `types/` — تعريفات TypeScript للدومين
- [ ] `data/` — بيانات Demo النموذجية (Typed Fixtures)
- [ ] `constants/` — قيم ثابتة (Routes، Breakpoints)
- [ ] `styles/` — Design Tokens والأنماط العامة

---

## 1. `app/` — نقطة الدخول

<!-- يُملأ عند إنشاء App.tsx و router/ و providers/ -->

---

## 2. `pages/` — الشاشات

<!--
مثال على الشكل المتوقع عند التعبئة:

## `src/pages/problem/ProblemInputPage.tsx`

**الغرض:** الشاشة الأولى في تدفق صاحب المشروع — إدخال وصف المشكلة بلغة طبيعية.

**يحتوي على:**
- Textarea رئيسي لوصف المشكلة (حد أدنى 20 حرف لتفعيل الزر)
- عداد أحرف سفلي (0/2000)
- أسئلة سياق اختيارية (المستخدم النهائي، المجال، الموعد، MVP أم منتج كامل)
- زر "حلّل المشكلة" يُفعَّل فقط عند استيفاء الحد الأدنى

**الترابط مع باقي المشروع:**
- يستورد من: `contexts/ProblemContext.tsx`، `services/api/problems.service.ts`
- يُستخدم من قبل: Route `/problem`
- مرتبط بـ Route: `/problem` → عند النجاح ينتقل لـ `/capabilities`
- مرتبط بـ Context: `ProblemContext` (يحدّث description + analysisState)

**حالات خاصة يجب معرفتها:**
- عند الضغط على "حلّل المشكلة"، الحقل يصبح read-only فوراً والانتقال لشاشة
  AI Analysis Progress يحدث تلقائياً بعد نجاح الطلب

**آخر تحديث:** —
-->

---

## 3. `features/` — منطق الدومين

<!-- يُملأ عند إنشاء كل feature hook -->

---

## 4. `components/layout/`

<!-- TopBar, Stepper, SubNav, BottomNav, AppShell -->

---

## 5. `components/ui/`

<!-- Button, Tag, Pill, Ring, Bar, Badge, Skeleton, EmptyState, ErrorState, LoadingState -->

---

## 6. `components/domain/`

<!-- EvidenceCard, CandidateCard, CapabilityCard, SkillTag, SkillGap, MatchScore, MatchExplanation, CapabilityDNA, CapabilityTimeline, RoadStep, ChallengeCard, ProofCard, ShareCard -->

---

## 7. `components/overlays/`

<!-- Modal, InviteModal, CmdPalette, StatePanel, ShareBox -->

---

## 8. `services/`

<!--
مثال متوقع:

## `src/services/api/candidates.service.ts`

**الغرض:** طبقة الوصول لبيانات المرشحين — تعزل الصفحات عن مصدر البيانات
الفعلي (Demo الآن، API حقيقي لاحقاً في B1+).

**يحتوي على:**
- `getCandidates()`: يرجع كل المرشحين من `data/demo-candidates.ts` حالياً
- `getCandidate(id)`: يرجع مرشحاً واحداً بالـID

**الترابط مع باقي المشروع:**
- يستورد من: `data/demo-candidates.ts`، `types/candidate.types.ts`
- يُستخدم من قبل: `CandidateListPage`, `CandidateDetailPage`

**حالات خاصة يجب معرفتها:**
- عند الانتقال لـ B1، فقط هذا الملف يتغير (fetch بدل return مباشر) —
  لا حاجة لتعديل أي Page يستخدمه

**آخر تحديث:** —
-->

---

## 9. `contexts/`

<!-- ThemeContext, RoleContext, ProblemContext, SimContext -->

---

## 10. `hooks/`

<!-- useTheme, useRole, useProblem, useSim, useTimer, useAnimateNum, useRing, useFocusTrap -->

---

## 11. `types/`

<!-- كل ملف types يُوثّق بالكيانات (Entities) التي يعرّفها -->

---

## 12. `data/`

<!-- كل ملف Demo Data يُوثّق بعدد العناصر ونوعها ومصدرها من prototype.html -->

---

## 13. `constants/`

<!-- routes.ts, breakpoints.ts -->

---

## 14. `styles/`

<!-- tokens.css, tokens-dark.css, globals.css, animations.css, utilities.css -->

---

## سجل التحديثات على هذا الملف نفسه

| التاريخ | Task ID | التغيير |
|---|---|---|
| — | — | إنشاء الهيكل الابتدائي قبل بدء التنفيذ |
