# قُدرة — مواصفات التسليم للفرونت والباك

مبنية من النموذج الشغّال، لا من افتراضات. كل حقل هنا معروض فعليًا في شاشة.

**الرابط:** https://claude.ai/code/artifact/7914bcfc-be05-4a09-b979-8a47df549e32
**الملف:** `qudra-prototype.html` — افتحه بمحرر نصوص، الألوان والمسافات كلها فيه.

---

## للفرونت: ابدأ اليوم

لا تنتظر فيجما. الملف فيه كل شي:

| تحتاج | مكانه في الملف |
|---|---|
| الألوان | كتلة `:root{...}` في الأعلى — ١٧ متغيّر |
| الوضع الداكن | `:root[data-theme="dark"]{...}` — ٢٥ متغيّر |
| الخط | `IBM Plex Sans Arabic` + `IBM Plex Mono` من Google Fonts |
| المسافات والزوايا | كل مكوّن له كتلة CSS معلّقة بالعربي |
| الحركات | ابحث `@keyframes` — كلها تحترم `prefers-reduced-motion` |
| الأيقونات | SVG مضمّن، نمط Lucide، سماكة ١.٧–٢ |

**قواعد لا تُكسر:**
- كل زر ≥ **44px** ارتفاعًا
- عرض المحتوى الأقصى **992px**، RTL
- الفيروزي = مُثبت · الأصفر = ناقص · الأحمر = **خطأ فقط**
- المهارة المُثبتة (حد صلب + عدّاد) ≠ المُعلنة (حد متقطّع + بلا عدّاد)

---

## للباك: الـEndpoints

### 1. المصادقة
```
POST /auth/register    { name, email, password }        → { token, user }
POST /auth/login       { email, password }              → { token, user }
GET  /auth/me                                           → { user }
```
كلمة المرور **hashed** (bcrypt/argon2). لا تُرجعها أبدًا.

### 2. المشكلة والتحليل
```
POST /problems                 { description }
  → { problem_id, summary, category, required_skills[] }

required_skills[] = [{
  id, name,                    // "UI/UX"
  level,                       // "core" | "support"
  source_phrase,               // الجملة التي استُخرجت منها ← إلزامي للعرض
  excluded: false
}]
```
**مهم:** اطلب من الـLLM **JSON منظّمًا**، لا نصًّا حرًّا. و`source_phrase` غير اختياري — الواجهة تعرضه تحت كل قدرة.

يُرجَع أيضًا `excluded[] = [{ name, reason }]` — ما استُبعد ولماذا.

### 3. المحاكاة
```
POST /simulations              { problem_id }
  → { simulation_id, duration_sec, tasks[] }

tasks[] = [{ id, skill, question, hint }]     // 3 مهام
```

```
POST /simulations/:id/submit   { answers: [{ task_id, text }] }
  → { submission_id }
```

### 4. التقييم
```
POST /evaluations              { submission_id }
  → {
      overall,                  // 0-100
      criteria[],               // [{ name, score }] — 4 معايير
      per_task[],               // [{ task_id, score, excerpt }]
      strengths[],              // نصوص
      weaknesses[]
    }
```
**قاعدة:** `overall` لازم يساوي مجموع مساهمات المعايير. الواجهة تعرض التفصيل، وأي تناقض يبيّن.

### 5. القدرات (Skill DNA)
```
GET /users/:id/skills
  → skills[] = [{
      name, score,              // 0-100
      verified,                 // true = عليها دليل موثّق
      evidence_id,              // الدليل الذي أنتجها
      evidence_label            // "من مهمة … · 2026-08-29"
    }]
```

### 6. الأدلة
```
GET  /users/:id/evidence?level=verified|linked|self
  → evidence[] = [{
      id, source,               // "GitHub" | "LeetCode" | "QUDRA" | "Project" | "Cert"
      url_or_title, type,       // "مستودع" | "محاكاة" | "تقييم" | "مشروع" | "شهادة"
      skill, date, level,       // level: "verified" | "linked" | "self"
      complexity, completeness, tests, docs,   // 0-100 لشاشة التفاصيل
      impact: { before, after, affected[] }    // أثره على الملف
    }]

GET  /evidence/:id             → نفس الشكل + تفاصيل التحقق
POST /sources/connect          { provider, handle } → { job_id }
GET  /sources/:job_id          → { status, produced_evidence[] }
```

### 7. المطابقة
```
GET /problems/:id/matches
  → candidates[] = [{
      user_id, name, title, score,
      readiness,                // "ready" | "near" | "far"
      proven[],                 // [{ skill, evidence_count }]
      gaps[]                    // [skill]
    }]

GET /matches/:candidate_id/why
  → {
      score, confidence,
      factors[] = [{ name, weight, earned, is_gap, note }],
      evidence[]
    }
```
**قاعدة حاسمة:** `sum(weight) = 100` و `sum(earned) = score`. الواجهة تعرضهما معًا، وأي خلل يظهر فورًا.

### 8. الفرص والفريق
```
GET  /users/:id/opportunities  → [{ id, title, org, mode, duration, coverage, readiness, missing[] }]
GET  /users/:id/unlocks        → [{ skill, opens_count }]   // "React → +4 فرص"
POST /invites                  { problem_id, to_user_id, role, message } → { invite_id }
GET  /invites/incoming         → [{ from, problem_summary, needed_skills[], coverage }]
POST /invites/:id/respond      { accept: true|false }
```

### 9. المسار الزمني
```
GET /users/:id/timeline
  → series[] = [{
      skill, is_declining,
      points[] = [{ date, score, evidence_label }]
    }]
```
**التقادم:** الدليل يفقد وزنه مع الوقت. نصف العمر المقترح:
مستودع **18 شهرًا** · تحدٍّ **24** · تقييم منصة **12** · شهادة بلا تطبيق **9**.

---

## قاعدة البيانات — 10 جداول تكفي

```
users            id, name, email, password_hash, created_at
problems         id, user_id, description, summary, category, created_at
required_skills  id, problem_id, name, level, source_phrase
simulations      id, problem_id, duration_sec, created_at
tasks            id, simulation_id, skill, question, hint, order
submissions      id, simulation_id, user_id, submitted_at
answers          id, submission_id, task_id, text
evaluations      id, submission_id, overall, criteria_json, strengths_json, weaknesses_json
evidence         id, user_id, source, type, skill, url, date, level, signals_json
skill_scores     id, user_id, skill, score, verified, evidence_id, updated_at
matches          id, problem_id, candidate_id, score, factors_json
invites          id, problem_id, from_user, to_user, role, message, status
```

---

## للداتا: القواعد التي تحكم الأرقام

1. **الأوزان تجمع 100.** المُثبت لكل عامل ≤ وزنه.
2. **`score = Σ earned`.** لا رقم يُعرض بلا مصدر يفسّره.
3. **ثلاث درجات توثيق فقط:** موثّق (فحص آلي من المصدر) · مرتبط (مصدر متصل بلا فحص كامل) · ذاتي (كتبه المستخدم).
4. **الدليل الذاتي لا يدخل المطابقة.** يُعرض في الملف ولا يُحتسب.
5. **التقادم يُطبَّق عند القراءة** لا عند الكتابة — احسب الوزن الحالي من `date` + نصف العمر.
6. **قوّة الملف** = دالة في (نسبة الموثّق، تنوّع المصادر، الحداثة، تغطية القدرات). ليست عدد المهارات.

---

## أرقام النموذج للاختبار

استخدموها كـ fixtures — الواجهة مضبوطة عليها:

- المستخدم: 11 دليلًا = **6 موثّق + 3 مرتبط + 2 ذاتي**
- قوّة الملف: **72**
- تقييم المحاكاة: **85** من (فهم 85 · تجربة 90 · بنية 75 · منطق 88)
- Skill DNA: Problem Solving 88✓ · UI/UX 85✓ · Product 78✓ · Mobile 70✗ · Backend 65✗
- تغطية المشروع: **65%**
- المرشّح ماجد: **78 → 91** بعد التحدي، والعوامل تجمع 100 والمُثبت يجمع 78 ثم 91
