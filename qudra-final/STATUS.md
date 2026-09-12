# STATUS.md — ملخص الحالة الحالية

> **آخر تحديث**: 2026-09-12
> هذا الملف يُحدَّث بعد كل مهمة منجزة (راجع `قواعد.md` القسم 43 و46). يعكس حقيقة آخر نقطة توقف فعلية.

---

## المرحلة الحالية: Phase 2 — ربط الباك إند + إصلاح الأنواع + تسجيل المسارات

### ما تم إنجازه في هذه الجلسة (2026-09-12)

1. **إصلاح أخطاء TypeScript (100 → 0)**:
   - إعادة كتابة كاملة لأنواع `Challenge`, `GapDetail`, `GrowthMilestone`, `Opportunity`, `LearningResource` في `types.ts` لتطابق ما تتوقعه الصفحات فعلياً.
   - إضافة نوع `GrowthPlan` كغلاف لـ `milestones` + `goal` + `currentState` + `gapIds`.
   - تحديث `store.ts` ليرجع `GrowthPlan` بدل `GrowthMilestone[]`.
   - إصلاح `tsconfig.json` (إزالة `baseUrl` المتقادم، تصحيح `paths`).
   - إصلاح عرض `requirements` و `evaluationCriteria` في صفحات التحديات (استخدام `.id` و `.label` بدل الكائن نفسه).

2. **فحص الـ Backend الحقيقي (Swagger/OpenAPI)**:
   - استخراج كل endpoints المتوفرة من `https://qudra-5tqh.onrender.com/openapi.json`.
   - **Endpoints موجودة فعلياً ومربوطة في الفرونت:**
     - `POST /api/v1/auth/register` — ربط حقيقي ✅
     - `POST /api/v1/auth/login` — ربط حقيقي ✅
     - `GET /api/v1/users/me` — ربط حقيقي ✅
     - `GET /api/v1/users/me/capabilities` — ربط حقيقي ✅
     - `GET /api/v1/users/me/capability-profile` — ربط حقيقي ✅
     - `GET /api/v1/capabilities` — ربط حقيقي ✅
     - `POST /api/v1/capabilities` — ربط حقيقي ✅
     - `GET /api/v1/capabilities/{id}` — ربط حقيقي ✅
     - `GET /api/v1/projects` — ربط حقيقي ✅
     - `POST /api/v1/projects` — ربط حقيقي ✅
     - `GET /api/v1/projects/{id}` — ربط حقيقي ✅
     - `PATCH /api/v1/projects/{id}` — ربط حقيقي ✅
     - `POST /api/v1/projects/{id}/capabilities` — ربط حقيقي ✅
     - `GET /api/v1/evidence` — ربط حقيقي ✅
     - `POST /api/v1/evidence` — ربط حقيقي ✅
     - `POST /api/v1/problems` — ربط حقيقي ✅
     - `GET /api/v1/problems` — ربط حقيقي ✅
     - `GET /api/v1/problems/{id}` — ربط حقيقي ✅
     - `POST /api/v1/problems/{id}/analyze` — ربط حقيقي ✅
     - `GET /api/v1/problems/{id}/analysis` — ربط حقيقي ✅

   - **Endpoints غير موجودة بالباك إند (BACKEND BLOCKED):**
     - Challenges — لا يوجد endpoint للتحديات
     - Candidates/Matching — لا يوجد endpoint للمطابقة أو ترتيب المرشحين
     - Opportunities — لا يوجد endpoint للفرص
     - Gaps/Growth Plan — لا يوجد endpoint للفجوات أو خطط النمو
     - Resources — لا يوجد endpoint لمصادر التعلم
     - Organizations — لا يوجد endpoint للمؤسسات
     - Connections/Messages — لا يوجد endpoint للتواصل
     - GitHub OAuth — لا يوجد endpoint للربط مع GitHub
     - Admin — لا يوجد endpoint للإدارة
     - Email Verification — لا يوجد endpoint للتحقق من البريد

3. **تسجيل جميع المسارات (Route Registration)**:
   - كان 39 route معرّف في `routes.ts` لكن غير مسجل في الراوتر.
   - تم تسجيل جميع المسارات لكل الصفحات الموجودة (Company, Challenges, Gaps, Opportunities, Resources, Settings, Network, Organization, Admin, System, Analyzing).
   - إضافة مسارات ديناميكية: `/challenges/:id`, `/gaps/:id`, `/opportunities/:id`, `/resources/:id`, `/company/candidates/:id`.

4. **تحديث .env.example**:
   - تغيير `VITE_API_BASE_URL` من `http://localhost:8000` إلى `https://qudra-5tqh.onrender.com`.

5. **فحص Supabase**: `grep -ri "supabase"` → **صفر نتائج**. لا وجود لأي إشارة Supabase.

6. **بوابات الجودة (2026-09-12)**:
   - `npm run build`: **0 أخطاء TypeScript، بناء ناجح** ✅
   - `npm run typecheck`: **0 أخطاء** ✅
   - `npm run lint`: **0 أخطاء و 0 تحذيرات** ✅

---

## الخطوة التالية المتاحة للمشروع
- ربط صفحات Company Flow بـ `ProblemsService` الفعلي (إنشاء مشكلة + تحليل AI).
- إضافة Loading/Error states للصفحات التي تستدعي الـ API.
- بناء endpoints ناقصة في الباك إند للتحديات، الفرص، الفجوات، GitHub OAuth.
- اختبار رحلة المستخدم الكاملة مع الباك إند الحي.
