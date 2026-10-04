# QUDRA Backend — Feature 5: Capability Score

## 1. Core Philosophy
> **"Capability Score represents the strength of available evidence, not an absolute measurement of human ability."**

QUDRA does not simply ask *"What skills does this person claim to have?"*, but rather:
*"What verifiable evidence do we have in the system demonstrating this capability?"*

The Capability Score is calculated deterministically for each `(user, capability)` pair based strictly on verified evidence records.

---

## 2. Architecture & Data Flow

```
Authentication
      │
      ▼
    User
      │
      ▼
Capabilities
      │
      ▼
UserCapability (evidence_strength, evidence_count, breakdown, last_evaluated_at)
      │
      ▼
  Evidence (PROJECT, ORAL, PRACTICAL)
      │
      ▼
Capability Scoring Engine (CapabilityScoringService)
      │
      ▼
Updated UserCapability (Explainable breakdown & scores)
```

---

## 3. Scoring Model & Centralized Weights

The scoring weights are defined in a centralized configuration (`CAPABILITY_SCORE_WEIGHTS`) and can be adjusted without changing the engine code:

| Component | Weight | Description |
|---|---|---|
| **Practical Evidence** | **40%** (`0.40`) | Hands-on coding challenge, lab, or assessment results |
| **Project Evidence** | **30%** (`0.30`) | Portfolio project deliverables and contributions |
| **Oral Evidence** | **20%** (`0.20`) | Technical interviews, viva defenses, or oral presentations |
| **Freshness** | **10%** (`0.10`) | Time-decay factor reflecting currency of verified proof |

### Formula
$$\text{Score} = (\text{Practical} \times 0.40) + (\text{Project} \times 0.30) + (\text{Oral} \times 0.20) + (\text{Freshness} \times 0.10)$$

* **Score Range:** Normalized between `0.0` and `100.0`.
* If no valid/verified evidence exists, the score is strictly `0.0` (never `null` or `NaN`).

---

## 4. Evidence Statuses

* `VERIFIED`: Included in scoring calculations.
* `PENDING`: Excluded from scoring.
* `REJECTED`: Excluded from scoring.

---

## 5. Aggregation Strategy (Multiple Records)

When multiple evidence records exist for a capability:
1. Only `VERIFIED` evidence records are selected.
2. For each evidence type (`PRACTICAL`, `PROJECT`, `ORAL`), individual scores are sorted descending.
3. The type score is calculated as the **average of the top 3 strongest records**. This deterministic aggregation ensures that deep demonstrated capability is rewarded while preventing a large number of minor/side submissions from diluting high-quality evidence.

---

## 6. Freshness Decay Schedule

Evidence becomes less representative as it ages. Freshness is evaluated using the timestamp of the **newest verified evidence**, preventing legacy evidence from unfairly dragging down recent achievements:

| Evidence Age | Freshness Score |
|---|---|
| 0 – 6 months ($\le 180$ days) | **100** |
| 6 – 12 months (181 – 365 days) | **90** |
| 1 – 2 years (366 – 730 days) | **75** |
| 2 – 3 years (731 – 1095 days) | **60** |
| > 3 years (> 1095 days) | **40** |

All date calculations are strictly timezone-aware (`UTC`).

---

## 7. Structured Score Fallbacks

### Oral Evidence Fallback
If oral evidence contains an explicit score or `overall_score`, that value is used. Otherwise, if structured rubric metrics are provided in `evidence_metadata`, the score is calculated via:
$$\text{Oral Score} = (\text{correctness} \times 0.35) + (\text{relevance} \times 0.25) + (\text{depth} \times 0.25) + (\text{clarity} \times 0.15)$$

### Project Evidence Fallback
If project evidence contains structured metrics in `evidence_metadata`, the score evaluates:
$$\text{Project Score} = (\text{relevance} \times 0.30) + (\text{contribution} \times 0.30) + (\text{complexity} \times 0.25) + (\text{tech\_relevance} \times 0.15)$$
Otherwise, it falls back to `score` or `strength`.

---

## 8. API Endpoints

Both `/api/v1` and `/api` prefixes are supported.

### 1. List User Capabilities & Current Scores
`GET /api/v1/users/me/capabilities` (or `/api/users/me/capabilities`)

### 2. Get Single Capability Score Breakdown
`GET /api/v1/users/me/capabilities/{capability_id}` (or `/api/users/me/capabilities/{capability_id}`)

#### Example Response:
```json
{
  "capability": {
    "id": "c1f7b0f6-9f8a-4d3b-9e4a-1b2c3d4e5f6a",
    "name": "Backend Development"
  },
  "score": 85.0,
  "components": {
    "practical": 90.0,
    "project": 80.0,
    "oral": 75.0,
    "freshness": 100.0
  },
  "weights": {
    "practical": 0.40,
    "project": 0.30,
    "oral": 0.20,
    "freshness": 0.10
  },
  "evidence_count": 3,
  "last_evaluated_at": "2026-09-19T16:30:00Z"
}
```

### 3. Trigger Recalculation
`POST /api/v1/users/me/capabilities/{capability_id}/recalculate`

### 4. Update Evidence Verification Status
`PATCH /api/v1/evidence/{evidence_id}/status`
* Body: `{"status": "VERIFIED" | "PENDING" | "REJECTED"}`
* Automatically triggers recalculation for the affected capability.

---

## 9. Feature 6: Skill Gap Analyzer

### Core Concept
The Skill Gap Analyzer compares the capabilities required by a specific **Problem** against the authenticated **User's Capability Profile** and their latest **Capability Scores** (Feature 5).

```
Problem
   │
   ▼
ProblemAnalysis
   │
   ▼
Required Capabilities (importance, required_level)
   │
   ▼
User Capability Profile + Verified Evidence Scores (Feature 5)
   │
   ▼
Skill Gap Analysis & Problem Readiness
```

### Classification Thresholds (`SKILL_GAP_THRESHOLDS`)
* **COVERED**: Current Score $\ge 70.0$
* **PARTIAL**: $40.0 \le \text{Current Score} < 70.0$
* **GAP**: Current Score $< 40.0$ (or missing capability record)

### Gap Value
$$\text{Gap} = \max(70.0 - \text{Current Score}, 0.0)$$

### Gap Priority Matrix
| Required Level | Status | Priority |
|---|---|---|
| **HIGH** | **GAP** | **CRITICAL** |
| **HIGH** | **PARTIAL** | **HIGH** |
| **HIGH** | **COVERED** | **NONE** |
| **MEDIUM** | **GAP** | **HIGH** |
| **MEDIUM** | **PARTIAL** | **MEDIUM** |
| **MEDIUM** | **COVERED** | **NONE** |
| **LOW** | **GAP** | **LOW** |
| **LOW** | **PARTIAL** | **LOW** |
| **LOW** | **COVERED** | **NONE** |

### Overall Problem Readiness
Evaluates how well the user covers the specific problem's needs (0 – 100), weighted by requirement importance:
* **HIGH**: Weight = `1.0`
* **MEDIUM**: Weight = `0.7`
* **LOW**: Weight = `0.4`

$$\text{Readiness} = \frac{\sum (\text{score} \times \text{importance\_weight})}{\sum \text{importance\_weight}}$$

### API Endpoints
* `GET /api/v1/problems/{problem_id}/skill-gap` (or `/api/problems/{problem_id}/skill-gap`)

#### Example Response:
```json
{
  "problem_id": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
  "user_id": "c1f7b0f6-9f8a-4d3b-9e4a-1b2c3d4e5f6a",
  "overall_readiness": 71.5,
  "summary": {
    "covered": 2,
    "partial": 1,
    "gaps": 0
  },
  "capabilities": [
    {
      "capability_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "capability_name": "Backend Development",
      "required_level": "HIGH",
      "current_score": 80.0,
      "status": "COVERED",
      "gap": 0.0,
      "priority": "NONE",
      "reason": "The user has verified evidence for Backend Development with an evidence score of 80.0, meeting the high requirement."
    },
    {
      "capability_id": "4fa85f64-5717-4562-b3fc-2c963f66afa7",
      "capability_name": "Flutter",
      "required_level": "HIGH",
      "current_score": 50.0,
      "status": "PARTIAL",
      "gap": 20.0,
      "priority": "HIGH",
      "reason": "The user has partial verified evidence for Flutter (score: 50.0). Further evidence is recommended to fully cover this high requirement."
    },
    {
      "capability_id": "5fa85f64-5717-4562-b3fc-2c963f66afa8",
      "capability_name": "Database Design",
      "required_level": "MEDIUM",
      "current_score": 90.0,
      "status": "COVERED",
      "gap": 0.0,
      "priority": "NONE",
      "reason": "The user has verified evidence for Database Design with an evidence score of 90.0, meeting the medium requirement."
    }
  ]
}
```

---

## 10. Feature 7: Explainable Matching

### Core Concept
QUDRA does not ask *"Who claims to know this?"* — it asks:
*"Who has the strongest verified evidence for the capabilities this problem requires?"*

The Explainable Matching system produces **deterministic, fact-based, fully transparent** match scores between candidate users and analyzed problems. Every score is decomposable into its component parts. No LLM is used for numerical scoring.

```
Problem (Analyzed)
       │
       ▼
Required Capabilities (importance, required_level)
       │
       ▼
Find Candidates (users with any required capability)
       │
       ▼
For each candidate:
  ┌── Capability Match (40%)
  ├── Practical Evidence (25%)
  ├── Project Relevance (20%)
  ├── Oral Evidence (10%)
  └── Evidence Freshness (5%)
       │
       ▼
Total Score + Structured Explanation
       │
       ▼
MatchResult (persisted snapshot)
```

### Matching Weights (`MATCHING_WEIGHTS`)
| Component | Weight | Description |
|---|---|---|
| **Capability Match** | **40%** (`0.40`) | Importance-weighted average of user's evidence scores vs required capabilities |
| **Practical Evidence** | **25%** (`0.25`) | Hands-on challenge/lab scores for required capabilities |
| **Project Relevance** | **20%** (`0.20`) | Overlap between user's projects and required capabilities via `ProjectCapability` |
| **Oral Evidence** | **10%** (`0.10`) | Technical interview/viva scores for required capabilities |
| **Freshness** | **5%** (`0.05`) | Recency of verified evidence (reuses Feature 5 freshness decay) |

### Formula
$$\text{Total} = (\text{Cap} \times 0.40) + (\text{Practical} \times 0.25) + (\text{Project} \times 0.20) + (\text{Oral} \times 0.10) + (\text{Freshness} \times 0.05)$$

### Candidate Discovery
- Batch query: find all **active** users who hold at least one required capability
- Batch-fetch all `UserCapability` records for those candidates in a single query (no N+1)

### Explanation Structure
Each match result includes a structured, fact-based explanation:
- **summary**: e.g., "Alice matches 3/4 required capabilities fully, with 1 partial and 0 gaps. Overall match score: 78.5."
- **strengths**: list of covered capabilities with scores and importance
- **gaps**: list of missing or partial capabilities
- **relevant_projects**: list of candidate's project titles tagged with required capabilities

### MatchResult Persistence
Match results are persisted as `MatchResult` snapshots with upsert logic (unique constraint on `problem_id + user_id`). This supports:
- Historical comparison
- Future Feature 8 (Team Composer) input
- Recalculation without data loss

### API Endpoints
Both `/api/v1` and `/api` prefixes are supported.

#### 1. Get Matches
`GET /api/v1/problems/{problem_id}/matches`

Computes and returns ranked match results for all eligible candidates.

##### Example Response:
```json
{
  "problem_id": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
  "problem_title": "Build E-Commerce Platform",
  "total_candidates": 2,
  "weights": {
    "capability_match": 0.40,
    "practical": 0.25,
    "project_relevance": 0.20,
    "oral": 0.10,
    "freshness": 0.05
  },
  "matches": [
    {
      "user_id": "c1f7b0f6-9f8a-4d3b-9e4a-1b2c3d4e5f6a",
      "user_name": "Alice",
      "total_score": 78.5,
      "capability_score": 85.0,
      "practical_score": 80.0,
      "project_relevance_score": 66.7,
      "oral_score": 70.0,
      "freshness_score": 100.0,
      "explanation": {
        "summary": "Alice matches 2/3 required capabilities fully, with 1 partial and 0 gaps. Overall match score: 78.5.",
        "strengths": [
          "Strong evidence for Python (score: 90.0, importance: 90)",
          "Strong evidence for Database Design (score: 80.0, importance: 70)"
        ],
        "gaps": [
          "Partial evidence for React (score: 55.0, required level: MEDIUM)"
        ],
        "relevant_projects": ["E-Commerce API", "Data Pipeline"]
      },
      "capability_breakdown": [
        {
          "capability_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
          "capability_name": "Python",
          "required_level": "HIGH",
          "importance": 90,
          "user_score": 90.0,
          "status": "COVERED"
        }
      ],
      "matched_at": "2026-10-03T10:00:00Z"
    }
  ]
}
```

#### 2. Recalculate Matches
`POST /api/v1/problems/{problem_id}/matches/recalculate`

Force recalculation: clears existing `MatchResult` snapshots for the problem and recomputes from current evidence.

---

## 11. Feature 8: Team Composer

### Core Concept
QUDRA does not simply pick "the top 5 people".
It composes **the smallest effective complementary team** that covers the capabilities required by the problem, utilizing candidates with strong and verified evidence while minimizing redundancy.

```
Problem (Analyzed)
       │
       ▼
Required Capabilities (importance, required_level)
       │
       ▼
Explainable Matching (Feature 7)
       │
       ▼
Candidate Pool
       │
       ▼
Team Composer (Greedy Complementary Selection + Pruning)
       │
       ▼
Complementary Team + Role Allocation (PROPOSED status)
       │
       ▼
Persisted Team, TeamMembers & TeamCapabilities
```

### Team Objective Function (`TEAM_COMPOSITION_WEIGHTS`)
| Component | Weight | Description |
|---|---|---|
| **Capability Coverage** | **45%** (`0.45`) | Aggregate importance-weighted coverage of required capabilities |
| **Candidate Evidence** | **25%** (`0.25`) | Average verified capability strength of selected team members |
| **Problem Relevance** | **20%** (`0.20`) | Average project relevance of selected team members |
| **Complementarity** | **10%** (`0.10`) | Diversity and non-redundancy of capability contributions |

### Composition & Optimization Algorithm
1. **Candidate Pool**: Fetches candidate match results from `MatchingService` (Feature 7).
2. **Greedy Set-Cover Selection**: Selects candidates iteratively based on marginal capability contribution and complementarity bonus until all requirements are covered, `max_team_size` (default 5) is reached, or marginal gain diminishes.
3. **Pruning / Optimization Pass**: Evaluates every selected member by checking if their removal drops team coverage; completely redundant members are pruned to ensure the smallest effective team.
4. **Evidence-Based Role Assignment**: Generates suggested roles directly from each member's strongest verified capability.
5. **TeamMember Status**: Initial status is strictly `PROPOSED` (respects candidate consent).

### API Endpoints
Both `/api/v1` and `/api` prefixes are supported.

#### Compose Team
`POST /api/v1/problems/{problem_id}/compose-team`

##### Request Body (optional):
```json
{
  "max_team_size": 5,
  "min_coverage_threshold": 70.0
}
```

##### Example Response:
```json
{
  "team_id": "c1f7b0f6-9f8a-4d3b-9e4a-1b2c3d4e5f6a",
  "problem_id": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
  "problem_title": "Build Mobile E-Commerce Platform",
  "team_score": 91.2,
  "coverage_score": 94.0,
  "team_size": 2,
  "status": "PROPOSED",
  "members": [
    {
      "user_id": "a1a1a1a1-1111-1111-1111-111111111111",
      "user_name": "Alice",
      "suggested_role": "Suggested role: Backend Development",
      "contribution_score": 92.0,
      "member_status": "PROPOSED",
      "covered_capabilities": ["Backend Development", "Database Design"]
    },
    {
      "user_id": "b2b2b2b2-2222-2222-2222-222222222222",
      "user_name": "Bob",
      "suggested_role": "Suggested role: Flutter",
      "contribution_score": 88.0,
      "member_status": "PROPOSED",
      "covered_capabilities": ["Flutter"]
    }
  ],
  "capability_coverage": [
    {
      "capability_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "capability": "Backend Development",
      "required_level": "HIGH",
      "coverage_score": 92.0,
      "status": "COVERED"
    },
    {
      "capability_id": "4fa85f64-5717-4562-b3fc-2c963f66afa7",
      "capability": "Flutter",
      "required_level": "HIGH",
      "coverage_score": 88.0,
      "status": "COVERED"
    }
  ],
  "gaps": [],
  "explanation": {
    "summary": "2 members were selected for 'Build Mobile E-Commerce Platform', achieving 94.0% capability coverage and a team objective score of 91.2.",
    "member_explanations": [
      "Alice (Suggested role: Backend Development) contributes verified strength in Backend Development, Database Design with a match score of 92.0.",
      "Bob (Suggested role: Flutter) contributes verified strength in Flutter with a match score of 88.0."
    ],
    "redundancy_notes": [
      "1 candidate(s) were excluded to minimize redundancy as their capabilities were already sufficiently covered by the selected members."
    ]
  }
}
```

---

## 12. Feature 9: Human / AI Allocation

### Core Concept
QUDRA does not assume every task should be performed by a human, nor does it blindly delegate everything to AI.
For each project task, the allocation engine deterministically determines whether the task should be performed by:
* **`HUMAN`**: Human should perform the main task (mandatory for critical domain judgment, real-world/physical execution, client negotiation, governance sign-off).
* **`AI`**: AI can perform the task autonomously (ideal for documentation generation, boilerplate code scaffolding, template parsing, summarization).
* **`HUMAN_AI`**: AI accelerates execution with scaffolding, drafting, or test generation, while an assigned human team member reviews, validates, and approves the deliverable.

```
Problem
   │
   ▼
Required Capabilities
   │
   ▼
Explainable Matching (Feature 7)
   │
   ▼
Team Composer (Feature 8)
   │
   ▼
Composed Team & Members
   │
   ▼
Task & Task Capabilities
   │
   ▼
Human / AI Allocation Engine
   ├── AI Suitability Evaluation
   ├── TeamMember Capability Matching
   └── Deterministic Rules Decision
   │
   ▼
Persisted TaskAllocation (with explicit AI & Human contributions)
```

### Safety & Control Principles
* **Safety First**: Tasks with high-stakes security, compliance, physical interaction, or client negotiations are strictly routed to `HUMAN`.
* **Bounded Autonomous AI**: AI is allocated only when structure is standard, ambiguity is low, and human judgment is not explicitly required.
* **Collaboration as Default for Engineering**: Code implementations, architecture reviews, and complex feature tasks default to `HUMAN_AI`, ensuring accountability while maximizing developer productivity.

### API Endpoints
Both `/api/v1` and `/api` prefixes are supported.

#### 1. Create Project Task
`POST /api/v1/tasks`

##### Request Body:
```json
{
  "problem_id": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
  "title": "Implement User Authentication API",
  "description": "Scaffold endpoints and write unit tests with human security review",
  "task_type": "BACKEND",
  "priority": "HIGH",
  "complexity": "MEDIUM",
  "requires_human_judgment": true,
  "requires_verification": true,
  "required_capabilities": [
    {
      "capability_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "importance": 85,
      "required_level": "HIGH"
    }
  ]
}
```

#### 2. Allocate Task
`POST /api/v1/tasks/{task_id}/allocation`

##### Example Response:
```json
{
  "id": "e1f7b0f6-9f8a-4d3b-9e4a-1b2c3d4e5f6a",
  "task_id": "d1f7b0f6-9f8a-4d3b-9e4a-1b2c3d4e5f6b",
  "task_title": "Implement User Authentication API",
  "allocation_type": "HUMAN_AI",
  "primary_team_member_id": "a1a1a1a1-1111-1111-1111-111111111111",
  "primary_team_member_name": "Alice",
  "human_suitability_score": 90.0,
  "ai_suitability_score": 62.0,
  "reason": "AI can accelerate scaffolding and initial drafting (AI suitability: 62.0), while Alice provides critical review, validation, and final integration.",
  "ai_contribution": [
    "Draft initial implementation and scaffolding for Implement User Authentication API",
    "Generate test cases and edge-case templates",
    "Analyze potential bottlenecks or missing endpoints"
  ],
  "human_contribution": [
    "Alice to review and refine AI-generated artifacts",
    "Validate architectural alignment and security standards",
    "Approve and merge the final deliverable"
  ],
  "created_at": "2026-10-04T18:00:00Z",
  "updated_at": "2026-10-04T18:00:00Z"
}
```

#### 3. Get Task Allocation
`GET /api/v1/tasks/{task_id}/allocation`

#### 4. Recalculate Task Allocation
`POST /api/v1/tasks/{task_id}/allocation/recalculate`

#### 5. List Tasks for Problem
`GET /api/v1/problems/{problem_id}/tasks`

---

## 13. Limitations & Future Phases

* Feature 6 calculates the skill gap dynamically per request based on the latest verified evidence scores.
* Feature 7 provides deterministic match snapshots that can be recalculated on demand after new evidence submissions.
* Feature 8 composes proposed teams by greedily covering capabilities and removing redundancies.
* Feature 9 assigns tasks intelligently across Human, AI, and Human+AI collaboration based on verified capability evidence.
* In Feature 10 (Project Workspace & Real-time Collaboration), tasks and artifacts will be tracked live in interactive workspaces with automated execution loops.


