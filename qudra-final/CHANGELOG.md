# CHANGELOG.md — سجل التغييرات

> يُحدَّث بعد كل مهمة منجزة، بصيغة تشبه Conventional Commits حيثما أمكن.

---

## [Unreleased]

### docs — 2026-09-04 — الدمج النهائي (v2)
- **دمج حزمتي توثيق موازيتين** (نُسِجتا في جلستين منفصلتين) في نسخة نهائية واحدة معتمدة — راجع `DECISIONS.md` القرار 006 للتفاصيل الكاملة.
- إضافة `QUDRA_FINAL_BOLT_PROMPT.md`: برومبت تنفيذي كامل (v1.2) بمعرّفات Quality Gate قابلة للتتبع (QG-01 → QG-30)، 44 قسماً، ترتيب Phases تنفيذي دقيق.
- إضافة `PROJECT_MAP.md`: خريطة تفصيلية لكل ملف كود (فارغة حالياً، تُملأ إلزامياً أثناء التنفيذ).
- إضافة القسمين 46-47 لـ `قواعد.md`: منع الادّعاء الكاذب (`100% verified` بدون دليل) وقاعدة Dead UI، وقابلية استبدال Mock بـ API دون إعادة كتابة الصفحات.
- إضافة أولويات MVP الرسمية (P0–P3) إلى `README.md`.
- توحيد `AGENTS.md`/`CLAUDE.md` (كانا متعارضين بعد تحديث أحدهما فقط) في ملف `AGENTS.md` واحد نهائي.
- تحديث `SKILLS.md` بأوامر `npx skills find` / `npx skills add` الفعلية القابلة للتنفيذ في Terminal بولت.
- توسعة بروتوكول التوثيق: إضافة `.memory/tasks/YYYY-MM-DD_<TASK-ID>.md` كسجل تفصيلي إلزامي لكل مهمة.

### docs — 2026-09-03 — الدمج الأول (v1)
- إنشاء حزمة التوثيق الموحدة الأولى: `README.md`, `قواعد.md`, `SKILLS.md`, `.memory/` (glossary, decisions, notes), وتحديث `TASKS.md`, `STATUS.md`, `DECISIONS.md`, `CHANGELOG.md`, `TEST_REPORT.md`.
- توحيد جميع الملفات المبعثرة السابقة (01_فكرة، 02_قواعد، 03_TASKS، 04_BRD، README القديمة) في مصدر حقيقة واحد لكل موضوع.
- استخراج توكنز الألوان الفعلية من `prototype.html` (بدل الوصف التقريبي) وتوثيقها بدقة في `README.md` و`قواعد.md`.
- تصحيح خط الـ Display المعتمد إلى Readex Pro (حسب `design-system.html`) بدل IBM Plex Sans Arabic المذكور خطأً في نسخ قديمة من ملف القواعد.

---

## كيف تُضاف مهمة جديدة لهذا السجل

```markdown
## [YYYY-MM-DD]

### feat | fix | docs | refactor | style | test | chore
- وصف موجز وواضح للتغيير، بصيغة الفعل الحاضر (مثال: "إضافة مكوّن Tag بحالتي proven/claimed").
```
