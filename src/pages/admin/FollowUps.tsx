import { useState, useMemo } from "react";
import { Link } from "wouter";
import { AdminLayout } from "@/components/layouts/AdminLayout";
import { useLeads } from "@/hooks/use-leads";
import { Card, CardContent, Badge, Button, Input, Select, Textarea } from "@/components/ui-components";
import { scoreCategoryToBadgeVariant } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { Calendar, Clock, AlertTriangle, CheckCircle2, Phone, MessageCircle, Filter, X, Send, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { format, formatDistanceToNow, isAfter, isBefore, isToday, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isSameDay, addMonths, subMonths, isSameMonth } from "date-fns";
import { es } from "date-fns/locale";

type TabKey = "overdue" | "today" | "upcoming" | "unscheduled";

const TEMPLATES = [
  { label: "Llamada Inicial", icon: Phone, color: "text-blue-600 bg-blue-50 border-blue-200" },
  { label: "WhatsApp Follow-up", icon: MessageCircle, color: "text-green-600 bg-green-50 border-green-200" },
  { label: "Post-Evaluación", icon: Send, color: "text-purple-600 bg-purple-50 border-purple-200" },
  { label: "Reactivación", icon: Clock, color: "text-amber-600 bg-amber-50 border-amber-200" },
  { label: "Lead Caliente", icon: AlertTriangle, color: "text-red-600 bg-red-50 border-red-200" },
];

function MiniCalendar({ leads }: { leads: { nextFollowUp: string | null }[] }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startDayOfWeek = getDay(monthStart);
  const WEEKDAYS = ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"];

  const followUpDates = useMemo(() => {
    const dates = new Map<string, number>();
    leads.forEach(l => {
      if (l.nextFollowUp) {
        const key = format(new Date(l.nextFollowUp), "yyyy-MM-dd");
        dates.set(key, (dates.get(key) || 0) + 1);
      }
    });
    return dates;
  }, [leads]);

  return (
    <Card className="shadow-sm border-slate-200">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-semibold text-slate-900 capitalize">
            {format(currentMonth, "MMMM yyyy", { locale: es })}
          </span>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="grid grid-cols-7 gap-0">
          {WEEKDAYS.map(d => (
            <div key={d} className="text-center text-[10px] font-semibold text-slate-400 py-1">{d}</div>
          ))}
          {Array.from({ length: startDayOfWeek }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}
          {days.map(day => {
            const key = format(day, "yyyy-MM-dd");
            const count = followUpDates.get(key) || 0;
            const isCurrentDay = isToday(day);
            const isOverdueDay = count > 0 && isBefore(day, new Date()) && !isCurrentDay;
            return (
              <div key={key} className="flex flex-col items-center py-1">
                <span className={cn(
                  "w-7 h-7 flex items-center justify-center rounded-full text-xs font-medium",
                  isCurrentDay && "bg-primary text-white",
                  !isCurrentDay && count > 0 && !isOverdueDay && "bg-blue-50 text-primary font-bold",
                  isOverdueDay && "bg-red-50 text-red-600 font-bold",
                  !isCurrentDay && count === 0 && "text-slate-600"
                )}>
                  {format(day, "d")}
                </span>
                {count > 0 && (
                  <div className="flex gap-0.5 mt-0.5">
                    {Array.from({ length: Math.min(count, 3) }).map((_, i) => (
                      <div key={i} className={cn("w-1 h-1 rounded-full", isOverdueDay ? "bg-red-400" : "bg-primary")} />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

export default function FollowUps() {
  const { data: leads, isLoading } = useLeads();
  const [activeTab, setActiveTab] = useState<TabKey>("overdue");
  const [ownerFilter, setOwnerFilter] = useState("All");
  const [showTemplates, setShowTemplates] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const now = new Date();
  const activeLeads = (leads || []).filter(l => !["Won", "Lost", "Not Qualified"].includes(l.status));

  const overdue = activeLeads.filter(l => l.nextFollowUp && isBefore(new Date(l.nextFollowUp), now) && !isToday(new Date(l.nextFollowUp)));
  const today = activeLeads.filter(l => l.nextFollowUp && isToday(new Date(l.nextFollowUp)));
  const upcoming = activeLeads.filter(l => l.nextFollowUp && isAfter(new Date(l.nextFollowUp), now) && !isToday(new Date(l.nextFollowUp)));
  const unscheduled = activeLeads.filter(l => !l.nextFollowUp);

  const tabs: { key: TabKey; label: string; count: number; icon: React.ComponentType<{ className?: string }>; color: string }[] = [
    { key: "overdue", label: "Vencidos", count: overdue.length, icon: AlertTriangle, color: "text-red-600 bg-red-50 border-red-200" },
    { key: "today", label: "Hoy", count: today.length, icon: Clock, color: "text-amber-600 bg-amber-50 border-amber-200" },
    { key: "upcoming", label: "Próximos", count: upcoming.length, icon: Calendar, color: "text-primary bg-blue-50 border-blue-200" },
    { key: "unscheduled", label: "Sin Agendar", count: unscheduled.length, icon: Filter, color: "text-slate-500 bg-slate-50 border-slate-200" },
  ];

  const currentLeads = (activeTab === "overdue" ? overdue : activeTab === "today" ? today : activeTab === "upcoming" ? upcoming : unscheduled)
    .filter(l => ownerFilter === "All" || l.owner === ownerFilter);

  return (
    <AdminLayout>
      <div className="p-6 lg:p-8 max-w-[1200px] mx-auto space-y-6">
        <div className="flex flex-col gap-3">
          <div>
            <h1 className="text-2xl font-display font-bold text-slate-900">Follow-ups</h1>
            <p className="text-sm text-slate-500 mt-1">Gestiona tus seguimientos pendientes y no pierdas ninguna oportunidad.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Select className="h-9 flex-1 min-w-[140px] bg-white text-sm" value={ownerFilter} onChange={e => setOwnerFilter(e.target.value)}>
              <option value="All">Todos los owners</option>
              <option>Carlos Reyes</option>
              <option>María Santos</option>
              <option>Juan Delgado</option>
            </Select>
            <Button variant="outline" className={cn("bg-white shrink-0", showTemplates && "border-primary bg-primary/5")} onClick={() => setShowTemplates(!showTemplates)}>
              Templates
            </Button>
            <Button className="shrink-0" onClick={() => setShowCreateModal(true)}>
              <Plus className="h-4 w-4 mr-1.5" /> Crear Follow-up
            </Button>
          </div>
        </div>

        {showTemplates && (
          <Card className="shadow-sm border-slate-200 p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-slate-900">Templates de Seguimiento</h3>
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setShowTemplates(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {TEMPLATES.map(t => (
                <button key={t.label} className={cn("flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-all hover:shadow-sm", t.color)}>
                  <t.icon className="h-4 w-4" />
                  {t.label}
                </button>
              ))}
            </div>
          </Card>
        )}

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 min-w-0 space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {tabs.map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={cn(
                    "p-4 rounded-xl border-2 text-left transition-all",
                    activeTab === tab.key ? `${tab.color} shadow-sm` : "bg-white border-slate-200 hover:border-slate-300"
                  )}
                >
                  <div className="flex items-center justify-between mb-2">
                    <tab.icon className={cn("h-5 w-5", activeTab === tab.key ? "" : "text-slate-400")} />
                    <span className={cn("text-2xl font-display font-bold", activeTab === tab.key ? "" : "text-slate-900")}>{tab.count}</span>
                  </div>
                  <div className={cn("text-sm font-semibold", activeTab === tab.key ? "" : "text-slate-600")}>{tab.label}</div>
                </button>
              ))}
            </div>

        {isLoading ? (
          <div className="text-center py-16 text-slate-500">Cargando...</div>
        ) : currentLeads.length === 0 ? (
          <Card className="shadow-sm border-slate-200">
            <CardContent className="py-16 text-center">
              <CheckCircle2 className="h-12 w-12 text-emerald-400 mx-auto mb-4" />
              <h3 className="font-display font-bold text-lg text-slate-900 mb-1">Todo al día</h3>
              <p className="text-slate-500 text-sm">No hay follow-ups en esta categoría{ownerFilter !== "All" ? ` para ${ownerFilter}` : ""}.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {currentLeads.map(lead => (
              <Card key={lead.id} className={cn(
                "shadow-sm transition-all hover:shadow-md",
                activeTab === "overdue" ? "border-red-200 bg-red-50/30" : "border-slate-200"
              )}>
                <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className={cn(
                      "h-11 w-11 rounded-xl flex items-center justify-center font-bold text-sm shrink-0",
                      activeTab === "overdue" ? "bg-red-100 text-red-600" : "bg-primary/10 text-primary"
                    )}>
                      {lead.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <Link href={`/admin/leads/${lead.id}`} className="font-semibold text-slate-900 hover:text-primary transition-colors block truncate">
                        {lead.name}
                      </Link>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                        <span>{lead.municipality}</span>
                        <span>·</span>
                        <span>{lead.propertyType}</span>
                        <span>·</span>
                        <Badge variant={scoreCategoryToBadgeVariant(lead.scoreCategory)} className="text-[10px]">
                          {lead.scoreCategory}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 sm:shrink-0">
                    {lead.nextFollowUp ? (
                      <div className={cn(
                        "text-sm text-right",
                        activeTab === "overdue" ? "text-red-600" : "text-slate-600"
                      )}>
                        <div className="font-semibold">{format(new Date(lead.nextFollowUp), "dd MMM", { locale: es })}</div>
                        <div className="text-xs">{formatDistanceToNow(new Date(lead.nextFollowUp), { addSuffix: true, locale: es })}</div>
                      </div>
                    ) : (
                      <div className="text-sm text-slate-400 italic">Sin fecha</div>
                    )}

                    <div className="flex gap-1.5">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50">
                        <Phone className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-green-600 hover:bg-green-50">
                        <MessageCircle className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="w-7 h-7 rounded-full bg-slate-100 text-[10px] flex items-center justify-center font-bold text-slate-500 shrink-0">
                      {lead.owner.substring(0, 2).toUpperCase()}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
          </div>

          <div className="lg:w-64 shrink-0">
            <MiniCalendar leads={leads || []} />
          </div>
        </div>
      </div>

      {showCreateModal && (
        <>
          <div className="fixed inset-0 bg-black/40 z-40" onClick={() => setShowCreateModal(false)} />
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-lg shadow-2xl border-slate-200">
              <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-display font-bold text-lg text-slate-900">Crear Follow-up</h3>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setShowCreateModal(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="p-5 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Lead</label>
                  <Select className="h-10 bg-slate-50">
                    <option value="">Seleccionar lead...</option>
                    {(leads || []).filter(l => !["Won", "Lost", "Not Qualified"].includes(l.status)).map(l => (
                      <option key={l.id} value={l.id}>{l.name} - {l.municipality}</option>
                    ))}
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Tipo de follow-up</label>
                  <Select className="h-10 bg-slate-50">
                    <option>Llamada</option>
                    <option>WhatsApp</option>
                    <option>Email</option>
                    <option>Visita</option>
                    <option>Evaluación</option>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Fecha</label>
                  <Input type="date" className="h-10 bg-slate-50" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Asignar a</label>
                  <Select className="h-10 bg-slate-50">
                    <option>María Santos</option>
                    <option>Carlos Reyes</option>
                    <option>Juan Delgado</option>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Notas</label>
                  <Textarea placeholder="Notas adicionales para el follow-up..." className="bg-slate-50" />
                </div>
                <div className="flex flex-wrap gap-2 pt-2">
                  <span className="text-xs text-slate-500 w-full mb-1">Templates rápidos:</span>
                  {TEMPLATES.map(t => (
                    <button key={t.label} className={cn("flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium", t.color)}>
                      <t.icon className="h-3 w-3" />
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="p-5 border-t border-slate-100 flex justify-end gap-3">
                <Button variant="outline" onClick={() => setShowCreateModal(false)}>Cancelar</Button>
                <Button onClick={() => setShowCreateModal(false)}>Crear Follow-up</Button>
              </div>
            </Card>
          </div>
        </>
      )}
    </AdminLayout>
  );
}
