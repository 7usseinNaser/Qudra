-- QUDRA demo seed data

-- 1) Capability
INSERT INTO capabilities (
    id,
    name,
    category,
    description
)
VALUES (
    'e9997399-04cd-4c98-a893-b1fcb680bf88',
    'Python',
    'Technical',
    'Python programming skill'
)
ON CONFLICT (name) DO NOTHING;


-- 2) Demo User
INSERT INTO users (
    id,
    email,
    hashed_password,
    full_name,
    is_active
)
VALUES (
    '590fe26b-3887-49fe-88fb-a9807653b40b',
    'demo@qudra.com',
    'demo_hash',
    'Demo User',
    true
)
ON CONFLICT (email) DO NOTHING;


-- 3) Link user to capability
INSERT INTO user_capabilities (
    id,
    user_id,
    capability_id,
    strength
)
SELECT
    gen_random_uuid(),
    u.id,
    c.id,
    0.80
FROM users u
JOIN capabilities c ON c.name = 'Python'
WHERE u.email = 'demo@qudra.com'
AND NOT EXISTS (
    SELECT 1
    FROM user_capabilities uc
    WHERE uc.user_id = u.id
      AND uc.capability_id = c.id
);


-- 4) Evidence
INSERT INTO evidence (
    id,
    user_id,
    capability_id,
    type,
    title,
    description,
    strength,
    score,
    quality,
    verification_status
)
SELECT
    gen_random_uuid(),
    u.id,
    c.id,
    'PROJECT',
    'Python API Project',
    'Built a backend API using Python',
    0.85,
    85,
    90,
    'VERIFIED'
FROM users u
JOIN capabilities c ON c.name = 'Python'
WHERE u.email = 'demo@qudra.com'
AND NOT EXISTS (
    SELECT 1
    FROM evidence e
    WHERE e.user_id = u.id
      AND e.capability_id = c.id
      AND e.title = 'Python API Project'
);


-- 5) Challenge
INSERT INTO challenges (
    id,
    capability_id,
    title,
    description,
    difficulty,
    time_limit_minutes,
    evaluation_criteria,
    starter_content
)
SELECT
    '6cf71212-892a-4cb1-a146-15b8d263813b',
    c.id,
    'Python API Challenge',
    'Build a simple REST API using Python.',
    'BEGINNER',
    30,
    '{"correctness": 50, "code_quality": 30, "clarity": 20}',
    'Create an endpoint that returns a JSON response.'
FROM capabilities c
WHERE c.name = 'Python'
AND NOT EXISTS (
    SELECT 1
    FROM challenges ch
    WHERE ch.title = 'Python API Challenge'
);


-- 6) Challenge submission
INSERT INTO challenge_submissions (
    id,
    challenge_id,
    user_id,
    submission_text,
    code,
    repository_url,
    test_score,
    ai_score,
    final_score,
    feedback,
    status
)
SELECT
    gen_random_uuid(),
    ch.id,
    u.id,
    'Completed the Python API challenge.',
    'from fastapi import FastAPI',
    NULL,
    90,
    85,
    87.5,
    'Good implementation and clear structure.',
    'COMPLETED'
FROM users u
JOIN challenges ch ON ch.title = 'Python API Challenge'
WHERE u.email = 'demo@qudra.com'
AND NOT EXISTS (
    SELECT 1
    FROM challenge_submissions cs
    WHERE cs.user_id = u.id
      AND cs.challenge_id = ch.id
);


-- 7) Verification
SELECT
    u.full_name,
    c.name AS capability,
    uc.strength
FROM user_capabilities uc
JOIN users u ON uc.user_id = u.id
JOIN capabilities c ON uc.capability_id = c.id;

SELECT
    e.title,
    e.type,
    e.score,
    e.quality,
    e.verification_status
FROM evidence e;

SELECT
    u.full_name,
    c.name AS capability,
    ch.title AS challenge,
    cs.final_score,
    cs.status
FROM challenge_submissions cs
JOIN users u ON cs.user_id = u.id
JOIN challenges ch ON cs.challenge_id = ch.id
JOIN capabilities c ON ch.capability_id = c.id;