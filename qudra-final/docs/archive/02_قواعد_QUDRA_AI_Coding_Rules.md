# QUDRA — قواعد الذكاء الاصطناعي والبرمجة
## قواعد تنفيذ إلزامية لـ AI Coding Agents

هذه الوثيقة هي **قواعد العمل** لأي ذكاء اصطناعي يكتب أو يعدل كود QUDRA.

---

# 1. القاعدة الذهبية

**لا تكتب كوداً يعمل مرة واحدة. اكتب كوداً يمكن أن يعيش مع الميزة التالية.**

كل قرار يجب أن يراعي:
- الميزة الحالية.
- الميزة التالية.
- إعادة الاستخدام.
- قابلية الاختبار.
- قابلية الصيانة.
- الأمن.
- الأداء.
- UX.

---

# 2. قبل كتابة الكود

يجب على AI:
1. قراءة Architecture.
2. قراءة TASKS.
3. معرفة الـfeature الحالية.
4. معرفة الـfeatures التي تعتمد عليها.
5. فحص الملفات الموجودة قبل إنشاء ملفات جديدة.
6. إعادة استخدام الموجود إذا كان مناسباً.
7. عدم إعادة بناء شيء موجود دون سبب.
8. اقتراح التغيير قبل تنفيذ refactor كبير.

---

# 3. لا تبدأ بالكود مباشرة

الترتيب:

**Understand → Plan → Model → Implement → Test → Secure → UX Review → Verify → Update Tasks**

---

# 4. تقسيم الملفات

يجب اعتماد Feature-based architecture.

لا تضع كل التطبيق في:
- App.tsx.
- main.dart.
- page كبيرة.
- service واحد ضخم.

افصل:
- pages/screens.
- components.
- models/types.
- services.
- repositories.
- hooks/state.
- validators.
- utils.
- tests.

القاعدة:
**ملف صغير واضح أفضل من ملف عملاق متعدد المسؤوليات.**

---

# 5. Single Responsibility

كل وحدة لها مسؤولية واضحة.

Component:
→ UI.

Service:
→ business/integration operation.

Repository:
→ data access.

Validator:
→ validation.

Model:
→ typed data contract.

AI parser:
→ AI output parsing/validation.

لا تخلط المسؤوليات بلا سبب.

---

# 6. DRY

لا تكرر:
- API logic.
- validation.
- design tokens.
- types.
- matching formulas.
- error handling.

إذا تكرر منطق مرتين، اسأل هل يجب استخراجه.

---

# 7. Type Safety

يجب أن تكون البيانات Typed.

لا تعتمد على:
- any.
- unknown بلا validation.
- strings عشوائية لتمثيل statuses.
- object shapes غير موثقة.

AI output يجب:
1. parse.
2. validate schema.
3. reject invalid output.
4. log safely.
5. fallback gracefully.

---

# 8. Design System

الألوان، typography، spacing، radius، shadows وغيرها يجب أن تكون Design Tokens.

لا:
`#00B8B8` في عشرات الملفات.

نعم:
`color.primary`.

الهوية الحالية:
- Turquoise/Deep Turquoise.
- Yellow accent.
- Tajawal.
- Inter.

لا تغير الهوية بلا قرار واضح.

---

# 9. UI/UX

تعامل مع كل شاشة كمنتج مستقل.

تحقق من:
- hierarchy.
- spacing.
- alignment.
- readability.
- contrast.
- responsive.
- touch targets.
- empty state.
- loading state.
- error state.
- success state.
- keyboard/focus.
- accessibility.

لا يكفي أن "الشاشة تظهر".

---

# 10. Framer Motion / Motion

إذا كان المشروع يستخدم Framer Motion:
- استخدم الحركة لتوضيح state/transition.
- لا تجعل كل عنصر يتحرك.
- لا تستخدم animation ثقيلة.
- احترم `prefers-reduced-motion`.
- لا تجعل الحركة تعيق النقر أو القراءة.
- استخدم reusable motion variants.
- حافظ على أداء جيد.

الهدف:
**Motion supports UX; it does not become the UX.**

---

# 11. AI Engineering

أي AI feature يجب أن يكون لها:
- Input contract.
- Prompt/system instructions.
- Output schema.
- Validation.
- Retry policy.
- Fallback.
- Error handling.
- Logging آمن.
- Versioning للـprompt عند الحاجة.

لا تعتمد على نص AI الخام في business logic.

---

# 12. Problem Analyzer

المخرج المفضل Structured Object:

```text
goal
problem_statement
target_users
constraints[]
tasks[]
capabilities[]
roles[]
technologies[]
priorities[]
clarifying_questions[]
confidence
```

كل field له schema واضح.

---

# 13. Evidence Model

لا تحفظ Evidence كنص فقط.

كل Evidence يجب أن يحمل:
- المصدر.
- الرابط/المعرف.
- النوع.
- المهارات.
- الصلة.
- الحداثة.
- التحقق.
- النتيجة.
- confidence.

لا يجوز للنظام أن يقول "Verified" إذا لم توجد آلية تحقق.

---

# 14. Matching

المطابقة يجب أن تكون قابلة للتفسير.

كل Score يجب أن يملك:
- inputs.
- weighting/rules.
- evidence.
- gaps.
- confidence.

إذا تغيرت القواعد، يجب أن يكون ذلك قابلاً للتتبع.

---

# 15. Security First

بعد كل Feature:
- تحقق من auth.
- تحقق من authorization.
- تحقق من input.
- تحقق من output.
- تحقق من secrets.
- تحقق من API permissions.
- تحقق من DB policies.
- تحقق من RLS في Supabase.
- تحقق من CORS.
- تحقق من dependency risks.
- تحقق من information leakage.

لا تضع:
- API keys.
- service-role keys.
- secrets
في frontend أو Git.

---

# 16. Supabase

عند استخدام Supabase:
- Auth للهوية.
- RLS للصلاحيات.
- migrations versioned.
- service role فقط على backend/server environment.
- لا تثق بالـfrontend لتطبيق authorization.

اختبر:
- user A لا يرى بيانات user B.
- company لا ترى بيانات غير مصرح بها.
- anonymous access غير المقصود مغلق.

---

# 17. GitHub

استخدم أقل صلاحيات ممكنة.

MVP:
- public repositories حيث أمكن.

Future:
- GitHub App/OAuth مع permissions محددة.

لا تخزن tokens بلا حاجة.
لا تحلل private repository دون consent.

---

# 18. Cache / Service Worker

بعد كل deployment مهم:
- افتح clean session.
- Hard refresh.
- تحقق من Service Worker.
- تحقق من asset versions.
- تحقق من API environment.
- تحقق من stale data.

إذا ظهرت مشكلة:
1. determine cache source.
2. clear/unregister locally.
3. fix invalidation/versioning.
4. retest from clean browser.

لا تعتبر "مسح الكاش" حلاً دائماً لمشكلة cache architecture.

---

# 19. Testing

لكل Feature:

### A. Static
- Type checking.
- Lint.
- Build.

### B. Functional
- Happy path.
- Validation.
- Error.
- Empty.
- Loading.
- Retry.

### C. User simulation
نفذ المهمة كما يفعل المستخدم:
- click.
- type.
- submit.
- navigate.
- back.
- refresh.
- reopen.

### D. Regression
اختبر الـfeatures السابقة.

---

# 20. زر غير عامل = Feature غير مكتملة

يجب اختبار:
- buttons.
- links.
- dropdowns.
- tabs.
- forms.
- navigation.
- modals.
- filters.
- search.
- pagination إذا وجدت.

لا تقبل UI شكلياً بلا behavior.

---

# 21. Browser / Agent Verification

إذا توفرت أداة Browser/Computer:
- استخدمها لاختبار المنتج كمستخدم.
- لا تعتمد على قراءة الكود فقط.

إذا لم تتوفر:
- شغل الاختبارات المتاحة.
- build المشروع.
- استخدم integration/e2e tests.
- صرّح بما تم اختباره فعلياً.

ممنوع الادعاء بأن feature "100%" إذا لم يتم اختبارها.

---

# 22. Performance

بعد كل Feature:
- لا تضف re-render غير ضروري.
- لا تجلب بيانات لا تحتاجها الشاشة.
- lazy-load عند الحاجة.
- راقب حجم bundle.
- لا تشغل AI بلا حاجة.
- cache فقط حيث يفيد.
- debounce للبحث.
- pagination للقوائم الكبيرة.

---

# 23. Accessibility

افحص:
- semantic HTML.
- labels.
- keyboard.
- focus.
- contrast.
- alt text.
- screen reader basics.
- reduced motion.

---

# 24. Error Handling

لا تستخدم:
`try { ... } catch {}`

دون معالجة.

كل error:
- مفهوم للمستخدم.
- مفيد للمطور.
- لا يكشف secrets.
- قابل للتسجيل بأمان.

---

# 25. Logging

سجل:
- error category.
- request id.
- feature.
- safe metadata.

لا تسجل:
- passwords.
- tokens.
- secrets.
- private repository content بلا ضرورة.
- بيانات شخصية غير لازمة.

---

# 26. Dependency Rule

قبل إضافة package:
1. هل نحتاجه؟
2. هل الموجود يكفي؟
3. هل package موثوقة؟
4. هل حجمها مناسب؟
5. هل لها maintenance جيد؟
6. هل يمكن إزالة package بعد استخدامها؟

لا تضف dependency لحل مشكلة من سطرين.

---

# 27. Free-first

في MVP:
- استخدم الأدوات المجانية/open-source حيث يمكن.
- لا تجعل paid API شرطاً لعمل الـcore.
- صمم abstraction يسمح بتغيير provider لاحقاً.

مثال:
`AIProvider`
بدلاً من ربط التطبيق مباشرة بمزود واحد.

---

# 28. Environment Configuration

افصل:
- development.
- staging.
- production.

لا تضع configuration حساسة داخل source code.

استخدم environment variables.

---

# 29. Database

قبل إنشاء table:
- حدد entity.
- relationships.
- indexes.
- constraints.
- ownership.
- RLS.
- migration.

لا تستخدم database كـJSON dump للتطبيق كله.

---

# 30. Migrations

كل تغيير schema:
- migration.
- predictable.
- reversible عندما يكون ذلك عملياً.
- لا تعديل يدوي غير موثق.

---

# 31. Git

كل Feature:
- branch واضح.
- commits صغيرة.
- commit message مفهومة.
- لا commit للsecrets.
- لا commit build artifacts غير المطلوبة.

---

# 32. Refactoring

لا تعمل refactor شامل أثناء Feature صغيرة.

قاعدة:
**Refactor only when it reduces complexity or unlocks the next feature.**

---

# 33. Definition of Done

Feature = Done فقط عندما:
- Code complete.
- UI complete.
- States complete.
- Integration complete.
- Tested.
- Security reviewed.
- UX reviewed.
- Responsive reviewed.
- Cache reviewed عند الحاجة.
- No unexplained errors.
- Tasks updated.
- Documentation updated.

---

# 34. Tasks Update Protocol

بعد كل إنجاز:
- حدّث status.
- سجل ما تم.
- سجل الملفات التي تغيرت.
- سجل الاختبارات.
- سجل المشاكل.
- سجل next step.
- سجل decision مهم.

لا تمسح التاريخ.

---

# 35. AI Agent Behavior

AI يجب أن يقول:
- ماذا فهم.
- ماذا سيغير.
- ما الملفات.
- لماذا.
- كيف اختبر.
- ما الذي لم يستطع اختباره.

ولا يقول:
"Done 100%" بلا دليل.

---

# 36. ممنوعات

- Fake data داخل production دون وسم.
- hard-coded secrets.
- giant files.
- duplicated business logic.
- silent failures.
- unvalidated AI output.
- unsafe DB policies.
- arbitrary color values.
- unnecessary animations.
- unnecessary packages.
- deleting existing features بلا سبب.
- تغيير architecture بدون توثيق.

---

# 37. قاعدة التوسع

كل Feature جديدة يجب أن تسأل:
**ما الـfeature التالية؟**

ثم تبني abstraction مناسباً بدون over-engineering.

لا نبني Enterprise architecture في يوم MVP، ولا نبني throwaway prototype إذا كان الجزء سيستمر إلى B1/B2/B3/B4.

---

# 38. Final Gate

قبل إعلان أي milestone:

**BUILD → TEST → SECURITY → UX/UI → CACHE → PERFORMANCE → REGRESSION → TASKS**

فقط بعدها:
**DONE**
