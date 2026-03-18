import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/layouts/AdminLayout";
import { Card, CardContent, Badge, Button } from "@/components/ui-components";
import { cn } from "@/lib/utils";
import {
  BookOpen, Users, Target, Zap, Megaphone, ChevronLeft, Clock, CheckCircle, Play, ArrowLeft, Loader2,
  LayoutDashboard, Home, MessageSquare, Calendar, DollarSign, Shield, Settings, BarChart3, Briefcase, SquareKanban
} from "lucide-react";
import { learningService } from "@/lib/services/learningService";
import type { LearningSection, Lesson } from "@/lib/operations-types";

const SECTION_ICONS: Record<string, any> = {
  users: Users, target: Target, zap: Zap, megaphone: Megaphone,
  layout: LayoutDashboard, home: Home, message: MessageSquare,
  calendar: Calendar, dollar: DollarSign, shield: Shield,
  settings: Settings, chart: BarChart3, briefcase: Briefcase, kanban: SquareKanban,
};

type RoleTab = 'all' | 'agent' | 'admin' | 'manager';

const ROLE_TABS: { key: RoleTab; label: string }[] = [
  { key: 'all', label: 'Todos' },
  { key: 'agent', label: 'Agente' },
  { key: 'admin', label: 'Administrador' },
  { key: 'manager', label: 'Gerente' },
];

const SECTION_ROLES: Record<string, RoleTab[]> = {
  'Leads & Pipeline': ['agent', 'admin'],
  'Gestión de Leads': ['agent', 'admin'],
  'Scoring & Evaluación': ['agent', 'admin'],
  'Comunicaciones': ['agent'],
  'Calendario & Citas': ['agent'],
  'Marketing & Campañas': ['admin', 'manager'],
  'Reportes & Analytics': ['manager', 'admin'],
  'Configuración': ['admin'],
  'HR & Recursos Humanos': ['manager', 'admin'],
  'AI Assistant': ['admin'],
};

export default function LearningCenterPage() {
  const [sections, setSections] = useState<LearningSection[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSection, setSelectedSection] = useState<LearningSection | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [roleTab, setRoleTab] = useState<RoleTab>('all');

  useEffect(() => {
    Promise.all([learningService.getSections(), learningService.getLessons()]).then(([secs, les]) => {
      setSections(secs);
      setLessons(les);
      setLoading(false);
    });
  }, []);

  const handleMarkComplete = async (lessonId: string) => {
    await learningService.markComplete(lessonId);
    const [secs, les] = await Promise.all([learningService.getSections(), learningService.getLessons()]);
    setSections(secs);
    setLessons(les);
    const updated = les.find(l => l.id === lessonId);
    if (updated) setSelectedLesson(updated);
  };

  const filteredSections = roleTab === 'all'
    ? sections
    : sections.filter(sec => {
        const roles = SECTION_ROLES[sec.title];
        return !roles || roles.includes(roleTab);
      });

  const totalLessons = sections.reduce((s, sec) => s + sec.lessonCount, 0);
  const completedLessons = sections.reduce((s, sec) => s + sec.completedCount, 0);
  const progressPct = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  if (selectedLesson) {
    return (
      <AdminLayout>
        <div className="min-h-screen bg-white relative">
          <div className="border-b border-slate-200 bg-slate-50 sticky top-0 z-30">
            <div className="max-w-4xl mx-auto px-6 py-3 flex items-center justify-between">
              <button onClick={() => setSelectedLesson(null)} className="flex items-center gap-2 text-sm text-slate-600 hover:text-primary transition-colors">
                <ArrowLeft className="h-4 w-4" /> Volver a lecciones
              </button>
              <div className="flex items-center gap-3">
                <Badge variant={selectedLesson.completed ? 'success' : 'secondary'} className="text-[10px]">
                  {selectedLesson.completed ? 'Completada' : 'Pendiente'}
                </Badge>
                <Button size="sm" variant={selectedLesson.completed ? 'outline' : 'default'} onClick={() => handleMarkComplete(selectedLesson.id)}>
                  <CheckCircle className="h-3.5 w-3.5 mr-1" />
                  {selectedLesson.completed ? 'Desmarcar' : 'Marcar Completa'}
                </Button>
              </div>
            </div>
          </div>

          <div className="max-w-4xl mx-auto px-6 py-8 relative z-10">
            <div className="mb-8">
              <h1 className="text-3xl font-display font-bold text-slate-900 mb-2">{selectedLesson.title}</h1>
              <p className="text-slate-500">{selectedLesson.description}</p>
              <div className="flex items-center gap-3 mt-3 text-sm text-slate-400">
                <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {selectedLesson.estimatedMinutes} min</span>
              </div>
            </div>

            <div className="bg-slate-900 rounded-2xl aspect-video flex items-center justify-center mb-8 relative z-10">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-3">
                  <Play className="h-8 w-8 text-white ml-1" />
                </div>
                <p className="text-white/60 text-sm">Video de la lección</p>
                <p className="text-white/40 text-xs mt-1">Contenido de video próximamente</p>
              </div>
            </div>

            <div className="prose prose-slate max-w-none relative z-10">
              {selectedLesson.content.split('\n').map((line, i) => {
                if (line.startsWith('## ')) return <h2 key={i} className="text-xl font-display font-bold text-slate-900 mt-8 mb-4">{line.replace('## ', '')}</h2>;
                if (line.startsWith('### ')) return <h3 key={i} className="text-lg font-semibold text-slate-800 mt-6 mb-3">{line.replace('### ', '')}</h3>;
                if (line.startsWith('- **')) {
                  const match = line.match(/- \*\*(.+?)\*\*:?\s*(.*)/);
                  if (match) return <div key={i} className="flex items-start gap-2 py-1"><span className="font-semibold text-slate-700">{match[1]}:</span><span className="text-slate-600">{match[2]}</span></div>;
                }
                if (line.startsWith('- ✅') || line.startsWith('- ❌')) {
                  return <div key={i} className="py-0.5 text-slate-600">{line.replace('- ', '')}</div>;
                }
                if (line.match(/^\d+\.\s/)) {
                  return <div key={i} className="flex items-start gap-2 py-1 text-slate-600"><span className="font-medium text-primary shrink-0">{line.match(/^\d+/)![0]}.</span><span>{line.replace(/^\d+\.\s/, '')}</span></div>;
                }
                if (line.trim() === '') return <div key={i} className="h-2" />;
                return <p key={i} className="text-slate-600 leading-relaxed my-2">{line}</p>;
              })}
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (selectedSection) {
    const sectionLessons = lessons.filter(l => l.sectionId === selectedSection.id).sort((a, b) => a.order - b.order);
    const SectionIcon = SECTION_ICONS[selectedSection.icon] || BookOpen;

    return (
      <AdminLayout breadcrumbs={[{ label: "Learning Center", href: "/admin/learning" }, { label: selectedSection.title }]}>
        <div className="p-6 lg:p-8 max-w-[1200px] mx-auto space-y-6 relative z-10">
          <div className="flex items-center gap-4">
            <button onClick={() => setSelectedSection(null)} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
              <ChevronLeft className="h-5 w-5 text-slate-500" />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <SectionIcon className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-display font-bold text-slate-900">{selectedSection.title}</h1>
                <p className="text-sm text-slate-500">{selectedSection.description}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex-1 bg-slate-100 rounded-full h-2">
              <div className="bg-primary rounded-full h-2 transition-all" style={{ width: `${selectedSection.lessonCount > 0 ? (selectedSection.completedCount / selectedSection.lessonCount) * 100 : 0}%` }} />
            </div>
            <span className="text-sm text-slate-500 font-medium">{selectedSection.completedCount}/{selectedSection.lessonCount}</span>
          </div>

          <div className="space-y-3">
            {sectionLessons.map((lesson, i) => (
              <Card key={lesson.id} className={cn("shadow-sm border-slate-200 hover:shadow-md transition-all cursor-pointer", lesson.completed && "border-l-4 border-l-emerald-500")} onClick={() => setSelectedLesson(lesson)}>
                <CardContent className="p-5">
                  <div className="flex items-center gap-4">
                    <div className={cn("w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0", lesson.completed ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-400")}>
                      {lesson.completed ? <CheckCircle className="h-5 w-5" /> : i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-slate-900">{lesson.title}</h3>
                      <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{lesson.description}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-slate-400 flex items-center gap-1"><Clock className="h-3 w-3" /> {lesson.estimatedMinutes} min</span>
                      {lesson.completed && <Badge variant="success" className="text-[10px]">Completada</Badge>}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout breadcrumbs={[{ label: "Dashboard", href: "/admin/dashboard" }, { label: "Learning Center" }]}>
      <div className="p-6 lg:p-8 max-w-[1200px] mx-auto space-y-6 relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold text-slate-900">Learning Center</h1>
            <p className="text-sm text-slate-500 mt-1">Módulos de capacitación y guías del sistema.</p>
          </div>
        </div>

        <Card className="shadow-sm border-slate-200 bg-gradient-to-r from-primary/5 to-accent/5">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-display font-bold text-slate-900">Tu Progreso</h3>
                <p className="text-sm text-slate-500">{completedLessons} de {totalLessons} lecciones completadas</p>
              </div>
              <div className="text-3xl font-display font-bold text-primary">{progressPct}%</div>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-3">
              <div className="bg-primary rounded-full h-3 transition-all duration-500" style={{ width: `${progressPct}%` }} />
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-1 overflow-x-auto pb-1">
          {ROLE_TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setRoleTab(tab.key)}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-lg transition-all whitespace-nowrap",
                roleTab === tab.key ? "bg-primary text-white" : "text-slate-500 hover:bg-slate-100"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredSections.map(section => {
              const SectionIcon = SECTION_ICONS[section.icon] || BookOpen;
              const pct = section.lessonCount > 0 ? Math.round((section.completedCount / section.lessonCount) * 100) : 0;
              const roles = SECTION_ROLES[section.title];
              return (
                <Card key={section.id} className="shadow-sm border-slate-200 hover:shadow-lg transition-all cursor-pointer group relative z-10" onClick={() => setSelectedSection(section)}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                        <SectionIcon className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-display font-bold text-slate-900 group-hover:text-primary transition-colors">{section.title}</h3>
                        <p className="text-sm text-slate-500 mt-1">{section.description}</p>
                      </div>
                    </div>
                    {roles && (
                      <div className="flex gap-1 mb-3">
                        {roles.map(r => (
                          <span key={r} className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 capitalize">{r === 'agent' ? 'Agente' : r === 'admin' ? 'Admin' : 'Gerente'}</span>
                        ))}
                      </div>
                    )}
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-slate-500">{section.completedCount}/{section.lessonCount} lecciones</span>
                      <span className="text-xs font-semibold text-primary">{pct}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div className="bg-primary rounded-full h-2 transition-all" style={{ width: `${pct}%` }} />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
