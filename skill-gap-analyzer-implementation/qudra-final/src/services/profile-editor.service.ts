/**
 * Profile Editor Service — QUDRA
 * Manages full LinkedIn-style editable profile data:
 * Experience, Education, Licenses & Certifications, Projects, and Skills.
 * Persists to LocalStorage and syncs with backend user profile.
 */

import { apiClient } from './api';

export interface WorkExperience {
  id: string;
  title: string;
  company: string;
  employmentType: 'دوام كامل' | 'دوام جزئي' | 'عمل حر' | 'تدريب' | 'عقد';
  location: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  description: string;
  skills: string[];
  isVerified?: boolean;
}

export interface EducationItem {
  id: string;
  school: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
  grade?: string;
  description?: string;
  isVerified?: boolean;
}

export interface CertificationItem {
  id: string;
  name: string;
  issuingOrg: string;
  issueDate: string;
  expirationDate?: string;
  credentialId?: string;
  credentialUrl?: string;
  isVerified?: boolean;
}

export interface PortfolioProjectItem {
  id: string;
  title: string;
  description: string;
  url?: string;
  githubUrl?: string;
  technologies: string[];
  role?: string;
  isVerified?: boolean;
}

export interface UserSkillItem {
  id: string;
  name: string;
  category: string;
  isProven: boolean;
  evidenceCount: number;
}

export interface EditableProfileData {
  fullName: string;
  headline: string;
  bio: string;
  location: string;
  avatarUrl: string;
  bannerUrl: string;
  openToWork: boolean;
  isOpenToOpportunities: boolean;
  websiteUrl?: string;
  githubUsername?: string;
  linkedinUrl?: string;
  experiences: WorkExperience[];
  education: EducationItem[];
  certifications: CertificationItem[];
  projects: PortfolioProjectItem[];
  skills: UserSkillItem[];
}

const STORAGE_KEY = 'qudra_editable_profile';

const DEFAULT_PROFILE: EditableProfileData = {
  fullName: 'حسين ناصر',
  headline: 'Senior Full-Stack & AI Engineer | React, TypeScript & FastAPI Specialist',
  bio: 'مهندس برمجيات وذكاء اصطناعي بخبرة تفوق 5 سنوات في بناء المنصات السحابية الموزعة والواجهات التفاعلية الحديثة. شغوف بتحويل الأفكار المعمارية المعقدة إلى منتجات عملية فائقة السرعة ومبنية على مبادئ الـ Evidence-Driven Engineering.',
  location: 'عمان، الأردن (متاح للعمل عن بعد)',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&h=400&q=80',
  bannerUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1600&h=450&q=80',
  openToWork: true,
  isOpenToOpportunities: true,
  websiteUrl: 'https://qudra.sa',
  githubUsername: '7usseinNaser',
  linkedinUrl: 'https://linkedin.com/in/hussein-naser',
  experiences: [
    {
      id: 'exp-1',
      title: 'Senior Software Engineer & Tech Lead',
      company: 'Qudra Platform',
      employmentType: 'دوام كامل',
      location: 'عمان، الأردن',
      startDate: '2023-01',
      endDate: 'حتى الآن',
      isCurrent: true,
      description: 'قيادة تطوير منصة قُدرة للذكاء الاصطناعي وهندسة القدرات. بناء واجهات React 18 فائقة السرعة ونظام Evidence Engine المتصل بمستودعات GitHub وسيرفرات FastAPI.',
      skills: ['React', 'TypeScript', 'FastAPI', 'PostgreSQL', 'Docker'],
      isVerified: true
    },
    {
      id: 'exp-2',
      title: 'Full-Stack Developer',
      company: 'Tech Solutions MENA',
      employmentType: 'دوام كامل',
      location: 'الرياض، السعودية (عن بُعد)',
      startDate: '2021-03',
      endDate: '2022-12',
      isCurrent: false,
      description: 'تطوير تطبيقات الويب السحابية والمتاجر الرقمية وإدارة قواعد البيانات الموزعة بنسبة أداء 99.9%.',
      skills: ['Node.js', 'React', 'REST APIs', 'Cloud Architecture'],
      isVerified: true
    }
  ],
  education: [
    {
      id: 'edu-1',
      school: 'جامعة اليرموك',
      degree: 'بكالوريوس هندسة البرمجيات والذكاء الاصطناعي',
      fieldOfStudy: 'هندسة البرمجيات وتطوير النظم',
      startDate: '2017',
      endDate: '2021',
      grade: 'امتياز مع مرتبة الشرف',
      description: 'التركيز على خوارزميات الذكاء الاصطناعي، قواعد البيانات الموزعة، ومشاريع التخرج العملية.',
      isVerified: true
    }
  ],
  certifications: [
    {
      id: 'cert-1',
      name: 'Meta Front-End Developer Professional Certificate',
      issuingOrg: 'Meta / Coursera',
      issueDate: '2023-05',
      credentialId: 'META-FE-99824',
      credentialUrl: 'https://coursera.org/verify/professional-cert/META',
      isVerified: true
    },
    {
      id: 'cert-2',
      name: 'DeepLearning.AI TensorFlow Developer',
      issuingOrg: 'DeepLearning.AI',
      issueDate: '2022-09',
      credentialId: 'DL-TF-44109',
      credentialUrl: 'https://coursera.org/verify/deeplearning',
      isVerified: false
    }
  ],
  projects: [
    {
      id: 'proj-1',
      title: 'منصة قُدرة — محرك الأدلة وجواز القدرات',
      description: 'نظام متكامل لتجميع الأدلة البرمجية من مصادر متعددة وتوليد جوازات كفاءات مدعومة بالذكاء الاصطناعي وحل مشكلات الشركات.',
      githubUrl: 'https://github.com/7usseinNaser/Qudra',
      url: 'https://qudra-dmz.pages.dev',
      technologies: ['React 18', 'TypeScript', 'FastAPI', 'PostgreSQL', 'CSS Modules'],
      role: 'Lead Architect',
      isVerified: true
    },
    {
      id: 'proj-2',
      title: 'Dawaa & Shifa Healthcare Portal',
      description: 'بوابة رعاية صحية ذكية تدعم إدارة المرضى والمواعيد والصيدلية السحابية مع واجهات RTL مخصصة.',
      githubUrl: 'https://github.com/7usseinNaser/dawaa-shifa',
      technologies: ['React', 'TypeScript', 'Vite', 'Cloudflare Pages'],
      role: 'Full-Stack Developer',
      isVerified: true
    }
  ],
  skills: [
    { id: 'sk-1', name: 'React 18', category: 'Frontend', isProven: true, evidenceCount: 6 },
    { id: 'sk-2', name: 'TypeScript', category: 'Frontend', isProven: true, evidenceCount: 5 },
    { id: 'sk-3', name: 'FastAPI & Python', category: 'Backend', isProven: true, evidenceCount: 4 },
    { id: 'sk-4', name: 'PostgreSQL Architecture', category: 'Database', isProven: true, evidenceCount: 3 },
    { id: 'sk-5', name: 'AI Engineering & Prompt Design', category: 'AI', isProven: true, evidenceCount: 3 },
    { id: 'sk-6', name: 'Docker & Containerization', category: 'DevOps', isProven: false, evidenceCount: 1 },
    { id: 'sk-7', name: 'Kubernetes & Helm', category: 'DevOps', isProven: false, evidenceCount: 0 },
    { id: 'sk-8', name: 'GraphQL', category: 'Backend', isProven: false, evidenceCount: 0 }
  ]
};

export const ProfileEditorService = {
  getProfile(): EditableProfileData {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch {
      // LocalStorage fallback
    }
    return DEFAULT_PROFILE;
  },

  saveProfile(profile: EditableProfileData): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    } catch (e) {
      console.warn('Could not save profile to localStorage', e);
    }
    // Asynchronously synchronize with backend when authenticated
    this.syncWithBackend(profile).catch(() => {});
  },

  async syncWithBackend(profile: EditableProfileData): Promise<boolean> {
    if (!apiClient.isAuthenticated()) return false;
    try {
      await apiClient.patch('/api/v1/users/me', {
        full_name: profile.fullName,
        headline: profile.headline,
        bio: profile.bio,
        avatar_url: profile.avatarUrl,
      });
      return true;
    } catch (err) {
      console.warn('Backend sync failed, state preserved locally:', err);
      return false;
    }
  },

  updateBasicInfo(info: Partial<Pick<EditableProfileData, 'fullName' | 'headline' | 'bio' | 'location' | 'openToWork' | 'websiteUrl' | 'githubUsername' | 'linkedinUrl'>>): EditableProfileData {
    const profile = this.getProfile();
    const updated = { ...profile, ...info };
    this.saveProfile(updated);
    return updated;
  },

  updateAvatar(avatarUrl: string): EditableProfileData {
    const profile = this.getProfile();
    const updated = { ...profile, avatarUrl };
    this.saveProfile(updated);
    return updated;
  },

  updateBanner(bannerUrl: string): EditableProfileData {
    const profile = this.getProfile();
    const updated = { ...profile, bannerUrl };
    this.saveProfile(updated);
    return updated;
  },

  importGitHubReposAsProjects(repos: Array<{ name: string; description?: string; primaryLanguage?: string; fullName: string }>): EditableProfileData {
    const profile = this.getProfile();
    const existingUrls = new Set(profile.projects.map(p => p.githubUrl));

    const newProjects: PortfolioProjectItem[] = repos
      .filter(r => !existingUrls.has(`https://github.com/${r.fullName}`))
      .map(r => ({
        id: `gh-proj-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        title: r.name,
        description: r.description || `مستودع مفتوح المصدر تم سحبه مباشرة من GitHub (@${profile.githubUsername})`,
        githubUrl: `https://github.com/${r.fullName}`,
        technologies: r.primaryLanguage && r.primaryLanguage !== 'Code' ? [r.primaryLanguage] : ['Engineering'],
        isVerified: true,
        role: 'مطور رئيسي (Author)'
      }));

    const updated = {
      ...profile,
      projects: [...newProjects, ...profile.projects]
    };
    this.saveProfile(updated);
    return updated;
  },

  addExperience(exp: Omit<WorkExperience, 'id'>): EditableProfileData {
    const profile = this.getProfile();
    const newExp: WorkExperience = {
      ...exp,
      id: `exp-${Date.now()}`
    };
    const updated = {
      ...profile,
      experiences: [newExp, ...profile.experiences]
    };
    this.saveProfile(updated);
    return updated;
  },

  updateExperience(id: string, exp: Partial<WorkExperience>): EditableProfileData {
    const profile = this.getProfile();
    const updated = {
      ...profile,
      experiences: profile.experiences.map(e => e.id === id ? { ...e, ...exp } : e)
    };
    this.saveProfile(updated);
    return updated;
  },

  deleteExperience(id: string): EditableProfileData {
    const profile = this.getProfile();
    const updated = {
      ...profile,
      experiences: profile.experiences.filter(e => e.id !== id)
    };
    this.saveProfile(updated);
    return updated;
  },

  addEducation(edu: Omit<EducationItem, 'id'>): EditableProfileData {
    const profile = this.getProfile();
    const newEdu: EducationItem = {
      ...edu,
      id: `edu-${Date.now()}`
    };
    const updated = {
      ...profile,
      education: [newEdu, ...profile.education]
    };
    this.saveProfile(updated);
    return updated;
  },

  updateEducation(id: string, edu: Partial<EducationItem>): EditableProfileData {
    const profile = this.getProfile();
    const updated = {
      ...profile,
      education: profile.education.map(e => e.id === id ? { ...e, ...edu } : e)
    };
    this.saveProfile(updated);
    return updated;
  },

  deleteEducation(id: string): EditableProfileData {
    const profile = this.getProfile();
    const updated = {
      ...profile,
      education: profile.education.filter(e => e.id !== id)
    };
    this.saveProfile(updated);
    return updated;
  },

  addCertification(cert: Omit<CertificationItem, 'id'>): EditableProfileData {
    const profile = this.getProfile();
    const newCert: CertificationItem = {
      ...cert,
      id: `cert-${Date.now()}`
    };
    const updated = {
      ...profile,
      certifications: [newCert, ...profile.certifications]
    };
    this.saveProfile(updated);
    return updated;
  },

  deleteCertification(id: string): EditableProfileData {
    const profile = this.getProfile();
    const updated = {
      ...profile,
      certifications: profile.certifications.filter(c => c.id !== id)
    };
    this.saveProfile(updated);
    return updated;
  },

  addProject(proj: Omit<PortfolioProjectItem, 'id'>): EditableProfileData {
    const profile = this.getProfile();
    const newProj: PortfolioProjectItem = {
      ...proj,
      id: `proj-${Date.now()}`
    };
    const updated = {
      ...profile,
      projects: [newProj, ...profile.projects]
    };
    this.saveProfile(updated);
    return updated;
  },

  deleteProject(id: string): EditableProfileData {
    const profile = this.getProfile();
    const updated = {
      ...profile,
      projects: profile.projects.filter(p => p.id !== id)
    };
    this.saveProfile(updated);
    return updated;
  },

  addSkill(name: string, category = 'General'): EditableProfileData {
    const profile = this.getProfile();
    const newSkill: UserSkillItem = {
      id: `sk-${Date.now()}`,
      name,
      category,
      isProven: false,
      evidenceCount: 0
    };
    const updated = {
      ...profile,
      skills: [...profile.skills, newSkill]
    };
    this.saveProfile(updated);
    return updated;
  },

  deleteSkill(id: string): EditableProfileData {
    const profile = this.getProfile();
    const updated = {
      ...profile,
      skills: profile.skills.filter(s => s.id !== id)
    };
    this.saveProfile(updated);
    return updated;
  }
};
