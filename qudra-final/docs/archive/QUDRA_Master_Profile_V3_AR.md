# قُدرة (QUDRA) — الملف الشامل للمشروع
## Master Project Profile — Version 3

**الحالة:** وثيقة مرجعية شاملة للمشروع  
**التركيز الحالي:** MVP للهاكاثون + خارطة الطريق بعد الهاكاثون  
**الكور الأساسي:** إثبات القدرة الفعلية بدل الاعتماد على السيرة الذاتية وحدها.

---

## 1. الملخص التنفيذي

**قُدرة (QUDRA)** هي منصة للموهبة والعمل القائم على المهارات والأدلة (Evidence-Based Talent Platform).

الفكرة الأساسية:

> **بدل أن يقول الشخص إنه يعرف — قُدرة تساعده على إثبات أنه يعرف.**

المنصة تجمع أدلة متعددة عن قدرة الشخص على حل المشكلات وتنفيذ العمل، مثل المشاريع السابقة، GitHub، التحديات العملية، تحديات الشركات، والتقييمات المدعومة بالذكاء الاصطناعي.

ثم تحول هذه الأدلة إلى **ملف قدرة (Capability Profile)** قابل للتحليل والمطابقة.

---

## 2. المشكلة الأساسية

السوق يعتمد بدرجة كبيرة على CV، الشهادات، المسميات الوظيفية، وقائمة Skills يكتبها الشخص بنفسه. هذه الإشارات لا تثبت دائماً القدرة الفعلية.

الشركة تحتاج إجابة مختلفة:

> **من الشخص الذي يستطيع فعلاً حل المشكلة التي لدي؟ ولماذا؟**

والباحث عن العمل يحتاج:

> **ما الذي أستطيع إثباته؟ وما الذي ينقصني حتى أصبح مناسباً لفرصة معينة؟**

قُدرة تربط الطرفين من خلال الأدلة.

---

## 3. الفكرة الجوهرية

### Evidence > CV

المنطق الأساسي:

**Problem → Evidence → Capability → Match → Outcome → New Evidence**

1. توجد مشكلة أو مهمة.
2. النظام يحدد القدرات المطلوبة.
3. يبحث عن أدلة تثبت قدرة الأشخاص.
4. يبني ملف قدرة لكل مستخدم.
5. يطابق المشكلة مع الأشخاص بناءً على الأدلة.
6. ينتج العمل نتيجة فعلية.
7. النتيجة تصبح دليلاً جديداً.

هذه هي **Evidence Loop**.

---

## 4. المستخدمون المستهدفون

### الشركات
تدخل مشكلة أو مهمة وتريد العثور على الأشخاص الأنسب لتنفيذها.

### أصحاب المشاريع والمؤسسون
لديهم فكرة أو مشروع ويريدون معرفة القدرات المطلوبة والعثور على الأشخاص المناسبين وتكوين فريق.

**تحليل السوق والمنافسين الكامل هنا Feature مستقبلية، وليس Core الـMVP.**

### المستقلون والباحثون عن العمل
يبنون ملفهم بإضافة المهارات والمشاريع وGitHub والتحديات والأدلة.

---

## 5. ما الذي يميز قُدرة؟

الـCV يقول:

> Full-Stack Developer — 3 years.

قُدرة تريد أن تقول:

> لديه أدلة على تنفيذ مشاريع Full-Stack، وأدلة عملية في React وNode.js وSQL، وهذه أسباب مطابقته للمشكلة الحالية.

---

## 6. Capability Profile — ملف القدرة

ملف شامل داخلي عن المستخدم، وليس CV عادياً.

يتضمن:
- الهوية المهنية.
- الأدوار والتخصصات.
- المهارات المعلنة والمستنتجة.
- المشاريع.
- GitHub.
- التحديات.
- التقييمات.
- النتائج.
- جودة الأدلة.
- حداثة الأدلة.
- نقاط القوة.
- نقاط الضعف.
- Skills Gap.
- Matchability.

### Hidden AI Profile

عند إضافة المستخدم، يبني AI ملفاً منظماً في الخلفية.

يتم تحديثه عند:
- إضافة مشروع.
- تحديث GitHub.
- إضافة Challenge.
- إضافة نتيجة.
- إضافة دليل جديد.

وبذلك تستخدم عملية المطابقة ملفاً جاهزاً بدلاً من إعادة تحليل كل مستخدم من الصفر.

---

## 7. أنواع الأدلة

### Project Evidence
تحليل المشروع من حيث:
- التقنية.
- الحجم.
- التعقيد.
- اكتمال التنفيذ.
- جودة الحل.
- المشكلة التي يحلها.
- مساهمة المستخدم.

### GitHub Deep Analysis
الربط المقترح:

**OAuth → GitHub API → Repositories → Analysis Pipeline → Evidence Store**

التحليل يمكن أن يشمل:
- لغات البرمجة.
- بنية المشروع.
- النشاط.
- جودة الكود.
- الاختبارات.
- README والتوثيق.
- التعقيد.
- Maintainability.
- مؤشرات اكتمال المشروع.

وجود Repository وحده لا يعني Expert. المهم هو الدليل المستخرج من العمل.

### External Evidence
مستقبلاً يمكن ربط:
- Hack The Box.
- منصات التحديات البرمجية.
- GitHub.
- منصات تعليمية وتقييمية.

الربط يعتمد على API أو OAuth أو Public Profile أو Badges أو طرق تحقق رسمية.

لا نعتمد على scraping غير المصرح به.

---

## 8. Company Challenges

من أقوى الميزات المستقبلية.

الشركة تنشر تحدياً حقيقياً، مثل:

> Meta Challenge — Backend Scalability Problem

المستخدم يحل التحدي، وبعد اجتيازه يضاف إلى ملفه:

> Verified Company Challenge: Meta — Backend Scalability

مع النتيجة ومستوى الأداء.

هذا أقوى من Skill مكتوبة لأنها مرتبطة بمشكلة حقيقية من شركة.

---

## 9. Practical Challenge

تحديات عملية قصيرة تختبر التنفيذ الحقيقي.

مثال:

> ابنِ API لمعالجة 10,000 طلب مع caching.

يمكن تقييم:
- Correctness.
- Code Quality.
- Architecture.
- Tests.
- Performance.
- Security عند الحاجة.

---

## 10. Oral Evidence وAI Interview

ميزة مستقبلية.

يجري AI مقابلة صوتية مع المستخدم ويسأله عن:
- لماذا اختار Architecture معينة؟
- كيف حل المشكلة؟
- ما الـTrade-offs؟
- ماذا سيغير؟
- لماذا استخدم تقنية معينة؟

الهدف هو اختبار الفهم وليس حفظ الإجابة.

يمكن تخصيص الأسئلة بناءً على ملف المستخدم، مع التركيز أكثر على نقاط الضعف واختبار نقاط القوة أيضاً.

---

## 11. Skills Gap

ميزة مهمة في الرؤية طويلة الأمد.

مثال:

المستخدم Front-End Developer ويريد أن يصبح Full-Stack.

تحلل قُدرة:
- المشاريع.
- GitHub.
- الأدلة.
- المهارات.
- التحديات.

ثم تحدد ما يمتلكه وما ينقصه.

مثلاً:
- يمتلك React وTypeScript.
- يحتاج Backend وAPIs وAuthentication وDatabase Design وDeployment.

ثم تنتج:

**Personalized Roadmap**

### Skills Gap للشركة
يمكن للشركة رؤية الفجوات عند تقييم المرشح.

مثال:

> Match: 82%  
> Skill Gap: يحتاج إلى Evidence أقوى في PostgreSQL.

---

## 12. Explainable Matching

الشركة لا ترى ترتيباً غامضاً فقط.

مثال:

### Candidate A — 91% Match

لأنه:
- نفذ مشاريع مشابهة.
- لديه Evidence قوي في React.
- حل تحدياً مرتبطاً بالمشكلة.
- لديه خبرة مثبتة في API Integration.
- لديه فجوة محددة في DevOps.

الترتيب قابل للتفسير.

---

## 13. Evidence Weighting

ليست كل الأدلة متساوية.

ترتيب مبدئي للقوة:
1. تحدٍ حقيقي من شركة.
2. نتيجة عمل فعلي.
3. مشروع حقيقي قابل للتحقق.
4. تحدٍ عملي موثوق.
5. تحليل GitHub.
6. تحديات خارجية موثوقة.
7. مقابلة/تقييم AI.
8. شهادة.
9. Skill يكتبها المستخدم.

القاعدة:

**Evidence Quality > Quantity**

---

## 14. Solution Composer

مستقبلاً يقترح:
- شخصاً واحداً.
- فريقاً.
- المهارات الناقصة.
- Human + AI combination.

مثلاً إذا كانت المشكلة تحتاج Front-End + Backend + UI/UX + AI Integration، يقترح أفضل تركيب بناءً على الأدلة.

---

## 15. Mini Project Workspace

بعد اختيار الأشخاص ينتقل النظام من Matching إلى Execution.

يشمل مستقبلاً:
- Tasks.
- Assignments.
- Progress.
- Milestones.
- Deliverables.
- Evidence الناتج عن المشروع.

ثم:

**Outcome → Evidence**

---

## 16. Market & Feasibility Analysis — مستقبلية

المستخدم يدخل فكرة مشروع.

قُدرة تسأله أسئلة توضيحية ثم تحلل:
- المشكلة.
- العملاء.
- المنافسين.
- السوق.
- الميزة التنافسية.
- المخاطر.
- نموذج العمل.
- قابلية التنفيذ.
- المتطلبات التقنية.
- الفريق المطلوب.

وتنتج **Project Brief**.

هذه ليست Core حالياً.

---

## 17. Competitive Research وRevenue Intelligence — مستقبلية

يمكن مستقبلاً الاستفادة من مصادر بيانات الشركات وSaaS والإيرادات العامة.

الهدف ليس اختراع رقم، بل:

**Multiple Sources → Normalization → Range → Confidence**

أي نطاق تقديري مع مصادر وافتراضات.

---

## 18. لماذا لا يكون Project Analyzer هو الكور؟

لأن أدوات AI العامة تستطيع تحليل فكرة.

الميزة التنافسية الحقيقية لقُدرة:

> **تحويل المشكلة إلى قدرات مطلوبة، ثم العثور على أشخاص لديهم أدلة تثبت امتلاك هذه القدرات.**

تحليل الفكرة مستقبلاً يكون Gateway وليس Core.

---

## 19. MVP للهاكاثون

### P0 — يجب تنفيذه

1. **Capability Profile**
2. **Project Evidence**
3. **GitHub Evidence**
4. **AI Problem Analyzer**
5. **Explainable Matching**
6. **Evidence-based Ranking**

### P1 — إذا توفر وقت

7. Practical Challenge.
8. Skills Gap.
9. AI Interview.
10. External Evidence.

### P2 — بعد MVP

11. Company Challenges.
12. Solution Composer.
13. Mini Project Workspace.
14. Evidence Loop الكامل.

### P3 — توسع

15. Market & Feasibility Analysis.
16. Competitive Research.
17. Revenue Intelligence.
18. Startup Project Brief.
19. AI/Human Work Decomposition.
20. Freelance / Jobs / Grants / Hackathons Ecosystem.

---

## 20. واجهات الـMVP

### Talent
Dashboard → Capability Profile → Evidence → Skills → Skill Gap → Challenges

### Company
Dashboard → Create Problem → AI Analysis → Required Capabilities → Candidate Ranking → Candidate Profile → Compare

### Wow Moment
1. الشركة تدخل مشكلة.
2. AI يحللها.
3. تظهر Required Capabilities.
4. يبحث النظام في Profiles الجاهزة.
5. تظهر أفضل النتائج.
6. نفتح أحد المرشحين.
7. نرى الأدلة.
8. يظهر سبب الاختيار.

---

## 21. ما لا نبنيه في MVP

لا نبني حالياً:
- Marketplace كامل.
- Payments.
- Chat system متكامل.
- نظام إدارة شركات كامل.
- Social Network.
- Market Research كامل.
- Competitive Intelligence كامل.
- Project Workspace متقدم.
- عشرات التكاملات.
- نموذج AI خاص من الصفر.

الهدف: **Demo قوي يثبت الكور.**

---

## 22. استراتيجية أول 100 مستخدم

لا نبدأ Marketplace عاماً.

نبدأ بـVertical محدد مثل:
- Developers.
- AI Engineers.
- Cybersecurity.

ثم:
- مجتمعات Telegram وDiscord وFacebook وLinkedIn.
- الجامعات.
- المجتمعات التقنية.
- Content Marketing.
- Challenges.
- Company Challenges لاحقاً.

---

## 23. GitHub Integration — التطبيق

المسار:

**User → OAuth → GitHub → Repositories → Analysis → Structured Evidence → Capability Profile**

نستخدم:
- GitHub OAuth.
- GitHub API.
- قاعدة بيانات قُدرة.
- خدمة تحليل.
- LLM لتحليل النصوص واستخراج القدرات.
- قواعد تقييم ثابتة.

إعادة التحليل تكون فقط عند تغير المستودع، باستخدام Last Commit أو UpdatedAt أو مؤشرات مشابهة.

---

## 24. Hack The Box Integration

الهدف عرض دليل موثوق من منصة خارجية.

الأولوية:
1. Official API.
2. OAuth.
3. Public Profile.
4. Verified Badge/Profile.
5. Manual Verification كحل MVP.

لا نبني تكاملاً يتجاوز قيود المنصة.

---

## 25. استراتيجية الذكاء الاصطناعي

لا نحتاج تدريب نموذج من الصفر في MVP.

الأفضل:

**Existing LLM API + Rules + Structured Output + Evidence Engine**

الـAI يقوم بـ:
- التحليل.
- استخراج Skills.
- تصنيف الأدلة.
- توليد الأسئلة.
- تفسير Match.
- تحليل النصوص.
- المساعدة في تحليل الكود.

والـRules تحدد كيف يتم التقييم.

---

## 26. AI + Human

### AI
- تحليل البيانات.
- استخراج المهارات.
- اكتشاف الأنماط.
- الترتيب الأولي.
- إنشاء الأسئلة.
- تحليل الكود.
- اقتراح Skill Gap.

### Human
- القرار النهائي.
- المقابلة.
- قبول/رفض المرشح.
- مراجعة النتائج الحساسة.
- تنفيذ المنتج.
- إدارة العلاقات.

---

## 27. قاعدة التقييم

نستخدم عوامل واضحة:

**Score = Evidence × Relevance × Quality × Verification × Recency**

ولا نعرض رقماً بلا تفسير.

كل Score يجب أن يكون مرتبطاً بأدلة يمكن الرجوع إليها.

---

## 28. Pitch — 10 ثوانٍ

> **قُدرة هي منصة تطابق الشركات مع الأشخاص بناءً على ما يستطيعون إثباته، وليس ما يكتبونه في الـCV.**

---

## 29. Pitch — دقيقة

الشركات تبحث اليوم بناءً على CV وشهادات ومسميات وظيفية، لكن هذه الأشياء لا تثبت دائماً القدرة الفعلية.

قُدرة تحول المشاريع والتحديات وGitHub ونتائج العمل إلى Evidence.

عندما تدخل الشركة مشكلة، يحللها الذكاء الاصطناعي ويحدد القدرات المطلوبة، ثم يبحث عن الأشخاص الذين لديهم أدلة تثبت امتلاك هذه القدرات.

والنتيجة ليست قائمة مرشحين فقط، بل ترتيب قابل للتفسير يوضح لماذا هذا الشخص مناسب لهذه المشكلة.

ومع كل مشروع جديد، يحصل المستخدم على Evidence جديد ويصبح ملف قدرته أقوى.

---

## 30. Pitch — دقيقتان

قُدرة تعالج الفرق بين ما يقوله الشخص عن نفسه وما يستطيع فعلاً إثباته.

اليوم يستطيع أي شخص كتابة:
"Expert Java" أو "Senior Full-Stack Developer".

لكن الشركة عندما تمتلك مشكلة حقيقية لا تسأل فقط: ماذا كتب في ملفه؟ بل تسأل: هل يستطيع حل مشكلتي؟

قُدرة تبدأ من المشكلة.

الشركة تدخل المهمة. الذكاء الاصطناعي يحللها ويحدد القدرات المطلوبة. بعد ذلك تبحث المنصة في Capability Profiles مبنية مسبقاً من الأدلة.

الأدلة قد تكون مشاريع حقيقية، مستودعات GitHub، تحديات عملية، تحديات من شركات، تقييمات، أو نتائج عمل سابقة.

ثم تنتج قُدرة ترتيباً قابلاً للتفسير يوضح سبب اختيار كل شخص.

ومستقبلاً تستطيع الشركات نشر تحديات حقيقية. إذا حل المستخدم تحدياً من شركة، يصبح ذلك جزءاً موثقاً من ملف قدرته.

وبذلك تتحول قُدرة من مجرد منصة توظيف إلى نظام يبني ويثبت القدرة المهنية مع مرور الوقت.

---

## 31. الرؤية طويلة الأمد

**Capability Development + Talent Matching + Problem Solving Ecosystem**

المسار:

**Learn → Practice → Verify → Match → Work → Prove → Grow**

---

## 32. المجتمع والفرص

بعد الهاكاثون يمكن إضافة:
- وظائف.
- Freelance Projects.
- Challenges.
- Hackathons.
- Fellowships.
- Scholarships.
- Trainings.
- Communities.

لكن هذه طبقة توسع وليست الكور.

---

## 33. نموذج العمل المستقبلي

### B2B
الشركات تدفع مقابل:
- Talent Discovery.
- Problem Matching.
- Verified Challenges.
- Hiring Intelligence.

### Premium Talent
المستخدم يدفع مقابل:
- Advanced Profile.
- AI Interviews.
- Skill Gap.
- Career Roadmaps.
- Advanced Evidence Analysis.

### Enterprise
اشتراكات للشركات الكبيرة.

---

## 34. المخاطر والحلول

### Fake Evidence
الحلول:
- GitHub verification.
- Challenge verification.
- Company-issued challenges.
- Multiple evidence sources.

### Cold Start
الحلول:
- Vertical محدد.
- مجتمع تقني.
- Challenges.
- Content.
- شركات شريكة.

### AI Bias
الحلول:
- Explainable scoring.
- Evidence traceability.
- Human review للقرارات الحساسة.
- عدم الاعتماد على AI وحده.

### Overbuilding
الحل:
> MVP صغير يثبت الكور.

---

## 35. مبادئ UX

1. لا تجعل المستخدم يفكر في النظام الداخلي.
2. أظهر Evidence وليس أرقاماً غامضة.
3. كل Score قابل للتفسير.
4. قلل عدد الخطوات.
5. اجعل AI يعمل في الخلفية.
6. النتائج بلغة بسيطة.
7. Profile ليس CV تقليدياً.
8. الفرق بين Claim وEvidence واضح.

---

## 36. هيكل تجربة المستخدم

### Talent Flow
Register
→ Connect GitHub
→ Add Projects
→ AI Analysis
→ Capability Profile
→ Evidence
→ Skill Gap
→ Challenges
→ Profile Growth

### Company Flow
Create Problem
→ AI Problem Analysis
→ Required Capabilities
→ Search
→ Explainable Ranking
→ Candidate Profile
→ Compare
→ Challenge
→ Work
→ Outcome Evidence

---

## 37. أهم Wow Moment

**Problem → Required Capabilities → Evidence → Best Match**

ثم يظهر:

> **هذا الشخص لم يقل فقط إنه يعرف. هذه الأدلة تثبت قدرته.**

---

## 38. الترتيب الاستراتيجي النهائي

### Core
**Evidence-Based Capability Profile**

### Core
**AI Problem → Capability Extraction**

### Core
**Explainable Evidence-Based Matching**

### Strong Supporting
**GitHub Evidence**

### Strong Future
**Company Challenges**

### Strong Future
**Skill Gap + Roadmap**

### Strong Future
**AI Interview**

### Future
**External Evidence Integrations**

### Future
**Solution Composer**

### Future
**Project Workspace**

### Future
**Market Intelligence**

### Future
**Freelance / Jobs / Grants / Hackathons Ecosystem**

---

# الخلاصة

قُدرة ليست موقع وظائف جديداً، وليست CV Builder، وليست ChatGPT لتحليل المشاريع، وليست منصة Freelance فقط.

الكور الحقيقي:

> **نظام يحول القدرة المهنية إلى Evidence قابل للتحليل، ثم يستخدم هذا Evidence لمطابقة الأشخاص مع المشكلات الحقيقية.**

المعادلة النهائية:

**Problem**
↓
**Required Capabilities**
↓
**Evidence**
↓
**Capability Profile**
↓
**Explainable Match**
↓
**Real Work**
↓
**New Evidence**

وهذه الحلقة هي أساس قُدرة طويل الأمد.
