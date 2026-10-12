import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Target, HelpCircle, Sparkles, Layout, Eye, Save, X, Grid, Layers, BarChart2, Users, Award, ShieldCheck, Clock, TrendingUp } from 'lucide-react';
import { ROUTES } from '../../../constants/routes';
import { useRole } from '../../../contexts/useRole';
import { AnchorNav, AnchorLink } from '../../../components/patterns/AnchorNav';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import styles from './m02.module.css';

const M02_ANCHORS: AnchorLink[] = [
  { id: 'overview', label: 'نظرة عامة', path: ROUTES.M02_OVERVIEW, icon: <BarChart2 size={16} /> },
  { id: 'details', label: 'التفاصيل', path: ROUTES.M02_DETAILS, icon: <TrendingUp size={16} /> },
  { id: 'create', label: 'تخصيص', path: ROUTES.M02_CREATE, icon: <Target size={16} /> },
  { id: 'results', label: 'الملخص', path: ROUTES.M02_RESULTS, icon: <Award size={16} /> },
  { id: 'empty', label: 'جديد', path: ROUTES.M02_EMPTY, icon: <Sparkles size={16} /> },
  { id: 'error', label: 'خطأ', path: ROUTES.M02_ERROR, icon: <ShieldCheck size={16} /> },
];

interface WidgetConfig {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  enabled: boolean;
  requiredRole?: 'u' | 'c' | 'both';
  size: 'small' | 'medium' | 'large';
  category: 'metrics' | 'actions' | 'insights' | 'social';
}

const AVAILABLE_WIDGETS: WidgetConfig[] = [
  { id: 'metrics_cards', name: 'بطاقات المقاييس', icon: <BarChart2 size={20} />, description: 'مهارات مثبتة، أدلة، معدل موثوقية', enabled: true, requiredRole: 'u', size: 'medium', category: 'metrics' },
  { id: 'next_action', name: 'الخطوة التالية', icon: <Target size={20} />, description: 'توصية محرك الخطوة التالية (M09)', enabled: true, requiredRole: 'u', size: 'large', category: 'insights' },
  { id: 'capabilities_grid', name: 'شبكة الكفاءات', icon: <ShieldCheck size={20} />, description: 'جميع المهارات مع قوة الأدلة والحالة', enabled: true, requiredRole: 'u', size: 'large', category: 'metrics' },
  { id: 'quick_hub', name: 'مركز الإطلاق السريع', icon: <Layout size={20} />, description: 'روابط البروفايل، المصادر، الجواز، التحديات', enabled: true, requiredRole: 'u', size: 'medium', category: 'actions' },
  { id: 'problem_actions', name: 'إجراءات المشكلة', icon: <Layers size={20} />, description: 'تفكيك، مطابقة، مقارنة، بناء فرق', enabled: true, requiredRole: 'c', size: 'large', category: 'actions' },
  { id: 'org_hero', name: 'بانر المنشأة', icon: <Award size={20} />, description: 'شعار، وصف، أزرار إجراء رئيسية', enabled: true, requiredRole: 'c', size: 'large', category: 'metrics' },
  { id: 'dna_summary', name: 'ملخص DNA', icon: <Target size={20} />, description: 'الأبعاد الهندسية والنقاط القوية', enabled: false, requiredRole: 'both', size: 'medium', category: 'insights' },
  { id: 'timeline_recent', name: 'النشاط الأخير', icon: <Clock size={20} />, description: 'آخر 5 إنجازات وأدلة مضافة', enabled: false, requiredRole: 'both', size: 'medium', category: 'insights' },
  { id: 'opportunities_match', name: 'فرص مطابقة', icon: <Sparkles size={20} />, description: 'أفضل 3 فرص مناسبة لملفك', enabled: false, requiredRole: 'u', size: 'medium', category: 'social' },
  { id: 'candidates_match', name: 'مرشحين مطابقين', icon: <Users size={20} />, description: 'أفضل 3 مرشحين لمشكلتك', enabled: false, requiredRole: 'c', size: 'medium', category: 'social' },
];

export const M02CreatePage: React.FC = () => {
  const navigate = useNavigate();
  const { role } = useRole();
  const [widgets, setWidgets] = useState<WidgetConfig[]>(AVAILABLE_WIDGETS);
  const [previewMode, setPreviewMode] = useState(false);
  const [saved, setSaved] = useState(false);

  const filteredWidgets = widgets.filter(w => !w.requiredRole || w.requiredRole === 'both' || w.requiredRole === role);

  const toggleWidget = (id: string) => {
    setWidgets(prev => prev.map(w => w.id === id ? { ...w, enabled: !w.enabled } : w));
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      navigate(ROUTES.HOME);
    }, 1500);
  };

  const handleReset = () => {
    setWidgets(AVAILABLE_WIDGETS);
  };

  return (
    <div className={styles.page} dir="rtl">
      <AnchorNav anchors={M02_ANCHORS} title="شاشات اللوحة الرئيسية (M02)" />

      <header className={styles.header}>
        <Button variant="ghost" size="sm" onClick={() => navigate(ROUTES.HOME)} leftIcon={<ArrowLeft size={16} />}>
          العودة للوحة الرئيسية
        </Button>
        <div className={styles.headerContent}>
          <div className={styles.headerIcon}>
            <Target size={32} />
          </div>
          <div>
            <h1 className={styles.title}>تخصيص لوحة التحكم</h1>
            <p className={styles.subtitle}>
              اختر الويدجتس (Widgets) التي تريد ظهورها، رتبها، وحدد الحجم المناسب لدورك
            </p>
          </div>
        </div>
        <Badge variant="proof">Q-0044</Badge>
      </header>

      <div className={styles.toolbar}>
        <div className={styles.toolbarLeft}>
          <Badge variant={role === 'u' ? 'proof' : 'neutral'}>
            <Users size={12} /> دور المطور
          </Badge>
          <Badge variant={role === 'c' ? 'proof' : 'neutral'}>
            <Award size={12} /> دور المنشأة
          </Badge>
          <span className={styles.widgetCount}>{filteredWidgets.filter(w => w.enabled).length} / {filteredWidgets.length} ويدجتس مفعلة</span>
        </div>
        <div className={styles.toolbarRight}>
          <Button variant="ghost" size="sm" onClick={handleReset} leftIcon={<X size={16} />}>
            إعادة التعيين
          </Button>
          <Button variant="outline" size="sm" onClick={() => setPreviewMode(!previewMode)} leftIcon={previewMode ? <Eye size={16} /> : <Grid size={16} />}>
            {previewMode ? 'خروج من المعاينة' : 'معاينة مباشرة'}
          </Button>
          <Button variant="proof" size="md" onClick={handleSave} leftIcon={<Save size={16} />} disabled={saved}>
            {saved ? 'تم الحفظ ✓' : 'حفظ والتطبيق'}
          </Button>
        </div>
      </div>

      {previewMode && (
        <section className={styles.previewSection} aria-labelledby="preview-title">
          <h2 id="preview-title" className={styles.sectionTitle}>معاينة مباشرة للوحة الرئيسية</h2>
          <div className={styles.previewBadge}>
            <Sparkles size={14} /> وضع المعاينة — التغييرات غير محفوظة بعد
          </div>
          <div className={styles.previewGrid}>
            {filteredWidgets.filter(w => w.enabled).map(widget => (
              <div key={widget.id} className={`${styles.previewWidget} ${widget.size}`}>
                <div className={styles.previewWidgetHeader}>
                  <div className={styles.previewWidgetIcon}>{widget.icon}</div>
                  <h4>{widget.name}</h4>
                </div>
                <p className={styles.previewWidgetDesc}>{widget.description}</p>
                <Badge variant="neutral">{widget.category}</Badge>
              </div>
            ))}
            {filteredWidgets.filter(w => w.enabled).length === 0 && (
              <div className={styles.previewEmpty}>
                <HelpCircle size={32} />
                <h3>لا توجد ويدجتس مفعلة</h3>
                <p>اختر ويدجتس من القائمة أدناه لتظهر في المعاينة</p>
              </div>
            )}
          </div>
        </section>
      )}

      <section className={styles.widgetsSection} aria-labelledby="widgets-title">
        <h2 id="widgets-title" className={styles.sectionTitle}>الويدجتس المتاحة ({filteredWidgets.length})</h2>
        <div className={styles.widgetsCategories}>
          {['metrics', 'actions', 'insights', 'social'].map(cat => {
            const catWidgets = filteredWidgets.filter(w => w.category === cat);
            if (catWidgets.length === 0) return null;
            const catLabels: Record<string, { label: string; icon: React.ReactNode }> = {
              metrics: { label: 'المقاييس والإحصائيات', icon: <BarChart2 size={16} /> },
              actions: { label: 'الإجراءات السريعة', icon: <Layout size={16} /> },
              insights: { label: 'الرؤى والتحليلات', icon: <Target size={16} /> },
              social: { label: 'الاجتماعي والفرص', icon: <Users size={16} /> },
            };
            return (
              <div key={cat} className={styles.widgetsCategory}>
                <h3 className={styles.categoryTitle}>
                  {catLabels[cat].icon} {catLabels[cat].label} ({catWidgets.length})
                </h3>
                <div className={styles.widgetsList}>
                  {catWidgets.map(widget => (
                    <article key={widget.id} className={`${styles.widgetItem} ${widget.enabled ? styles.enabled : ''}`}>
                      <div className={styles.widgetItemMain}>
                        <div className={styles.widgetItemIcon}>{widget.icon}</div>
                        <div className={styles.widgetItemInfo}>
                          <h4>{widget.name}</h4>
                          <p>{widget.description}</p>
                          <div className={styles.widgetItemMeta}>
                            <Badge variant="neutral">{widget.size}</Badge>
                            {widget.requiredRole && widget.requiredRole !== 'both' && (
                              <Badge variant="gap">
                                {widget.requiredRole === 'u' ? <Users size={10} /> : <Award size={10} />}
                                {widget.requiredRole === 'u' ? 'مطور فقط' : 'منشأة فقط'}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <label className={styles.toggleSwitch}>
                        <input
                          type="checkbox"
                          checked={widget.enabled}
                          onChange={() => toggleWidget(widget.id)}
                        />
                        <span className={styles.toggleSlider}></span>
                      </label>
                    </article>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className={styles.layoutSection} aria-labelledby="layout-title">
        <h2 id="layout-title" className={styles.sectionTitle}>خيارات التخطيط</h2>
        <div className={styles.layoutOptions}>
          <div className={styles.layoutOption}>
            <h4><Grid size={18} /> شبكة متجاوبة (افتراضي)</h4>
            <p>الويدجتس تتكيف تلقائياً مع عرض الشاشة (1-4 أعمدة)</p>
          </div>
          <div className={styles.layoutOption}>
            <h4><Layers size={18} /> تخطيط ثابت</h4>
            <p>ترتيب يدوي للويدجتس مع أحجام محددة (Small/Medium/Large)</p>
          </div>
          <div className={styles.layoutOption}>
            <h4><Target size={18} /> أولوية الدور</h4>
            <p>إظهار/إخفاء الويدجتس تلقائياً بناءً على الدور المحدد (مطور/منشأة)</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default M02CreatePage;