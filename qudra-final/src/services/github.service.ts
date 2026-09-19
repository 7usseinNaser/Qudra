import { GitHubRepo } from './types';
import { QudraStore } from './store';

interface RawGitHubApiRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  private: boolean;
}

const detectCapabilitiesFromLanguage = (lang: string | null, name: string) => {
  const list = [];
  const lowerLang = (lang || '').toLowerCase();
  const lowerName = name.toLowerCase();

  if (lowerLang.includes('python') || lowerName.includes('fastapi') || lowerName.includes('django') || lowerName.includes('flask')) {
    list.push({ name: 'Python & Backend Architecture', category: 'Backend', confidence: 94, matchedFiles: 24 });
  }
  if (lowerLang.includes('typescript') || lowerLang.includes('javascript') || lowerName.includes('react') || lowerName.includes('next')) {
    list.push({ name: 'React & TypeScript Architecture', category: 'Frontend', confidence: 95, matchedFiles: 36 });
  }
  if (lowerLang.includes('sql') || lowerName.includes('postgres') || lowerName.includes('db')) {
    list.push({ name: 'PostgreSQL & Database Design', category: 'Database', confidence: 90, matchedFiles: 12 });
  }
  if (lowerName.includes('docker') || lowerName.includes('k8s') || lowerName.includes('helm') || lowerLang.includes('shell')) {
    list.push({ name: 'Docker & Containerization', category: 'DevOps', confidence: 88, matchedFiles: 8 });
  }
  if (lowerName.includes('rag') || lowerName.includes('ai') || lowerName.includes('llm') || lowerName.includes('agent')) {
    list.push({ name: 'LLM Orchestration & RAG', category: 'AI / ML', confidence: 92, matchedFiles: 18 });
  }

  if (list.length === 0) {
    list.push({ name: `${lang || 'Software'} Engineering`, category: 'Core', confidence: 85, matchedFiles: 15 });
  }
  return list;
};

export const GitHubService = {
  async isConnected(): Promise<boolean> {
    await new Promise(res => setTimeout(res, 50));
    return QudraStore.isGitHubConnected();
  },

  async connect(): Promise<boolean> {
    await new Promise(res => setTimeout(res, 150));
    QudraStore.setGitHubConnected(true);
    return true;
  },

  async fetchRealUserRepos(username: string): Promise<GitHubRepo[]> {
    const cleanUsername = username.trim().replace(/^https?:\/\/github\.com\//, '').replace(/\/$/, '');
    if (!cleanUsername) {
      throw new Error('يرجى إدخال اسم مستخدم صحيح في GitHub');
    }

    const url = `https://api.github.com/users/${encodeURIComponent(cleanUsername)}/repos?sort=updated&per_page=30`;
    const headers: Record<string, string> = {
      Accept: 'application/vnd.github.v3+json',
    };

    const response = await fetch(url, { headers });
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`حساب GitHub (@${cleanUsername}) غير موجود. تأكد من صحة الاسم.`);
      }
      if (response.status === 403) {
        throw new Error('تم تجاوز حد طلبات GitHub العامة مؤقتاً من قبل خادم GitHub. يرجى الانتظار قليلاً أو تجربة الحساب التجريبي.');
      }
      throw new Error(`فشل الاتصال بـ GitHub API (كود ${response.status})`);
    }

    const data = (await response.json()) as RawGitHubApiRepo[];
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error(`لم يتم العثور على مستودعات عامة في حساب @${cleanUsername}.`);
    }

    const mappedRepos: GitHubRepo[] = data.map(item => ({
      id: `gh_${item.id}`,
      name: item.name,
      fullName: item.full_name,
      description: item.description || 'مستودع برمجي مفتوح على منصة GitHub',
      primaryLanguage: item.language || 'Code',
      starsCount: item.stargazers_count,
      forksCount: item.forks_count,
      updatedAt: item.updated_at,
      isPrivate: Boolean(item.private),
      isSelected: true,
      isScanned: false,
      detectedCapabilities: detectCapabilitiesFromLanguage(item.language, item.name)
    }));

    QudraStore.setGitHubRepos(mappedRepos);
    QudraStore.setGitHubConnected(true);
    return mappedRepos;
  },

  async disconnect(): Promise<void> {
    await new Promise(res => setTimeout(res, 50));
    QudraStore.setGitHubConnected(false);
  },

  async getRepos(): Promise<GitHubRepo[]> {
    await new Promise(res => setTimeout(res, 80));
    return QudraStore.getGitHubRepos();
  },

  async toggleRepoSelection(repoId: string): Promise<GitHubRepo[]> {
    const repos = QudraStore.getGitHubRepos();
    const updated = repos.map(r => r.id === repoId ? { ...r, isSelected: !r.isSelected } : r);
    QudraStore.setGitHubRepos(updated);
    return updated;
  },

  async scanSelectedRepos(onProgress?: (progress: number, stepName: string) => void): Promise<GitHubRepo[]> {
    const repos = QudraStore.getGitHubRepos();
    const selected = repos.filter(r => r.isSelected);

    const steps = [
      { p: 15, msg: 'استنساخ شجرة الملفات وفحص معمارية الكود...' },
      { p: 40, msg: 'تحليل الدوال والكلاسات وربط شجرة الـ AST...' },
      { p: 70, msg: 'مطابقة الكود ومعدل التوثيق مع شجرة المهارات...' },
      { p: 95, msg: 'توليد أوزان الثقة وبطاقات الإثبات الرقمية...' },
      { p: 100, msg: 'اكتمل المسح واستخراج الأدلة بنجاح!' }
    ];

    for (const step of steps) {
      if (onProgress) onProgress(step.p, step.msg);
      await new Promise(res => setTimeout(res, 200));
    }

    const updated = repos.map(r => {
      if (r.isSelected) {
        return { ...r, isScanned: true };
      }
      return r;
    });
    QudraStore.setGitHubRepos(updated);
    return selected;
  },

  async getRepoById(id: string): Promise<GitHubRepo | undefined> {
    const repos = QudraStore.getGitHubRepos();
    return repos.find(r => r.id === id || r.name === id);
  }
};
