# مهمة FE-P01 — بوابة الانطلاق والاستيراد واللوحة الرئيسية (18 شاشة)

- **التاريخ**: 2026-10-12
- **الحالة**: `VERIFIED` (Playwright حقيقي 18/18 + typecheck صفر + صفر console errors)
- **الفرع**: العمل بقي uncommitted على `feat/fe-p04-learning-and-trust` (فرع `feat/fe-p01-entry-and-home` موجود مسبقاً والشجرة مختلطة — راجع DECISIONS 016)

---

## 1. الدافع والنطاق
بناء F-01 (المكتبة المشتركة) + M09 (محرك الخطوة التالية) + M04 (مركز الاستيراد) + M02 (اللوحة التنفيذية بست حالات) — 18 شاشة ارتكاز بجودة جذرية دون placeholders.

## 2. ما تم إنجازه
1. **المسارات**: 17 مساراً جديداً في `constants/routes.ts` + lazy imports وتسجيل في `app/router/routes.tsx`.
2. **خدمة `services/gaps-data.ts`**: الفجوة الكبرى بالترجيح + إجراء واحد + ثقة/مجاهيل (مصدّرة من `services/index.ts`).
3. **`src/pages/next/m09/`**: الست شاشات (Q-0321/0323/0324/0327/0349/0351) + `m09.module.css`.
4. **`src/pages/import/m04/`**: الست شاشات (Q-0121/0123/0124/0127/0149/0151) + `m04.module.css` — PAT بالذاكرة فقط.
5. **`src/pages/home/m02/`**: خمس شاشات (Q-0043/0044/0047/0069/0071) + `m02.module.css` بجانب `HomePage` (Q-0041).
6. **ErrorBoundary**: `MainLayout > Outlet` مع `resetKeys=[pathname]` + `App > RouterProvider`.
7. **سكربتات `scripts/verify-{m09,m04,m02}.cjs`** + اختصارات npm + 18 لقطة في `verification/`.

## 3. التحقق (أدلة، لا ادعاءات)
- `npm run typecheck` → **0 errors** (قبل وبعد تعديل ErrorBoundary).
- `verify-m09.cjs` → **6/6 PASS**، console errors 0، pageerrors 0.
- `verify-m04.cjs` → **6/6 PASS** + `SECURITY-PASS` (لا token/PAT في storage).
- `verify-m02.cjs` → **6/6 PASS**، console errors 0.
- السيرفر: `http://127.0.0.1:5174` (5173 كان مشغولاً). المتصفح: Chrome حقيقي `channel: 'chrome'`.
- السجلات: `C:\Users\msi\AppData\Local\Temp\opencode\verify2-{m09,m04,m02}.log` + `typecheck2.log`.

## 4. مشاكل وُجدت وأُصلحت
- `AnchorNav`: استخدام `isActive` خارج النطاق (سطر `aria-current`) → حُذف السطر.
- `Badge`: توسيع variants (`outline/claimed/info`) + `leftIcon` لدعم الشاشات الجديدة.
- `M09DetailsPage`/`M04DetailsPage`: fallback عند غياب الـ param (الفجوة الأساسية / linkedin).
- `M09ResultsPage`: وسم إغلاق خاطئ `</h3>` → أُصلح.
- سباق لقطة Q-0151 مع reload الـ retry → اللقطة قبل النقر + انتظار الاستقرار (نفس الحماية لـ Q-0071).
- تسمية زر Q-0071 ("إعادة المحاولة" لا "الآن") → حُدّث المحدد.

## 5. بنود معلّقة (بانتظار حسين)
- نص Q-0149 الحرفي: لا مصدر له في المستودع (DECISIONS 015) — النص الحالي وظيفي مؤقت.
- مراجعة RTL/Dark Mode/Responsive يدوياً للشاشات الـ18.
- قرار الـ commit/الفرع.

## 6. ملفات التتبع المحدّثة
`STATUS.md` + `TASKS.md` (FE-P01.1–6) + `TEST_REPORT.md` + `PROJECT_MAP.md` + `DECISIONS.md` (015/016) + `CHANGELOG.md` + هذا السجل.
