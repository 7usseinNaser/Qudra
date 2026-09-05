# Task: B0_ALL_SCREENS_RECONSTRUCTION — بناء وترابط كامل واجهات قُدرة الـ 22 بدون استثناء

- **التاريخ**: 2026-09-05
- **الحالة**: `VERIFIED` (تم الفحص الآلي بالكامل عبر بروتوكول Chrome DevTools Protocol وخلو الكونسول من الأخطاء)
- **المهمة التنفيذية**: إعادة بناء وترابط كامل شاشات `prototype.html` الـ 22 في تطبيق React + TypeScript + CSS Modules مع التوجيه الثنائي الكامل والشريط العلوي الموحّد ومنع أي روابط ميتة.

---

## 1. الملفات المنشأة والمحدّثة

### أ. البنية التحتية والملاحة والتوجيه:
- `src/constants/routes.ts`: ثوابت المسارات لجميع الشاشات الـ 22.
- `src/contexts/RoleContext.tsx`: سياق الدور والمستخدم مع دعم تبديل الأدوار وتحديث البيانات.
- `src/components/layout/TopBar.tsx` & `TopBar.module.css`: الشريط العلوي الموحّد مع التبديل اللحظي بين «مشكلتي» و«ملفي»، شريط الخطوات الست لمسار المشكلة، شريط التبويبات السبعة لمسار صاحب القدرة، وتبديل الوضع الداكن/الفاتح.
- `src/components/layout/MainLayout.tsx`: التخطيط الموحّد الذي يجمع TopBar والمحتوى عبر `<Outlet />`.
- `src/app/router/routes.tsx`: Router الشامل الذي يربط جميع الشاشات.

### ب. شاشات بوابة الدخول:
- `src/pages/auth/SignUpPage.tsx` & `SignUpPage.module.css` (`/signup`): مطابقة `#auth`.
- `src/pages/auth/LoginPage.tsx` & `LoginPage.module.css` (`/login`): مطابقة `#slogin`.
- `src/pages/onboarding/RoleSelectPage.tsx` & `RoleSelectPage.module.css` (`/onboarding/role`): اختيار الدور.
- `src/pages/invite/InvitePage.tsx` & `InvitePage.module.css` (`/invite/:id`): شاشة دعوة الفريق الواردة لمشروع `#inv`.

### ج. شاشات مسار صاحب المشكلة وامتدادات الفريق:
- `src/pages/dna/SkillDnaPage.tsx` & `SkillDnaPage.module.css` (`/skill-dna`): البصمة الخماسية SVG والتلميحات الحية وزر البصمة الفارغة.
- `src/pages/result/ResultPage.tsx` & `ResultPage.module.css` (`/result`): نسبة التغطية 65%، تفصيل الذكاء الاصطناعي والبشري، وتوزيع الفريق.
- `src/pages/candidates/CandidatesPage.tsx` & `CandidatesPage.module.css` (`/candidates`): قائمة المرشحين الخمسة وفلاتر المطابقة.
- `src/pages/candidates/CandidateDetailPage.tsx` & `CandidateDetailPage.module.css` (`/candidates/:id`): بطاقة المرشح، الأسباب الستة، وتحدي TurnBox وقفزة الدرجة لـ 91%.
- `src/pages/compare/ComparePage.tsx` & `ComparePage.module.css` (`/compare`): المقارنة بالبصمة المتراكبة المزدوجة SVG لمرشحين والحكم الذكي.
- `src/pages/candidates/ReRankingPage.tsx` (`/re-ranking`): تصدر ماجد المركز الأول وحلقة الأثر الرباعية.
- `src/components/common/InviteModal.tsx` & `InviteModal.module.css`: نافذة دعوة المرشح لاختبار عملي.

### د. مسار صاحب القدرة والملف الشخصي:
- `src/pages/profile/ProfilePage.tsx` & `ProfilePage.module.css`:
  - `u1` (Dashboard): شريط الإحصائيات الأربعة، بطاقات القدرات، وقوة الملف 72%.
  - `u0` (Sources): مصادر الأدلة الأربعة.
  - `u3` (Evidence): سجل الأدلة الـ 11 وفلاتر التحقق الثلاثة.
  - `evd` (EvidenceDetail): تحليل المحتوى، طريقة الفحص، وأثر الدليل (+12 Backend).
  - `u6` (Timeline): مسار التطور عبر الزمن برسم بياني SVG تفاعلي عبر 16 شهراً وقصص التطور.
  - `u2` (Gaps): جاهزية 68% ومحطات التعلم الأربع.
  - `u4` (Opportunities): أربع فرص عمل حقيقية مع أسباب التطابق.
  - `u5` (Passport): بطاقة الإثبات وجواز القدرات البديل للسيرة الذاتية ورابط المشاركة.

---

## 2. التحقق الآلي الصارم عبر Chrome CDP

تم تشغيل سكريبت فحص أوتوماتيكي متكامل عبر Chrome DevTools Protocol (`scratch/test_all_22_screens.mjs`):
1. **فحص وجود عناصر الإثبات لجميع الشاشات الـ 23**: نجحت جميعها (`true`).
2. **فحص تبديل الدور اللحظي**:
   - النقر على `#rC` («مشكلتي») ⬅️ انتقل تلقائياً للمسار `/problem`.
   - النقر على `#rU` («ملفي») ⬅️ انتقل تلقائياً للمسار `/profile`.
3. **فحص تبديل الوضع الداكن**: تم بنجاح وتغيّر سمة المظهر `data-theme`.
4. **فحص تحدي المرشح (TurnBox)**: قفزت النتيجة من `78%` إلى `91%` حقيقياً في الـ DOM.
5. **فحص الكونسول**: `Total console errors: 0` (صفر أخطاء نهائياً).
6. **فحص TypeScript & Production Build**:
   - `npx tsc --noEmit` انتهى بكود 0 دون أي أخطاء.
   - `npm run build` انتهى في 2.08 ثانية مع توليد كافة الحزم (Chunks) بنجاح.
