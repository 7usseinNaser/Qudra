# قُدرة — Integration & AI Implementation Playbook v3

## 1. المعمارية

**External Evidence → Connector → Normalizer → Evidence Store → Evidence
Analyzer → Rules + LLM → Capability Profile → Matching Engine**.

## 2. لا نبني Model خاص في البداية

نستخدم **LLM API + Rules + Structured Schema + Evidence Data +
Evaluation Pipeline**. الـLLM ليس الحكم الوحيد؛ الـRules تحدد الأوزان
والحدود والـconfidence.

## 3. Problem Parser

Input: نص المشكلة. Output structured: goal، domain، tasks\[\]،
required_capabilities\[\]، priority، constraints\[\]، unknowns\[\].

## 4. Evidence Analyzer

لكل Evidence نحفظ: source، type، skill، complexity، relevance، recency،
outcome، verification، confidence.

## 5. Rules

مثال Evidence Score يعتمد على Relevance + Complexity + Recency +
Outcome + Verification + Consistency. لا نقول “Expert” لمجرد رأي AI.

## 6. GitHub Integration

الأفضل تقنيًا: **GitHub App** مع صلاحيات دقيقة، بدل طلب صلاحيات واسعة بلا
حاجة. Flow: Connect → Authorize → Select repos → Fetch metadata/content
→ Analyze → Evidence → Update Intelligence Profile.

## 7. GitHub Analysis

### Metadata

Languages، activity، size، files، dates. \### Structure folders،
modules، architecture. \### Code signals readability، complexity،
duplication، error handling، tests، security indicators،
maintainability. \### Product signals README، problem، setup،
deployment/demo، completeness. هذه Signals وليست حكمًا مطلقًا على جودة
المهندس.

## 8. GitHub Auto-update

GitHub webhook push → queue → re-analysis → Evidence update → Capability
Profile update. لا ننفذ التحليل الطويل داخل HTTP request.

## 9. Private repos

في MVP نبدأ بـPublic repos. لاحقًا يمكن للمستخدم اختيار private repo
وإعطاء الحد الأدنى من الصلاحيات.

## 10. Hack The Box

HTB لديها حاليًا Public Profile يمكن جعله عامًا ويعرض بيانات موثقة مثل
الإنجازات والشهادات وبعض مؤشرات المهارة والترتيب. لا نفترض وجود Public
API مناسب لكل بيانات الملف ما لم تؤكده HTB رسميًا. MVP: المستخدم يضيف
Public Profile URL أو Evidence link. Future: Official API/OAuth إن توفر.

## 11. External connectors

Connector موحد لـ GitHub، HTB، LeetCode، Codeforces، Kaggle، HackerRank
وغيرها. كل مصدر يتحول إلى **EvidenceRecord**.

## 12. إذا لم يوجد API

الأولوية: Official API → OAuth → Official Public Profile → User-provided
verification link → Manual Evidence. Scraping فقط إذا كانت شروط المنصة
تسمح به.

## 13. TrustMRR / Market Intelligence

TrustMRR يوفر API لبيانات verified startup revenue مع MRR/revenue/growth
وبعض metadata. هذا مستقبلًا: Similar businesses → Revenue signals → AI
interpretation → benchmark. لا نقدم prediction مضمونًا.

## 14. AI model strategy

MVP: استخدم API لنموذج قوي، واجعل Provider قابلًا للاستبدال. لا تبنِ Model
خاصًا الآن لأن بيانات التدريب والتقييم غير متوفرة والوقت يجب أن يذهب
للـEvidence system.

## 15. Free-first

للهكاثون: GitHub APIs، Public profiles، open-source libraries،
local/open models للتجارب المناسبة، seed data، وfree tiers. أي خدمة
مدفوعة قوية تُعامل كـFuture option لا كشرط تشغيل.

## 16. أين AI؟

Problem analysis، Evidence summarization، skill mapping، Match
explanation، interview questions، roadmap، code classification الأولي.

## 17. أين Rules؟

Weights، thresholds، freshness، verification levels، match calculation،
confidence constraints.

## 18. أين الإنسان؟

Architecture، security، product decisions، UX review، اعتماد Company
Challenges، الاعتراضات، وقرارات التوظيف النهائية.

## 19. AI Interview Future

Load User Intelligence Profile → Target Role → Skill Gaps → Interview
Plan → Voice Interview → Evaluation → Readiness/Evidence update. الأسئلة
تركز على نقاط الضعف وتختبر نقاط القوة بمستوى مناسب.

## 20. Security

افصل Raw Data عن Derived Intelligence وعن Public Profile. لا تعرض للشركة
بيانات خاصة لم يسمح المستخدم بمشاركتها. خزّن معرفات المصادر بدل نسخ
بيانات لا تحتاجها.

## 21. Database core

users، profiles، skills، user_skills، evidence، evidence_sources،
projects، challenges، challenge_attempts، capability_scores، skill_gaps،
problems، problem_capabilities، matches، match_reasons،
user_intelligence_profiles، analysis_runs. Future: companies،
company_challenges، teams، workspace، outcomes، evidence_graph_edges،
integrations.

## 22. معيار نجاح أي Integration

لا يكفي أن يظهر الحساب. يجب أن تتحول: **External Data → Evidence →
Capability → Match Impact**.
