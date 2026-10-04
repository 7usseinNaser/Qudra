# Graph Report - Qudra  (2026-09-09)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 653 nodes · 1530 edges · 40 communities (26 shown, 1 thin omitted)
- Extraction: 89% EXTRACTED · 11% INFERRED · 0% AMBIGUOUS · INFERRED: 161 edges (avg confidence: 0.95)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `387e6b58`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- User
- ProblemAnalysisService
- AppError
- Base
- package.json
- react-router-dom
- ProblemContext.tsx
- oral_evidence_service.py
- routes.tsx
- challenge_service.py
- compilerOptions
- capabilities.py
- TopBar.tsx
- CandidateDetailPage.tsx
- ChallengeRepository
- compilerOptions
- test_auth.py
- react
- test_evidence.py
- LocalStorageService
- UserContext.tsx
- SpeechToTextProvider
- test_capabilities.py
- test_projects.py
- app_error_handler
- ProblemInputPage.tsx
- vite-env.d.ts

## God Nodes (most connected - your core abstractions)
1. `User` - 37 edges
2. `ProblemAnalysisService` - 30 edges
3. `Base` - 27 edges
4. `CapabilityRepository` - 25 edges
5. `AppError` - 24 edges
6. `react` - 24 edges
7. `Capability` - 23 edges
8. `ProjectService` - 22 edges
9. `react-router-dom` - 22 edges
10. `compilerOptions` - 21 edges

## Surprising Connections (you probably didn't know these)
- `_create_schema()` --uses--> `Base`  [INFERRED]
  tests/conftest.py → app/db/base.py
- `FailingAIProvider` --uses--> `ProblemAnalysisResponse`  [INFERRED]
  tests/test_problems.py → app/schemas/problem.py
- `ChallengeService` --uses--> `EvidenceType`  [INFERRED]
  app/services/challenge_service.py → app/db/models/evidence.py
- `EvidenceService` --uses--> `EvidenceType`  [INFERRED]
  app/services/evidence_service.py → app/db/models/evidence.py
- `OralEvidenceService` --uses--> `EvidenceType`  [INFERRED]
  app/services/oral_evidence_service.py → app/db/models/evidence.py

## Import Cycles
- None detected.

## Communities (40 total, 1 thin omitted)

### Community 0 - "User"
Cohesion: 0.05
Nodes (56): get_settings(), Application settings, loaded from environment variables / .env file. Nothing…, Settings, EmailAlreadyRegisteredError, InactiveUserError, InvalidCredentialsError, NotAuthenticatedError, create_access_token() (+48 more)

### Community 1 - "ProblemAnalysisService"
Cohesion: 0.07
Nodes (42): AIProvider, MockAIProvider, ABC, Analyze problem description and return validated structured analysis., Generate a technical oral assessment question for a capability., Evaluate spoken transcript for correctness, depth, relevance, completeness., Evaluate practical challenge submission code/answer., Deterministic mock provider for unit testing and offline development. (+34 more)

### Community 2 - "AppError"
Cohesion: 0.09
Nodes (38): AppError, CapabilityNotFoundError, EvidenceValidationError, ProblemAnalysisFailedError, ProjectAccessDeniedError, ProjectCapabilityAlreadyExistsError, ProjectNotFoundError, Exception (+30 more)

### Community 3 - "Base"
Cohesion: 0.09
Nodes (27): Run migrations in 'offline' mode. This configures the context with just a URL…, Run migrations in 'online' mode. In this scenario we need to create an Engine…, run_migrations_offline(), run_migrations_online(), Base, Shared declarative base for all ORM models., Capability, Problem (+19 more)

### Community 4 - "package.json"
Cohesion: 0.05
Nodes (42): dependencies, codeburn, headroom-ai, motion, react, react-dom, react-router-dom, devDependencies (+34 more)

### Community 5 - "react-router-dom"
Cohesion: 0.10
Nodes (24): LoginPage, ProfilePage, ResultPage, RoleSelectPage, BottomNav(), NavItem, MainLayout(), DEFAULT_USER (+16 more)

### Community 6 - "ProblemContext.tsx"
Cohesion: 0.10
Nodes (23): CapabilitiesPage, EvaluationPage, ReRankingPage, CapabilityItem, DEFAULT_CAPABILITIES, DEFAULT_PROBLEM_TEXT, ProblemContext, ProblemContextValue (+15 more)

### Community 7 - "oral_evidence_service.py"
Cohesion: 0.17
Nodes (15): VerificationStatus, OralAssessment, OralAssessmentStatus, str, OralAssessmentRepository, Session, UUID, OralAssessmentQuestionRead (+7 more)

### Community 8 - "routes.tsx"
Cohesion: 0.12
Nodes (16): ComparePage, InvitePage, SignUpPage, SimulationPage, SkillDnaPage, RouteKey, ROUTES, SignUpPage() (+8 more)

### Community 9 - "challenge_service.py"
Cohesion: 0.20
Nodes (13): Evidence, A single piece of evidence contributing to a user's Capability Profile., EvidenceRepository, Session, UUID, ChallengeCreate, ChallengeRead, ChallengeSubmissionRead (+5 more)

### Community 10 - "compilerOptions"
Cohesion: 0.09
Nodes (22): compilerOptions, allowImportingTsExtensions, baseUrl, forceConsistentCasingInFileNames, isolatedModules, jsx, lib, module (+14 more)

### Community 11 - "capabilities.py"
Cohesion: 0.19
Nodes (15): CapabilityAlreadyExistsError, create_capability(), get_capability(), list_capabilities(), get, post, Session, UUID (+7 more)

### Community 12 - "TopBar.tsx"
Cohesion: 0.18
Nodes (14): STEPS, SUBNAV_TABS, TopBar(), QudraLogo(), QudraLogoProps, getInitialTheme(), Theme, ThemeContext (+6 more)

### Community 13 - "CandidateDetailPage.tsx"
Cohesion: 0.14
Nodes (11): CandidateDetailPage, CandidatesPage, InviteModal(), InviteModalProps, BASE_EVIDENCES, NEW_EVIDENCE, PATH_STEPS, ReasonItem (+3 more)

### Community 14 - "ChallengeRepository"
Cohesion: 0.27
Nodes (7): Challenge, ChallengeSubmission, ChallengeSubmissionStatus, str, ChallengeRepository, Session, UUID

### Community 15 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, allowSyntheticDefaultImports, isolatedModules, lib, module, moduleDetection, moduleResolution, noEmit (+4 more)

### Community 16 - "test_auth.py"
Cohesion: 0.27
Nodes (8): _login(), _register(), test_current_user_with_valid_token(), test_login_nonexistent_user_rejected(), test_login_success_returns_token(), test_login_wrong_password_rejected(), test_register_duplicate_email_rejected(), test_register_success()

### Community 17 - "react"
Cohesion: 0.27
Nodes (7): App(), AppProviders(), router, SplashScreen(), ProblemProvider(), RoleProvider(), react

### Community 18 - "test_evidence.py"
Cohesion: 0.42
Nodes (8): _auth_headers(), test_create_oral_evidence_updates_capability_profile(), test_evidence_unknown_capability_rejected(), test_list_my_evidence(), test_multiple_evidence_accumulates_strength(), test_project_evidence_for_unowned_project_rejected(), test_project_evidence_requires_owned_project(), test_project_evidence_without_project_id_rejected()

### Community 19 - "LocalStorageService"
Cohesion: 0.32
Nodes (4): LocalStorageService, ABC, Save file bytes and return access URL/path., StorageService

### Community 20 - "UserContext.tsx"
Cohesion: 0.25
Nodes (5): DEFAULT_USER, UserContext, UserContextValue, UserProfile, UserRole

### Community 21 - "SpeechToTextProvider"
Cohesion: 0.38
Nodes (4): MockSpeechToTextProvider, ABC, Transcribe audio bytes to text transcript., SpeechToTextProvider

### Community 22 - "test_capabilities.py"
Cohesion: 0.48
Nodes (5): _register_and_login(), test_create_and_list_capability(), test_create_duplicate_capability_rejected(), test_get_capability_not_found(), test_get_user_capability_profile_empty()

### Community 23 - "test_projects.py"
Cohesion: 0.52
Nodes (6): _auth_headers(), test_add_capability_to_project(), test_create_list_get_project(), test_project_not_found(), test_project_not_owned_by_other_user_forbidden(), test_update_project()

### Community 24 - "app_error_handler"
Cohesion: 0.47
Nodes (6): app_error_handler(), Exception, unhandled_exception_handler(), exception_handler, JSONResponse, Request

### Community 25 - "ProblemInputPage.tsx"
Cohesion: 0.33
Nodes (5): ProblemInputPage, EXAMPLES, PHRASES, ProblemInputPage(), STAGES

## Knowledge Gaps
- **124 isolated node(s):** `QudraLogoProps`, `Theme`, `ThemeContextValue`, `ClaimItem`, `InviteModalProps` (+119 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 220 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `User` connect `User` to `capabilities.py`, `ProblemAnalysisService`, `AppError`, `Base`?**
  _High betweenness centrality (0.050) - this node is a cross-community bridge._
- **Why does `Base` connect `Base` to `User`, `AppError`, `oral_evidence_service.py`, `challenge_service.py`, `ChallengeRepository`?**
  _High betweenness centrality (0.033) - this node is a cross-community bridge._
- **Why does `react` connect `react` to `package.json`, `react-router-dom`, `ProblemContext.tsx`, `routes.tsx`, `TopBar.tsx`, `CandidateDetailPage.tsx`, `UserContext.tsx`, `ProblemInputPage.tsx`?**
  _High betweenness centrality (0.031) - this node is a cross-community bridge._
- **Are the 20 inferred relationships involving `User` (e.g. with `get_current_user()` and `UserRepository`) actually correct?**
  _`User` has 20 INFERRED edges - model-reasoned connections that need verification._
- **Are the 20 inferred relationships involving `ProblemAnalysisService` (e.g. with `analyze_problem()` and `create_problem()`) actually correct?**
  _`ProblemAnalysisService` has 20 INFERRED edges - model-reasoned connections that need verification._
- **Are the 7 inferred relationships involving `CapabilityRepository` (e.g. with `Capability` and `CapabilityService`) actually correct?**
  _`CapabilityRepository` has 7 INFERRED edges - model-reasoned connections that need verification._
- **What connects `QudraLogoProps`, `Theme`, `ThemeContextValue` to the rest of the system?**
  _124 weakly-connected nodes found - possible documentation gaps or missing edges._