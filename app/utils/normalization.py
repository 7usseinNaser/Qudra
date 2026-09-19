import re

CANONICAL_CAPABILITY_MAP: dict[str, str] = {
    # Backend
    "backend": "Backend Development",
    "backend development": "Backend Development",
    "back-end development": "Backend Development",
    "back end development": "Backend Development",
    "backend developer": "Backend Development",
    "back-end developer": "Backend Development",
    "backend dev": "Backend Development",
    "back-end": "Backend Development",
    "back end": "Backend Development",
    # Frontend
    "frontend": "Frontend Development",
    "frontend development": "Frontend Development",
    "front-end development": "Frontend Development",
    "front end development": "Frontend Development",
    "frontend developer": "Frontend Development",
    "front-end developer": "Frontend Development",
    "frontend dev": "Frontend Development",
    "front-end": "Frontend Development",
    "front end": "Frontend Development",
    # Full Stack
    "fullstack": "Full Stack Development",
    "full stack": "Full Stack Development",
    "full-stack": "Full Stack Development",
    "fullstack development": "Full Stack Development",
    "full stack development": "Full Stack Development",
    "full-stack development": "Full Stack Development",
    "fullstack developer": "Full Stack Development",
    "full stack developer": "Full Stack Development",
    # Mobile
    "mobile": "Mobile Development",
    "mobile app": "Mobile Development",
    "mobile development": "Mobile Development",
    "mobile developer": "Mobile Development",
    "mobile dev": "Mobile Development",
    "mobile app development": "Mobile Development",
    "mobile application development": "Mobile Development",
    # AI & ML
    "ai": "Artificial Intelligence",
    "artificial intelligence": "Artificial Intelligence",
    "ai/nlp": "Artificial Intelligence",
    "nlp/ai": "Artificial Intelligence",
    "machine learning": "Machine Learning",
    "ml": "Machine Learning",
    "deep learning": "Deep Learning",
    "nlp": "Natural Language Processing",
    "natural language processing": "Natural Language Processing",
    # Speech
    "speech processing": "Speech Processing",
    "speech recognition": "Speech Processing",
    "audio processing": "Speech Processing",
    "voice processing": "Speech Processing",
    "speech to text": "Speech Processing",
    "stt": "Speech Processing",
    # UI / UX
    "ui/ux": "UI/UX Design",
    "ui-ux": "UI/UX Design",
    "ui ux": "UI/UX Design",
    "ui/ux design": "UI/UX Design",
    "ui design": "UI/UX Design",
    "ux design": "UI/UX Design",
    "user interface design": "UI/UX Design",
    # Database
    "database": "Database Design",
    "databases": "Database Design",
    "database design": "Database Design",
    "database development": "Database Design",
    "db": "Database Design",
    "db design": "Database Design",
    "database management": "Database Design",
    # API
    "api": "API Development",
    "api development": "API Development",
    "api design": "API Development",
    "rest api": "API Development",
    "rest apis": "API Development",
    "rest api development": "API Development",
    # DevOps & Cloud
    "devops": "DevOps",
    "devops engineering": "DevOps",
    "cloud": "Cloud Computing",
    "cloud computing": "Cloud Computing",
    "cloud engineering": "Cloud Computing",
}


def _clean_input(name: str) -> str:
    cleaned = re.sub(r"[_]+", " ", name).strip()
    return re.sub(r"\s+", " ", cleaned)


def canonical_key(name: str) -> str:
    """Generate a simplified lookup key by removing spaces, hyphens, and common role words."""
    cleaned = name.lower().strip()
    cleaned = re.sub(r"[\s\-_/]+", " ", cleaned)
    if cleaned in CANONICAL_CAPABILITY_MAP:
        cleaned = CANONICAL_CAPABILITY_MAP[cleaned].lower()

    cleaned = re.sub(r"(developer|development|dev|engineer|engineering|designer|design|programmer|programming)", "", cleaned)
    return re.sub(r"[^a-z0-9]", "", cleaned)


def normalize_capability_name(name: str) -> str:
    """Normalize capability name to prevent duplicate variants (e.g. Backend Development).

    Examples:
        - "Backend" -> "Backend Development"
        - "Backend Development" -> "Backend Development"
        - "Back-end Development" -> "Backend Development"
        - "Backend Developer" -> "Backend Development"
        - "Flutter Developer" -> "Flutter"
        - "UI/UX" -> "UI/UX Design"
    """
    cleaned = _clean_input(name)
    lower = cleaned.lower()

    # 1. Direct canonical map lookup
    if lower in CANONICAL_CAPABILITY_MAP:
        return CANONICAL_CAPABILITY_MAP[lower]

    unhyphenated = lower.replace("-", " ")
    unhyphenated = re.sub(r"\s+", " ", unhyphenated)
    if unhyphenated in CANONICAL_CAPABILITY_MAP:
        return CANONICAL_CAPABILITY_MAP[unhyphenated]

    # 2. Check suffix stripping
    role_pattern = r"\s+(developer|dev|engineer|programmer)$"
    if re.search(role_pattern, lower):
        base = re.sub(role_pattern, "", cleaned, flags=re.IGNORECASE).strip()
        if base.lower() in CANONICAL_CAPABILITY_MAP:
            return CANONICAL_CAPABILITY_MAP[base.lower()]
        return base.title()

    # 3. Clean title case
    acronyms = {"ai", "nlp", "ui", "ux", "api", "db", "sql", "aws", "gcp", "ml", "stt"}
    words = cleaned.split(" ")
    formatted_words = []
    for w in words:
        if w.lower() in acronyms:
            formatted_words.append(w.upper())
        else:
            formatted_words.append(w.capitalize())

    return " ".join(formatted_words)
