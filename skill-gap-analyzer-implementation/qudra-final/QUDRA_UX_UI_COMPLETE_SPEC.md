# QUDRA — Complete UX/UI Screen & User Flow Specification

> **Version:** 1.0 — 2026-09-09  
> **Purpose:** المرجع التنفيذي لتصميم وبناء جميع شاشات قُدرة، وترابطها، وحالاتها، وقواعد UX/UI.  
> **Language:** Arabic-first / RTL  
> **Rule:** يجوز تحسين التنفيذ التقني أو إضافة حالات دفاعية، لكن لا يجوز حذف أو تغيير متطلب موثق هنا دون قرار صريح.

---

## 1. Product North Star

قُدرة هي منصة لإثبات **القدرة المهنية بالأدلة**، وليس منصة لعرض الادعاءات فقط.

### المبدأ الأساسي

`Claim ≠ Evidence`

### الحلقة الأساسية

```text
Identity
→ Evidence
→ AI Analysis
→ Capability Profile
→ Skill Levels + Gaps
→ Growth Plan
→ Learning / Practice
→ New Evidence
→ Capability Update
→ Opportunities / Matching
→ Real Work
→ More Evidence
```

### النموذج

```text
PROVE → GROW → CONNECT
           ↓
     OPPORTUNITIES
           ↓
        REAL WORK
           ↓
        EVIDENCE
```

---

## 2. قرارات المنتج غير القابلة للتفاوض

### الهوية

- حساب إنسان واحد يمكنه العمل كمستخدم موهوب ومالك مشكلة معاً.
- لا يوجد Role ثابت يقيّد الحساب.
- المسمى الوظيفي حر.
- يمكن للذكاء الاصطناعي اقتراح مسمى معياري داخلي للبحث والمطابقة.
- مثال: `Senior React Wizard` → `Senior Frontend Developer`.

### الدخول

المستخدم يدخل المنصة ويستكشفها مباشرة.

لا يوجد Gate إجباري يمنع الوصول بسبب نقص الملف.

لكن يجب أن يكون **استكمال الأدلة أولوية UX واضحة** لأن التحليل والتطوير والمطابقة تصبح أدق كلما اكتمل الملف.

### الحد الأدنى للهوية

- الاسم
- الصورة
- العنوان المهني
- المسمى الوظيفي
- المجال
- الهدف الحالي

### مصادر القدرة

- GitHub
- Skills
- Certificates
- Experience
- Education
- Projects
- Achievements
- Volunteering
- Competitions
- Teams

---

## 3. Master Profile

الـMaster Profile يبنيه النظام تلقائياً ويتحدث باستمرار.

المستخدم يراه، لكنه لا يعيد كتابة النتائج المشتقة من النظام مباشرة.

يمكنه:

- إضافة Evidence
- تعديل المصدر
- استبعاد Repository
- تصحيح بيانات مصدر
- الاعتراض على تحليل
- إضافة دليل جديد

النظام يبني:

- Detected Skills
- Skill Levels
- Evidence
- Evidence Strength
- Project Analysis
- Capability Scores
- Skill Gaps
- Confidence
- Match Factors
- Growth Recommendations

### قاعدة العرض

لا نحذف Claim المستخدم، ولا نخلطه بالدليل.

مثال:

```text
Senior React Developer
Self-claimed

React
Advanced — evidence-backed
```

---

## 4. Capability Levels

لا تستخدم قاعدة:

`5 مشاريع = Senior`

بل يعتمد المستوى على:

```text
Evidence Quantity
+ Evidence Quality
+ Complexity
+ Recency
+ Diversity
+ Assessment
+ Independence
+ Architecture
+ Testing
+ Real-world Outcome
```

يمكن لمشروع واحد قوي أن يكون أهم من عشرة مشاريع بسيطة.

المستوى يكون لكل قدرة، وليس مستوى واحداً إجبارياً للشخص كله.

مثال:

```text
Frontend → Senior
React → Advanced
Backend → Junior
Laravel → Beginner
```

---

## 5. Evidence Trust

الحالات:

```text
CLAIMED
→ SUPPORTED
→ VERIFIED
→ COMPANY CONFIRMED
```

التوظيف:

```text
Self-Claimed
→ Workplace Verified
→ Company Confirmed
```

التحقق المفضل:

1. بريد الشركة المهني
2. تأكيد الشركة
3. آلية بديلة مستقبلية للحالات التي لا تملك نظام بريد مناسباً

تحقق الشركة:

```text
Unverified
→ Partially Verified
→ Verified
```

التحقق يزيد الثقة والصلاحيات، ولا يمنع إنشاء الحساب.

---

## 6. GitHub

GitHub هو المصدر الأساسي الأولي للأدلة.

يدعم:

- OAuth
- Public repositories
- Private repositories بإذن صريح
- اختيار Repository لكل مشروع
- Include / Exclude
- Completed / Incomplete
- Scheduled Sync
- Manual Scan

### التحليل

```text
Repository
→ Basic Validation
→ Project Classification
→ Relevance
→ Completeness
→ Technical Analysis
→ Evidence Extraction
→ Evidence Confidence
```

لا يعاد تحليل كل المشاريع عند تعديل مشروع واحد.

```text
Stored Snapshot
→ Current GitHub State
→ Diff
→ Changed Repositories Only
→ Incremental Analysis
```

### الفحص

تعرض الواجهة:

```text
آخر فحص: ...
X مستودعات تغيّرت
[مراجعة التغييرات]
```

---

## 7. AI

في البداية يستخدم المشروع نموذجاً أساسياً واحداً لتقليل التكلفة، مثل Gemini.

الذكاء الاصطناعي:

- يحلل
- يستخرج Signals
- يستخرج Evidence
- يقدّر Confidence
- يقترح Capability Level
- يكتشف Gaps

لكنه **لا يثبت الحقيقة وحده**.

Trust Stack:

```text
Git History
+ Live Demo
+ Activity
+ Documentation
+ Contribution
+ Challenge
+ Company Confirmation
+ Outcome
```

مستقبلاً يمكن إضافة نموذجين إضافيين عند اعتراض المستخدم، ومقارنة النتائج.

---

## 8. Matching

Match Score قابل للشرح دائماً.

```text
Overall Match =
Skill Match
+ Evidence Match
+ Experience Match
+ Project Similarity
+ Complexity Fit
+ Availability
+ Challenge Performance
+ Other Requirements
```

لا تعرض رقماً بدون تفسير.

مثال:

```text
72%

لماذا؟
+ React
+ خبرة مشابهة
+ مشروعان مشابهـان
- Testing
- Backend
```

زر:

`كيف أرفع المطابقة؟`

يقود إلى Gaps / Growth.

---

## 9. Company Paths

للشركة مساران مستقلان.

### A — Find Talent

يمكنها أن تقول:

> أحتاج React Developer.

وتحدد:

- المسمى
- المسؤوليات
- الخبرة
- المستوى
- Required Skills
- Preferred Skills
- الفريق
- نوع العمل
- المكان/Remote
- التوفر
- الميزانية عند الحاجة
- النتائج المتوقعة

كل Job يحتوي:

1. وصفاً بشرياً تقليدياً
2. متطلبات Structured قابلة للمطابقة

### B — Solve a Problem

```text
Problem
→ Requirements
→ Required Capabilities
→ Matching
→ Candidates / Team
```

الشركة ليست مضطرة للبدء بمشكلة.

---

## 10. Challenges

التحدي اختياري قبل التواصل.

الشركة تستطيع:

- إنشاء Challenge
- تحديد الصعوبة
- تحديد المهلة
- كتابة معايير التقييم
- استخدام تحدٍ موجود وتعديله

اجتياز التحدي يقوي Evidence.

الفشل لا يحذف المرشح؛ يسجل `Not Passed`.

---

## 11. Growth

```text
Goal
→ Gap Analysis
→ Roadmap
→ Recommended Resources
→ Practice
→ Evidence
→ Capability Update
```

المصادر:

- Courses
- Workshops
- Certifications
- Projects
- Challenges

كل توصية تشرح:

- لماذا؟
- أي Gap تغطي؟
- المدة
- السعر
- المستوى
- Provider
- Certificate
- Format
- Language

إكمال دورة وحده ليس Evidence كافية.

---

## 12. Network

النطاق الحالي محدود:

- Connection Requests
- Connections
- Messages
- Groups

مؤجل:

- Full Social Feed
- Likes
- Comments
- Reposts
- Full publishing system

---

# 13. Screen Inventory

> كل شاشة أدناه يجب أن تكون حقيقية ومترابطة. لا توجد أزرار ديكورية.

---

## Q01 — Landing

**الهدف:** شرح قُدرة وتحويل الزائر إلى دخول/تسجيل.

**العناصر:**
- Logo
- Language
- Theme
- Login
- Sign Up
- Hero
- Value Proposition
- Evidence Loop
- Feature Overview
- How It Works
- Trust Explanation
- Footer

**الأزرار:**
- `ابدأ الآن` → Q02
- `تسجيل الدخول` → Q03
- `استكشف` → Public Discover

---

## Q02 — Sign Up

**العناصر:**
- Name
- Email
- Phone عند الحاجة
- Password
- Confirm Password
- Terms
- Sign Up
- Login Link

**النتيجة:** → Q04

لا تجمع التاريخ المهني الكامل هنا.

---

## Q03 — Login

**العناصر:**
- Email
- Password
- Remember
- Login
- Forgot Password
- Create Account

**التنقل:**
- Login → Q05
- Forgot → Password Recovery
- Create → Q02

---

## Q04 — Email Verification

**العناصر:**
- Email
- Verification State
- Resend
- Change Email
- Continue

**الحالات:**
- Waiting
- Verified
- Expired
- Cooldown
- Error

---

## Q05 — Basic Identity

**العناصر:**
- Avatar
- Name
- Headline
- Job Title
- Field
- Current Goal

**CTA:** `دخول إلى قدرة` → Q06

---

## Q06 — First Intent Prompt

**العناصر الأربعة:**
- `أثبت قدراتي`
- `طوّر نفسك`
- `حل مشكلة / ابحث عن أشخاص`
- `ابحث عن فرصة`

هذه توصية وليست Gate.

يمكن تخطيها → Q07.

---

## Q07 — Personalized Home

**العناصر:**
- Greeting
- Current Goal
- Profile/Evidence Status
- Capability Progress
- Strongest Capabilities
- Biggest Gaps
- Recommended Next Action
- Personalized Opportunities
- Recent Evidence
- Connection Activity

**الأولوية:** Evidence completion.

---

## Q08 — Discover

**العناصر:**
- People
- Organizations
- Opportunities
- Learning
- Challenges
- Search
- Contextual Filters

---

## Q09 — People Directory

**العناصر:**
- Search
- Skill Filters
- Capability Level
- Availability
- Verification
- Person Cards

**Card:**
- Avatar
- Name
- Title
- Strong Skills
- Evidence Status
- Connect
- View Profile

---

## Q10 — Public Person Profile

**العناصر:**
- Identity
- Headline
- Claimed Title
- QUDRA Capability Highlights
- Skills
- Evidence
- Projects
- Experience
- Education
- Verification
- Connection State

**Actions:**
- Connect
- Message if allowed
- View Evidence
- View Project

---

# 14. Profile & Evidence

## Q11 — My Profile

**الأقسام:**
- Identity
- Claimed Title
- Normalized Title
- Goals
- Capability Summary
- Evidence
- Experience
- Education
- Certificates
- Projects
- Achievements
- Volunteering
- Competitions
- Teams

يجب الفصل بصرياً بين User-editable وSystem-derived.

---

## Q12 — Profile Completion

**العناصر:**
- Completion Progress
- Missing Evidence
- Impact
- Recommended Order

كل عنصر يفتح شاشة الإضافة الخاصة به.

---

## Q13 — Evidence Sources

**المصادر:**
- GitHub
- Certificates
- Projects
- Assessments
- Challenges
- Employment
- Future integrations

لكل مصدر:
- Connected State
- Last Scan
- Evidence Count
- Verification
- Refresh

---

## Q14 — GitHub Connect

**العناصر:**
- Permission Explanation
- Public/Private Explanation
- Connect CTA
- Privacy Note

→ OAuth → Q15

---

## Q15 — Repository Selection

كل Repository يعرض:
- Name
- Visibility
- Language
- Last Update
- Activity
- Relevance Preview
- Include/Exclude
- Completed/Incomplete

**Actions:**
- Select
- Exclude
- Select All
- Continue → Q16

---

## Q16 — GitHub Scan

**مراحل التقدم:**

```text
Connecting
→ Fetching
→ Validating
→ Classifying
→ Relevance
→ Technical Analysis
→ Evidence Extraction
→ Profile Update
```

**الحالات:**
- Processing
- Partial Success
- Failed Repository
- Permission Error
- Retry

---

## Q17 — Repository Analysis Summary

**العناصر:**
- Classification
- Relevance
- Completeness
- Technologies
- Architecture
- Testing
- Documentation
- Quality Signals
- Evidence
- Confidence

**Actions:**
- Full Analysis → Q18
- Exclude
- Challenge Analysis
- Affected Skills → Q28

---

## Q18 — Repository Detail

**العناصر:**
- Repository Identity
- Source
- Purpose
- Technologies
- Architecture
- Testing
- Documentation
- Contribution
- Activity
- Strengths
- Weaknesses
- Extracted Evidence
- Confidence

**Actions:**
- Open GitHub
- Exclude
- Report Analysis
- View Skills

---

## Q19 — Evidence Vault

**Filters:**
- All
- Proven
- Supported
- Claimed
- Source
- Skill
- Date

**Evidence row:**
- Source
- Type
- Skill
- Date
- Status
- Confidence
- Project
- Capability

---

## Q20 — Evidence Detail

**العناصر:**
- Evidence
- Source
- Status
- Strength
- Skills
- Projects
- Why It Matters
- Analysis
- Date
- Source Link

**Actions:**
- Inspect
- Add Related Evidence
- Challenge Analysis

---

## Q21 — Add Certificate

**الحقول:**
- Name
- Provider
- Issue Date
- Expiry
- Credential ID
- Verification URL
- Source/Upload
- Related Skills

Save → Analysis Event.

---

## Q22 — Add Experience

**الحقول:**
- Organization
- Title
- Start/End
- Employment Type
- Description
- Skills
- Proof Method

→ Q23 for verification.

---

## Q23 — Employment Verification

**العناصر:**
- Company
- Professional Email
- Company Confirmation
- Status
- Instructions

**الحالات:**
- Self-Claimed
- Email Sent
- Workplace Verified
- Company Confirmation Pending
- Company Confirmed
- Rejected

---

## Q24 — Add Education

**الحقول:**
- Institution
- Degree
- Field
- Dates
- Credential
- Verification

---

## Q25 — Add Project

**الحقول:**
- Name
- Description
- Role
- Technologies
- GitHub
- Live Demo
- Status
- Team
- Outcome

المشروع اليدوي يبقى Claim حتى يدعمه Evidence.

---

## Q26 — Add Achievement / Competition / Volunteering / Team

Reusable evidence form:

- Title
- Organization
- Date
- Description
- Role
- Evidence
- Related Skills

---

# 15. Capability Intelligence

## Q27 — Master Profile Overview

**العناصر:**
- Capability Summary
- Confidence
- Strongest Capability
- Biggest Gap
- Last Analysis
- Capability Cards

كل Card:
- Skill
- Level
- Progress
- Evidence Count
- Confidence
- Gap

---

## Q28 — Capability Detail

**العناصر:**
- Skill
- Level
- Progress
- Supporting Evidence
- Quality
- Complexity
- Recency
- Assessment
- Outcomes
- Missing Evidence
- Next Action

CTA → Q33 Gap Detail.

---

## Q29 — Capability DNA

يعرض مفهوم DNA/Signature الموجود في البروتوتايب.

Semantic:
- Proven → Turquoise
- Gap/Claimed → Amber

لا تعتمد على اللون وحده؛ يجب وجود نص واضح.

---

## Q30 — Capability Progress History

Timeline:

```text
Evidence Added
→ Analysis
→ Capability Changed
→ Gap Changed
→ Match Changed
```

كل حدث:
- Date
- Event
- Before
- After
- Reason

---

## Q31 — Why This Level?

**العناصر:**
- Conclusion
- Evidence
- Criteria
- Confidence
- Missing Evidence
- Improvement Path

لا تعرض Senior/Advanced بدون تفسير.

---

# 16. Growth

## Q32 — My Gaps

**الأقسام:**
- Critical
- Moderate
- Optional

كل Gap:
- Current
- Target
- Impact
- Evidence Missing
- Recommended Action

---

## Q33 — Gap Detail

**العناصر:**
- Gap
- Current Evidence
- Missing Evidence
- Target
- Estimated Path
- Resources
- Challenge
- Project

CTA → Q34.

---

## Q34 — Growth Plan

```text
Goal
↓
Current State
↓
Gaps
↓
Milestones
↓
Resources
↓
Practice
↓
Evidence
```

Actions:
- Start Milestone
- Open Resource
- Mark Progress
- Start Challenge

---

## Q35 — Resource Discovery

**Filters:**
- Type
- Price
- Duration
- Difficulty
- Provider
- Certificate
- Language
- Format
- Rating

**Card:**
- Title
- Provider
- Duration
- Price
- Rating
- Level
- Why Recommended

---

## Q36 — Resource Detail

**العناصر:**
- Title
- Provider
- Description
- Duration
- Price
- Format
- Language
- Certificate
- Ratings
- Related Gap
- Why Recommended

CTA → External Resource.

---

## Q37 — Challenge Library

Filters:
- Skill
- Difficulty
- Duration
- Type
- Source

Card:
- Challenge
- Skill
- Difficulty
- Expected Time
- Evidence Value

---

## Q38 — Challenge Detail

**العناصر:**
- Problem
- Requirements
- Difficulty
- Deadline
- Evaluation Criteria
- Evidence Outcome

CTA → Q39.

---

## Q39 — Challenge Workspace

**العناصر:**
- Instructions
- Deadline/Timer
- Submission
- Save
- Submit
- Exit Confirmation

States:
- Not Started
- Active
- Submitted
- Expired
- Evaluated

---

## Q40 — Challenge Result

**العناصر:**
- Result
- Strengths
- Weaknesses
- Criteria
- Generated Evidence
- Capability Impact

Failure remains recorded as `Not Passed`.

---

# 17. Opportunities

## Q41 — Opportunities Home

Types:
- Jobs
- Freelance
- Internships
- Scholarships
- Grants
- Hackathons
- Company Challenges

كل فرصة شخصية، وليست قائمة عامة فقط.

---

## Q42 — Opportunity Search

Filters:
- Type
- Field
- Remote/On-site
- Location
- Experience
- Compensation/Budget
- Duration
- Verified Organization
- Date

---

## Q43 — Opportunity Detail

**العناصر:**
- Title
- Organization
- Description
- Requirements
- Structured Requirements
- Match %
- Why Match
- Evidence
- Gaps
- Apply

---

## Q44 — Match Explanation

يعرض العوامل:

```text
Skills
Evidence
Experience
Project Similarity
Complexity
Availability
Challenge
```

كل عامل معه تفسير.

Actions:
- View Evidence
- Close Gap
- Apply

---

## Q45 — Application / Interest

**العناصر:**
- Opportunity
- Selected Evidence
- Message
- Profile Preview
- Submit

Confirmation يجب أن يوضح ما تمت مشاركته.

---

# 18. Company / Hiring

## Q46 — Company Home

**العناصر:**
- Organization Identity
- Verification
- Open Roles
- Problems
- Candidate Activity
- Saved Candidates
- Team Activity

Actions:
- Find Talent → Q47
- Solve Problem → Q55
- Post Job → Q48

---

## Q47 — Find Talent

**الحقول:**
- Role
- Seniority
- Required Skills
- Preferred Skills
- Experience
- Team
- Responsibilities
- Employment Type
- Availability
- Budget
- Location/Remote

CTA → Q49.

---

## Q48 — Job Definition

### Human layer
- Title
- Summary
- Responsibilities
- Team
- Context
- Expected Outcomes

### Structured layer
- Skills
- Levels
- Experience
- Constraints
- Availability
- Complexity
- Required Evidence

CTA → Q49.

---

## Q49 — Requirement Analysis

**العناصر:**
- Extracted Capabilities
- Required Levels
- Confidence
- Ambiguities
- Suggested Normalization

Actions:
- Edit
- Accept AI Suggestion
- Continue → Q50

---

## Q50 — Candidate Results

كل Card:
- Name
- Normalized Title
- Match %
- Strong Matches
- Evidence Count
- Availability
- Verification
- Challenge Status
- View
- Compare
- Invite

لا تعتمد على raw score فقط.

---

## Q51 — Candidate Detail

**الأقسام:**
- Identity
- Match
- Capabilities
- Evidence
- Projects
- Experience
- Challenges
- Gaps
- Availability
- Connection

Actions:
- Invite
- Connect
- Message
- Compare

---

## Q52 — Candidate Comparison

جدول:

- Skill
- Level
- Evidence
- Project Similarity
- Complexity
- Experience
- Challenge

وفي الأسفل:

`لماذا يتقدم هذا المرشح؟`

---

## Q53 — Company Challenge

**الحقول:**
- Title
- Skill
- Difficulty
- Deadline
- Instructions
- Evaluation Criteria
- Submission
- Evidence Generated

Actions:
- Draft
- Publish
- Invite

---

## Q54 — Invite Candidate

**العناصر:**
- Candidate
- Opportunity/Problem
- Message
- Optional Challenge
- Response Date

CTA → Send.

---

## Q55 — Problem Creation

**الحقول:**
- Problem Title
- Description
- Business Context
- Desired Outcome
- Constraints
- Budget
- Timeline
- Location/Remote
- Team Size

CTA → Q56.

---

## Q56 — Problem Analysis

AI outputs:
- Summary
- Requirements
- Required Capabilities
- Complexity
- Missing Information
- Suggested Team

Actions:
- Edit
- Accept
- Continue → Q57

---

## Q57 — Problem Candidate Results

يعرض:

- Similar projects
- Matching capabilities
- Evidence
- Match %
- Gaps
- Candidate detail
- Compare
- Invite

---

## Q58 — Team Builder

**العناصر:**
- Required Capabilities
- Selected Candidates
- Coverage Matrix
- Missing Capability
- Overlap
- Team Completeness

CTA → Invite Team.

---

# 19. Organizations

## Q59 — Organization Profile

**العناصر:**
- Logo
- Name
- Description
- Industry
- Website
- Verification
- Team Size
- Employees
- Jobs
- Projects
- Challenges

---

## Q60 — Organization Verification

**العناصر:**
- Domain
- Company Email
- Supporting Documents when required
- Admin Confirmation
- Status

States:
- Unverified
- Partially Verified
- Verified
- Rejected
- Review

---

## Q61 — Organization Members

**العناصر:**
- Members
- Role
- Employment Verification
- Join Status

---

## Q62 — Organization Roles & Permissions

Roles:

```text
Owner
Admin
Manager
Member
```

Owner:
- Assign roles
- Revoke roles
- Manage organization
- Manage verification
- Manage hiring/problem workflows

Manager:
- Assigned workflow management

Member:
- Limited access

---

## Q63 — Organization Dashboard

**العناصر:**
- Jobs
- Problems
- Candidates
- Team
- Verification
- Activity

---

# 20. Network

## Q64 — Connection Requests

Tabs:
- Received
- Sent

Actions:
- Accept
- Reject
- Ignore

---

## Q65 — Connections

**العناصر:**
- Search
- Filters
- People
- Groups
- Message

---

## Q66 — Communication Settings

Options:
- Allow messages before connection
- Allow messages after connection
- Connection request preferences

---

## Q67 — Messages Inbox

**العناصر:**
- Conversations
- Unread
- Search
- Group Indicator
- Last Message
- Timestamp

---

## Q68 — Conversation

**العناصر:**
- Header
- Participant
- Messages
- Composer
- Connection State

Actions:
- View Profile
- Create Group
- Block/Report when safety system exists

---

## Q69 — Create Group

**Rule:** لا يمكن إضافة شخص غير connected.

**العناصر:**
- Group Name
- Avatar
- Connected People Picker
- Selected Members

Validation:

> لا يمكنك إضافة هذا الشخص قبل قبول الاتصال.

---

## Q70 — Group Conversation

**العناصر:**
- Group Header
- Members
- Messages
- Composer
- Group Settings

---

# 21. Notifications & Settings

## Q71 — Notifications

Categories:
- Evidence
- AI Analysis
- Capability
- Gap
- Match
- Opportunity
- Connection
- Message
- Challenge
- Verification

كل Notification يجب أن تفتح الشاشة المناسبة مباشرة.

---

## Q72 — Settings

Sections:
- Account
- Profile Visibility
- Evidence Privacy
- GitHub
- Messaging
- Notifications
- Theme
- Language
- Security
- Connected Accounts

---

## Q73 — Privacy & Evidence Visibility

Controls:
- Public Profile
- Public Evidence
- Private Repositories
- Project Visibility
- Employment Visibility
- Certificate Visibility

Private repository source content must never become public automatically.

---

## Q74 — Connected Accounts

لكل مصدر:
- Connected
- Permissions
- Last Sync
- Disconnect

---

# 22. Admin / Trust

## Q75 — Admin Dashboard

**العناصر:**
- Users
- Organizations
- Verification
- Reports
- AI Jobs
- System Health
- Suspicious Evidence

---

## Q76 — Verification Queue

Filters:
- Employment
- Organization
- Certificates
- Reports

Actions:
- Review
- Approve
- Reject
- Request More Evidence

---

## Q77 — AI Analysis Queue

**العناصر:**
- Pending
- Processing
- Completed
- Failed
- Retry
- Model
- Timestamp
- Affected Profile

---

## Q78 — Evidence Review

**العناصر:**
- Source
- Claim
- Extracted Evidence
- Confidence
- Supporting Signals
- Reviewer Decision

---

# 23. Mandatory System States

## Q79 — Empty State

مثال:

> لا توجد أدلة في ملفك بعد.

CTA:

`أضف أول دليل`

لا توجد شاشة فارغة بلا توجيه.

## Q80 — Loading / Skeleton

Skeleton يجب أن يشبه البنية النهائية.

## Q81 — Error State

يجب أن يوضح:
- ماذا فشل؟
- هل البيانات محفوظة؟
- Retry
- Alternative Action

## Q82 — Permission Error

يوضح الصلاحية المطلوبة ويعطي:
- Reconnect
- Change Permission
- Cancel

## Q83 — AI Failure

يجب أن يوضح:
- المصدر وصل
- التحليل فشل
- الملف لم يتحدث بنتيجة خاطئة

Actions:
- Retry
- Report
- Continue

## Q84 — Unsaved Changes

عند مغادرة Form:
- Continue Editing
- Discard
- Cancel

---

# 24. Event-driven UX

لا يوجد زر عالمي اسمه:

`حلل ملفي`

بدلاً منه:

```text
User adds/changes evidence
→ Event
→ Analysis Job
→ Evidence Extraction
→ Capability Update
→ Master Profile Update
→ Recommendations Update
```

بعد الإضافة:

> تم استلام التعديل. سيتم تحديث ملفك بعد اكتمال التحليل.

---

# 25. Four implementation phases

## Phase 1 — Proof Core

يجب أن تكون الأولوية التنفيذية:

- Authentication
- Identity
- Home
- Profile
- GitHub
- Repository Selection
- Analysis
- Evidence
- Master Profile
- Capability Detail
- Gaps
- Match Explanation

هذا هو قلب عرض الهاكاثون.

## Phase 2 — Matching & Growth

- Opportunities
- Find Talent
- Job Definition
- Problem
- Candidate Ranking
- Candidate Detail
- Compare
- Challenges
- Growth
- Resources

## Phase 3 — Network & Organizations

- Connections
- Messaging
- Groups
- Organization
- Members
- Roles
- Verification

## Phase 4 — Trust, Scale & Monetization

- Advanced verification
- Multi-model analysis
- Advanced challenges
- Contracts
- Premium
- Analytics
- Integrations

---

# 26. Hackathon Golden Path

لا تعرض كل الشاشات في الديمو.

المسار الأقوى:

```text
User
→ Connect GitHub
→ Select Repositories
→ QUDRA Analysis
→ Evidence Extraction
→ Master Profile
→ Capability Levels
→ Gaps
→ Company Creates React Requirement
→ Candidate Matching
→ Explainable Match
→ Candidate Evidence
→ Optional Challenge
```

الرسالة:

> **قُدرة تربط الفرص بالقدرة المثبتة، لا بالادعاءات فقط.**

---

# 27. Implementation Contract

كل شاشة يجب أن يكون لها:

```text
Screen ID
Route
Purpose
Entry Points
Exit Points
Required Data
Optional Data
Components
Primary CTA
Secondary CTA
Destructive Actions
Loading
Empty
Error
Permission
Success
Mobile Behavior
Dark Mode
Accessibility
Analytics Events
Dependencies
```

### Definition of Done

الشاشة لا تعتبر مكتملة لمجرد أنها تظهر.

يجب:

- Route صحيح
- Navigation صحيح
- كل CTA يعمل
- Back يعمل
- Loading
- Empty
- Error
- Permissions
- Responsive
- Dark Mode
- RTL
- Keyboard Accessibility
- Focus States
- Data Relationships
- Success Feedback
- Failure Feedback
- تحديث الشاشات المرتبطة

---

# 28. Design System

## Typography

- IBM Plex Sans Arabic — body/UI
- IBM Plex Mono — numbers/code
- Readex Pro — large display headings

## Semantic Colors

Proven:

```text
#00787A
#00B8B8
```

Gap / Claimed:

```text
#8A6200
#FFC107
```

لا تستخدم اللون وحده كحالة.

RTL-first.

Light + Dark.

---

# 29. Component Architecture

استخدم مكونات Domain مشتركة، ولا تكررها داخل الصفحات.

```text
components/
├── ui/
│   ├── Button
│   ├── Tag
│   ├── Badge
│   ├── Bar
│   ├── Pill
│   ├── Ring
│   ├── Skeleton
│   ├── EmptyState
│   ├── ErrorState
│   └── QudraLogo
│
├── domain/
│   ├── CapabilityCard
│   ├── EvidenceCard
│   ├── EvidenceStatus
│   ├── ProjectCard
│   ├── CandidateCard
│   ├── MatchScore
│   ├── MatchExplanation
│   ├── GapCard
│   ├── OpportunityCard
│   ├── ResourceCard
│   ├── ChallengeCard
│   ├── ProfileHeader
│   ├── VerificationBadge
│   └── OrganizationCard
│
└── layout/
    ├── AppShell
    ├── TopBar
    ├── Sidebar
    ├── MobileNav
    └── PageHeader
```

---

# 30. Current project reality

وفق التدقيق الموثق:

### Confirmed

- Build ينجح.
- TypeScript نظيف.
- 24 Route فريد كانت موجودة قبل توسعة الرؤية الكاملة.
- 10 UI components موجودة.
- Prototype يحتوي مفاهيم Evidence / Matching / Growth / Gaps / Opportunities / DNA / Comparison / Challenge.
- Skeleton وEmpty States وTheme موجودة في prototype.

### Problems

- ESLint يخرج بفشل بسبب 7 تحذيرات غير حرجة.
- Domain components ليست مفصولة كطبقة reusable كاملة.
- منطق Proven/Claimed مكرر في عدة صفحات.
- Tag component موجود لكنه مستخدم في صفحة واحدة فقط بينما صفحات أخرى تكرر المنطق.
- CandidatesPage لديه مشكلة overflow موثقة على 375px.
- Stepper قد يسبب overflow.
- الـ24 route الحالية لا تعني أن الرؤية الكاملة مبرمجة.
- يجب توسيع الـrouting مع بناء الرؤية الكاملة.

لا تدّعِ أن الـ84 شاشة أعلاه موجودة بالفعل في الكود.

---

# 31. Responsive requirements

اختبر على:

- 375px
- 768px
- 1024px
- 1440px+

ممنوع horizontal overflow.

مشكلة CandidatesPage الحالية يجب إصلاحها من أصل التصميم، وليس فقط بإضافة `overflow-x:hidden`.

---

# 32. Product safety rules

1. لا تجعل Claim يبدو كأنه Proof.
2. لا تعرض Match بدون تفسير.
3. لا تجعل AI السلطة الوحيدة للحقيقة.
4. لا تعيد تحليل المستودعات التي لم تتغير.
5. لا تجعل XP مقياس كفاءة.
6. لا تمنع المستخدم من استكشاف المنصة.
7. لا تحوّل قُدرة إلى Social Network.
8. لا تعرض Private Repository publicly.
9. لا تحذف الأدلة السلبية.
10. لا تجعل Challenge إلزامياً قبل التواصل.
11. لا تضيف Payments حالياً.
12. لا تنشئ أزراراً بلا Destination.
13. لا تكرر Domain Components.
14. لا تسمح للـresponsive layout بالانهيار.
15. لا تغير قراراً منتجياً بصمت.

---

# 33. Source hierarchy

عند التعارض:

1. Latest approved Master Decisions
2. هذا الملف
3. BRD المعتمد
4. Design System المعتمد
5. Dev Handoff
6. Existing Prototype
7. Archived Discussions

القرار الأحدث والمعتمد يتفوق على prototype قديم.

---

# 34. Final product sentence

> **قُدرة تساعدك على إثبات ما تستطيع فعله، معرفة ما ينقصك، تطوير قدراتك، ثم الوصول إلى الفرص والأشخاص المناسبين بناءً على أدلة حقيقية.**
