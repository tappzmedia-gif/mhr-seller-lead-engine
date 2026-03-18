import { AdminLayout } from "@/components/layouts/AdminLayout";
import { useDashboardStats } from "@/hooks/use-dashboard";
import { useLeads } from "@/hooks/use-leads";
import { Card, CardContent, CardHeader, CardTitle, Badge, Button } from "@/components/ui-components";
import { scoreCategoryToBadgeVariant } from "@/lib/mock-data";
import { Users, Flame, CheckCircle2, TrendingUp, PhoneCall, AlertCircle, ArrowRight, Plus, SquareKanban, Calendar, Clock, FileText, MessageCircle, Phone, Trophy } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { formatDistanceToNow, format, isBefore, isToday } from "date-fns";
import { es } from "date-fns/locale";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface KPICardProps {
  title: string;
  value: string | number | undefined;
  icon: LucideIcon;
  loading: boolean;
  trend?: string;
  trendColor?: string;
  highlight?: boolean;
}

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: leads, isLoading: leadsLoading } = useLeads();

  const recentLeads = leads?.slice(0, 5) || [];
  const urgentLeads = leads?.filter(l => l.priority === 'Urgent' && l.status !== 'Lost' && l.status !== 'Won').slice(0, 4) || [];

  const now = new Date();
  const overdueFollowUps = (leads || []).filter(l =>
    l.nextFollowUp && isBefore(new Date(l.nextFollowUp), now) && !isToday(new Date(l.nextFollowUp)) && !["Won", "Lost", "Not Qualified"].includes(l.status)
  ).slice(0, 5);
  const todayFollowUps = (leads || []).filter(l =>
    l.nextFollowUp && isToday(new Date(l.nextFollowUp)) && !["Won", "Lost", "Not Qualified"].includes(l.status)
  ).slice(0, 5);

  const allActivities = (leads || []).flatMap(l =>
    l.activities.map(a => ({ ...a, leadName: l.name, leadId: l.id }))
  ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 8);

  const activityIcons: Record<string, LucideIcon> = {
    Call: PhoneCall,
    Email: MessageCircle,
    WhatsApp: MessageCircle,
    Note: FileText,
    StatusChange: CheckCircle2,
    System: AlertCircle,
  };

  return (
    <AdminLayout>
      <div className="p-6 lg:p-8 space-y-8 max-w-[1600px] mx-auto">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img src={`${import.meta.env.BASE_URL}logo.png`} alt="My House Realty" className="h-12 w-auto object-contain" />
            <div>
              <h1 className="text-3xl font-display font-bold text-slate-900">Dashboard Operativo</h1>
              <p className="text-slate-500 mt-1">Resumen del rendimiento de seller leads.</p>
            </div>
          </div>
          <div className="flex gap-3">
             <Link href="/admin/leads">
              <Button variant="outline" className="bg-white">Ver Todos</Button>
             </Link>
             <Button><Plus className="h-4 w-4 mr-2" /> Crear Lead Manual</Button>
          </div>
        </div>

        <motion.div
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <KPICard title="Total Leads" value={stats?.total} icon={Users} loading={statsLoading} />
          <KPICard title="Nuevos (Sin tocar)" value={stats?.newLeads} icon={AlertCircle} loading={statsLoading} trend="+3 hoy" trendColor="text-orange-500" highlight />
          <KPICard title="Urgentes" value={stats?.urgent} icon={Flame} loading={statsLoading} trend="Prioridad" trendColor="text-red-500" />
          <KPICard title="Calificados Activos" value={stats?.qualified} icon={CheckCircle2} loading={statsLoading} />
          <KPICard title="Contactados" value={stats?.contacted} icon={Phone} loading={statsLoading} />
          <KPICard title="Conversiones" value={stats?.won} icon={Trophy} loading={statsLoading} />
          <KPICard title="Oportunidades" value={stats?.opportunities} icon={TrendingUp} loading={statsLoading} />
          <KPICard title="Tasa de Conversión" value={`${stats?.conversionRate}%`} icon={TrendingUp} loading={statsLoading} />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <Card className="lg:col-span-2 shadow-sm border-slate-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-slate-100">
              <CardTitle>Leads Recientes</CardTitle>
              <Link href="/admin/leads" className="text-sm text-primary font-medium hover:underline">Ver todos</Link>
            </CardHeader>
            <CardContent className="p-0">
              {leadsLoading ? (
                <div className="p-6 text-center text-slate-500">Cargando...</div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {recentLeads.map(lead => (
                    <div key={lead.id} className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
                      <div className="flex items-start gap-4">
                        <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold shrink-0">
                          {lead.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <Link href={`/admin/leads/${lead.id}`} className="font-semibold text-slate-900 hover:text-primary transition-colors block">
                            {lead.name}
                          </Link>
                          <div className="text-sm text-slate-500 flex items-center gap-2 mt-0.5">
                            <span>{lead.municipality}</span>
                            <span>·</span>
                            <span>{lead.propertyType}</span>
                            <span>·</span>
                            <span className="text-xs">{formatDistanceToNow(new Date(lead.entryDate), { addSuffix: true, locale: es })}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant={scoreCategoryToBadgeVariant(lead.scoreCategory)}>{lead.scoreCategory}</Badge>
                        <Badge variant="outline" className="hidden sm:inline-flex">{lead.status}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="shadow-sm border-slate-200 border-t-4 border-t-red-500">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-red-600">
                  <Flame className="h-5 w-5" />
                  Atención Inmediata
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 mt-2">
                  {urgentLeads.length > 0 ? urgentLeads.map(lead => (
                    <div key={lead.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-100">
                      <div>
                        <Link href={`/admin/leads/${lead.id}`} className="font-semibold text-slate-900 hover:underline block text-sm">
                          {lead.name}
                        </Link>
                        <span className="text-xs text-red-600 font-medium">{lead.situation[0] || 'Urgente'}</span>
                      </div>
                      <Button size="icon" variant="ghost" className="h-8 w-8 text-red-600 hover:bg-red-100 hover:text-red-700">
                        <PhoneCall className="h-4 w-4" />
                      </Button>
                    </div>
                  )) : (
                    <div className="text-sm text-slate-500">No hay casos urgentes pendientes.</div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-slate-200 bg-gradient-to-br from-primary to-blue-700 text-white">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <SquareKanban className="h-10 w-10 mb-4 opacity-80" />
                <h3 className="font-display font-bold text-xl mb-2">Pipeline Activo</h3>
                <p className="text-sm text-blue-100 mb-6">Mueve oportunidades por etapa para cerrar más tratos.</p>
                <Link href="/admin/pipeline" className="w-full">
                  <Button className="w-full bg-white text-primary hover:bg-slate-50 shadow-lg">
                    Ver Tablero Kanban <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="shadow-sm border-slate-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-slate-100">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" /> Follow-up Reminders
              </CardTitle>
              <Link href="/admin/follow-ups" className="text-sm text-primary font-medium hover:underline">Ver todos</Link>
            </CardHeader>
            <CardContent className="pt-4">
              {overdueFollowUps.length > 0 && (
                <div className="mb-4">
                  <div className="text-xs font-semibold text-red-600 uppercase mb-2">Vencidos ({overdueFollowUps.length})</div>
                  <div className="space-y-2">
                    {overdueFollowUps.map(lead => (
                      <div key={lead.id} className="flex items-center justify-between p-2.5 bg-red-50 rounded-lg border border-red-100">
                        <div className="flex items-center gap-3">
                          <div className="w-7 h-7 rounded-full bg-red-100 text-red-600 text-[10px] flex items-center justify-center font-bold">
                            {lead.name.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <span className="text-sm font-medium text-slate-900">{lead.name}</span>
                            <div className="text-[11px] text-red-500">{lead.nextFollowUp && format(new Date(lead.nextFollowUp), "dd MMM", { locale: es })}</div>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-red-600"><PhoneCall className="h-3.5 w-3.5" /></Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {todayFollowUps.length > 0 && (
                <div>
                  <div className="text-xs font-semibold text-amber-600 uppercase mb-2">Hoy ({todayFollowUps.length})</div>
                  <div className="space-y-2">
                    {todayFollowUps.map(lead => (
                      <div key={lead.id} className="flex items-center justify-between p-2.5 bg-amber-50 rounded-lg border border-amber-100">
                        <div className="flex items-center gap-3">
                          <div className="w-7 h-7 rounded-full bg-amber-100 text-amber-600 text-[10px] flex items-center justify-center font-bold">
                            {lead.name.substring(0, 2).toUpperCase()}
                          </div>
                          <span className="text-sm font-medium text-slate-900">{lead.name}</span>
                        </div>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-amber-600"><PhoneCall className="h-3.5 w-3.5" /></Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {overdueFollowUps.length === 0 && todayFollowUps.length === 0 && (
                <div className="text-center py-6 text-slate-400 text-sm">No hay follow-ups pendientes.</div>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-sm border-slate-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-slate-100">
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" /> Actividad Reciente
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              {allActivities.length > 0 ? (
                <div className="space-y-0">
                  {allActivities.map(act => {
                    const Icon = activityIcons[act.type] || FileText;
                    return (
                      <div key={act.id} className="flex gap-3 py-2.5 border-b border-slate-50 last:border-0">
                        <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 shrink-0 mt-0.5">
                          <Icon className="h-3.5 w-3.5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-slate-700 truncate">{act.description}</p>
                          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-0.5">
                            <Link href={`/admin/leads/${act.leadId}`} className="text-primary hover:underline font-medium">{act.leadName}</Link>
                            <span>·</span>
                            <span>{act.author}</span>
                            <span>·</span>
                            <span>{formatDistanceToNow(new Date(act.date), { addSuffix: true, locale: es })}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-6 text-slate-400 text-sm">Sin actividad reciente.</div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}

function KPICard({ title, value, icon: Icon, loading, trend, trendColor, highlight }: KPICardProps) {
  return (
    <Card className={highlight ? "border-primary bg-primary/5 shadow-md" : "shadow-sm border-slate-200"}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
            <Icon className="h-5 w-5" />
          </div>
          {trend && <span className={`text-xs font-semibold ${trendColor}`}>{trend}</span>}
        </div>
        <div className="mt-4">
          <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
          <h3 className="text-3xl font-display font-bold text-slate-900">
            {loading ? <div className="h-8 w-16 bg-slate-200 animate-pulse rounded" /> : value}
          </h3>
        </div>
      </CardContent>
    </Card>
  );
}
