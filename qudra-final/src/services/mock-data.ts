import { 
  User, 
  Capability, 
  Evidence, 
  CandidateMatch, 
  GitHubRepo, 
  MasterProfileData 
} from './types';

export const INITIAL_MOCK_USER: User = {
  id: 'usr_01',
  email: 'sara@qudra.io',
  username: 'sara_dev',
  fullName: 'سارة المنصوري',
  role: 'talent',
  headline: 'مهندسة برمجيات متقدمة | أنظمة موزعة وذكاء اصطناعي',
  bio: 'متخصصة في بناء وتطوير الأنظمة عالية الأداء والتطبيقات الذكية. معتمدة على إثباتات ملموسة وكود حقيقي.',
  isEmailVerified: true,
  isOnboarded: true,
  createdAt: '2026-01-15T10:00:00Z',
};

export const INITIAL_CAPABILITIES: Capability[] = [
  {
    id: 'cap_fastapi',
    name: 'FastAPI & Microservices',
    category: 'Backend',
    description: 'تصميم واجهات برمجية عالية الأداء مع معالجة غير متزامنة ومصادقة JWT والتحقق الصارم من المدخلات.',
    level: 'EXPERT',
    strength: 94,
    confidence: 96,
    evidenceCount: 4,
    isVerified: true,
    lastUpdated: '2026-09-01T12:00:00Z'
  },
  {
    id: 'cap_postgres',
    name: 'PostgreSQL & Database Design',
    category: 'Database',
    description: 'نمذجة قواعد البيانات المترابطة، فهرسة معقدة، واستعلامات متقدمة مع تحسين زمن الاستجابة.',
    level: 'ADVANCED',
    strength: 88,
    confidence: 90,
    evidenceCount: 3,
    isVerified: true,
    lastUpdated: '2026-08-28T14:30:00Z'
  },
  {
    id: 'cap_react',
    name: 'React & TypeScript Architecture',
    category: 'Frontend',
    description: 'بناء منصات تفاعلية بتصميم Modular، إدارة حالة مركزية، وتطبيق صارم لمبادئ التصميم النظيف.',
    level: 'EXPERT',
    strength: 92,
    confidence: 95,
    evidenceCount: 5,
    isVerified: true,
    lastUpdated: '2026-09-05T09:15:00Z'
  },
  {
    id: 'cap_docker',
    name: 'Docker & Containerization',
    category: 'DevOps',
    description: 'حزم التطبيقات متعددة الخدمات في حاويات معزولة مع إعداد Multi-stage builds لتقليل الأحجام.',
    level: 'INTERMEDIATE',
    strength: 78,
    confidence: 82,
    evidenceCount: 2,
    isVerified: true,
    lastUpdated: '2026-08-15T16:00:00Z'
  },
  {
    id: 'cap_ai_rag',
    name: 'LLM Orchestration & RAG',
    category: 'AI / ML',
    description: 'تطبيق خطوط أنابيب الاسترجاع المعزز بالتوليد مع التضمينات المتجهية وإدارة السياق الذكي.',
    level: 'ADVANCED',
    strength: 85,
    confidence: 89,
    evidenceCount: 3,
    isVerified: true,
    lastUpdated: '2026-09-07T11:00:00Z'
  }
];

export const INITIAL_EVIDENCES: Evidence[] = [
  {
    id: 'ev_gh_01',
    userId: 'usr_01',
    capabilityId: 'cap_fastapi',
    type: 'GITHUB_REPO',
    title: 'مستودع microservices-core — إثبات معمارية الـ API',
    description: 'تم مسح 42 مستودعاً برمجياً وتحليل 12,450 سطر برمجي يثبت إتقان كتابة APIs نظيفة ومحمية.',
    strength: 95,
    qualityScore: 92,
    status: 'VERIFIED',
    url: 'https://github.com/sara-dev/microservices-core',
    repoDetails: {
      repoName: 'microservices-core',
      commitsCount: 148,
      prsCount: 32,
      linesOfCode: 12450,
      primaryLanguage: 'Python',
      lastCommitDate: '2026-09-01'
    },
    verifiedAt: '2026-09-02T10:00:00Z',
    createdAt: '2026-09-01T15:00:00Z'
  },
  {
    id: 'ev_gh_02',
    userId: 'usr_01',
    capabilityId: 'cap_react',
    type: 'GITHUB_REPO',
    title: 'مستودع high-density-dashboard — منصة واجهات تفاعلية',
    description: 'إثبات استخدام TypeScript مع حماية كاملة للأنواع وضبط معايير إمكانية الوصول والأداء العالي.',
    strength: 92,
    qualityScore: 94,
    status: 'VERIFIED',
    url: 'https://github.com/sara-dev/high-density-dashboard',
    repoDetails: {
      repoName: 'high-density-dashboard',
      commitsCount: 96,
      prsCount: 18,
      linesOfCode: 8900,
      primaryLanguage: 'TypeScript',
      lastCommitDate: '2026-09-05'
    },
    verifiedAt: '2026-09-06T14:00:00Z',
    createdAt: '2026-09-05T12:00:00Z'
  },
  {
    id: 'ev_proj_01',
    userId: 'usr_01',
    capabilityId: 'cap_postgres',
    type: 'PROJECT',
    title: 'نظام إدارة المعاملات المالية الموزعة',
    description: 'تم تسليم المشروع والتحقق من التزام المخطط بقواعد ACID والتحكم المتزامن بالمعاملات.',
    strength: 88,
    qualityScore: 89,
    status: 'VERIFIED',
    verifiedAt: '2026-08-30T10:00:00Z',
    createdAt: '2026-08-25T10:00:00Z'
  },
  {
    id: 'ev_eval_01',
    userId: 'usr_01',
    capabilityId: 'cap_ai_rag',
    type: 'ORAL_ASSESSMENT',
    title: 'تقييم معمق للمفاهيم المتقدمة في الـ RAG والـ Vector DBs',
    description: 'جلسة تقييم شفاهية فنية تم فيها إثبات استراتيجيات chunking وإعادة الترتيب (Re-ranking).',
    strength: 86,
    qualityScore: 91,
    status: 'VERIFIED',
    verifiedAt: '2026-09-08T16:00:00Z',
    createdAt: '2026-09-08T15:00:00Z'
  }
];

export const INITIAL_GITHUB_REPOS: GitHubRepo[] = [
  {
    id: 'repo_01',
    name: 'microservices-core',
    fullName: 'sara-dev/microservices-core',
    description: 'High-throughput asynchronous API framework built with FastAPI and PostgreSQL.',
    primaryLanguage: 'Python',
    starsCount: 48,
    forksCount: 12,
    updatedAt: '2026-09-01T14:22:00Z',
    isPrivate: false,
    isSelected: true,
    isScanned: true,
    detectedCapabilities: [
      { name: 'FastAPI & Microservices', category: 'Backend', confidence: 96, matchedFiles: 28 },
      { name: 'PostgreSQL & Database Design', category: 'Database', confidence: 90, matchedFiles: 14 }
    ]
  },
  {
    id: 'repo_02',
    name: 'high-density-dashboard',
    fullName: 'sara-dev/high-density-dashboard',
    description: 'Enterprise analytics dashboard featuring TypeScript, React 18, and custom design tokens.',
    primaryLanguage: 'TypeScript',
    starsCount: 65,
    forksCount: 19,
    updatedAt: '2026-09-05T18:10:00Z',
    isPrivate: false,
    isSelected: true,
    isScanned: true,
    detectedCapabilities: [
      { name: 'React & TypeScript Architecture', category: 'Frontend', confidence: 95, matchedFiles: 42 }
    ]
  },
  {
    id: 'repo_03',
    name: 'vector-rag-engine',
    fullName: 'sara-dev/vector-rag-engine',
    description: 'Production-ready RAG pipeline utilizing pgvector and hybrid lexical-semantic search.',
    primaryLanguage: 'Python',
    starsCount: 82,
    forksCount: 24,
    updatedAt: '2026-09-07T08:45:00Z',
    isPrivate: false,
    isSelected: false,
    isScanned: false,
    detectedCapabilities: [
      { name: 'LLM Orchestration & RAG', category: 'AI / ML', confidence: 89, matchedFiles: 19 }
    ]
  },
  {
    id: 'repo_04',
    name: 'infra-deploy-helm',
    fullName: 'sara-dev/infra-deploy-helm',
    description: 'Kubernetes and Helm automation scripts for containerized deployments.',
    primaryLanguage: 'Shell',
    starsCount: 15,
    forksCount: 4,
    updatedAt: '2026-08-10T12:00:00Z',
    isPrivate: false,
    isSelected: false,
    isScanned: false,
    detectedCapabilities: [
      { name: 'Docker & Containerization', category: 'DevOps', confidence: 82, matchedFiles: 8 }
    ]
  }
];

export const INITIAL_CANDIDATE_MATCHES: CandidateMatch[] = [
  {
    id: 'c1',
    userId: 'usr_01',
    name: 'سارة المنصوري',
    username: 'sara_dev',
    roleTitle: 'مهندسة حلول ذكاء اصطناعي ونظم موزعة',
    rank: 1,
    matchScore: 94,
    status: 'READY',
    verifiedCapabilities: ['معمارية FastAPI', 'استعلامات PostgreSQL المتقدمة', 'واجهات React & TS'],
    claimedCapabilities: ['إدارة حاويات Docker'],
    missingCapabilities: [],
    explanation: {
      provenCount: 3,
      gapCount: 1,
      summary: 'المرشحة الأكثر جاهزية للمشروع بإثباتات كود حية تغطي 94% من المتطلبات الجوهرية بدون ثغرات حرجة.',
      strengths: [
        'تغطية كود موثقة ومطابقة لمتطلبات الـ API السريع.',
        'خبرة سابقة في ربط النماذج اللغوية بقواعد البيانات علائقية.',
        'سرعة إنجاز عالية مثبتة في مستودعات GitHub المفتوحة.'
      ],
      risks: [
        'تحتاج فقط لمواءمة بيئة العمل السحابية المحددة للإنتاج.'
      ]
    }
  },
  {
    id: 'c2',
    userId: 'usr_02',
    name: 'أحمد التميمي',
    username: 'ahmed_t',
    roleTitle: 'مطور واجهات ومصمم نظم برمجية',
    rank: 2,
    matchScore: 82,
    status: 'NEAR',
    verifiedCapabilities: ['واجهات React & TS', 'تصميم نظم التصميم'],
    claimedCapabilities: ['معمارية FastAPI'],
    missingCapabilities: ['استعلامات PostgreSQL المتقدمة'],
    explanation: {
      provenCount: 2,
      gapCount: 2,
      summary: 'مطور واجهات ممتاز مع إثباتات قوية، لكن توجد فجوة تحتاج لإثبات في إدارة قواعد البيانات الضخمة.',
      strengths: [
        'إتقان استثنائي لمكونات الواجهات والأداء البصري.',
        'التزام عالي بمعايير النفاذية والـ UX.'
      ],
      risks: [
        'لم يقدم دليلاً عملياً على التعامل مع ملايين السجلات في PostgreSQL.'
      ]
    }
  },
  {
    id: 'c3',
    userId: 'usr_03',
    name: 'مها الزهراني',
    username: 'maha_z',
    roleTitle: 'مهندسة بيانات وتعلّم آلي',
    rank: 3,
    matchScore: 71,
    status: 'FAR',
    verifiedCapabilities: ['استعلامات PostgreSQL المتقدمة'],
    claimedCapabilities: ['معمارية FastAPI', 'واجهات React'],
    missingCapabilities: ['معمارية الواجهات المتقدمة'],
    explanation: {
      provenCount: 1,
      gapCount: 3,
      summary: 'خبرة قوية في البيانات ولكنها بعيدة نسبياً عن متطلبات الواجهة الكاملة المطلوبة للمشروع.',
      strengths: [
        'معرفة عميقة بتحليل البيانات واستعلامات SQL المعقدة.'
      ],
      risks: [
        'ضعف في الإثباتات العملية الموثقة على صعيد الواجهات الأمامية.'
      ]
    }
  }
];

export const INITIAL_MASTER_PROFILE: MasterProfileData = {
  user: INITIAL_MOCK_USER,
  trustScore: 94,
  verifiedRatio: 0.88,
  capabilities: INITIAL_CAPABILITIES,
  evidences: INITIAL_EVIDENCES,
  dna: [
    { dimension: 'الدقة الهندسية والتحقق', score: 96, description: 'كتابة اختبارات شاملة وإثبات كل سطر عبر أدلة ومراجعات.', strengthType: 'core' },
    { dimension: 'السرعة والإنتاجية', score: 88, description: 'تسليم سريع مع المحافظة على معايير الكود النظيف.', strengthType: 'core' },
    { dimension: 'التعاون والمساهمة المفتوحة', score: 85, description: 'نشاط مستمر في GitHub ومراجعة كود الزملاء بانتظام.', strengthType: 'supporting' },
    { dimension: 'القدرة على حل المعضلات المعقدة', score: 92, description: 'معالجة مشكلات الأداء وحلها من الجذور المعمارية.', strengthType: 'core' }
  ],
  timeline: [
    {
      id: 'tl_1',
      date: '2026-09-08',
      title: 'اجتياز التقييم الشفاهي المعمق بنسبة 91%',
      description: 'تم التحقق من إتقان مفاهيم RAG وإدارة قواعد البيانات المتجهية.',
      evidenceType: 'ORAL_ASSESSMENT',
      impactScore: 91,
      capabilityNames: ['LLM Orchestration & RAG']
    },
    {
      id: 'tl_2',
      date: '2026-09-05',
      title: 'ربط وتحليل مستودع high-density-dashboard',
      description: 'إثبات 42 ملف ومكون تفاعلي في React مع TypeScript.',
      evidenceType: 'GITHUB_REPO',
      impactScore: 94,
      capabilityNames: ['React & TypeScript Architecture']
    },
    {
      id: 'tl_3',
      date: '2026-09-01',
      title: 'ربط وتحليل مستودع microservices-core',
      description: 'فحص وتوثيق 12,450 سطر برمجي في خدمات FastAPI.',
      evidenceType: 'GITHUB_REPO',
      impactScore: 95,
      capabilityNames: ['FastAPI & Microservices', 'PostgreSQL & Database Design']
    }
  ]
};
