import { useState } from "react";
import { AdminLayout } from "@/components/layouts/AdminLayout";
import { useAnalytics, useDashboardStats } from "@/hooks/use-dashboard";
import { useLeads } from "@/hooks/use-leads";
import { Card, CardContent, CardHeader, CardTitle, Badge } from "@/components/ui-components";
import { scoreCategoryToBadgeVariant } from "@/lib/mock-data";
import { BarChart3, TrendingUp, MapPin, Users, Target, AlertTriangle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import type { LucideIcon } from "lucide-react";
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LineChart, Line, Legend
} from "recharts";

const COLORS = ["#0059B3", "#0D9488", "#F59E0B", "#EF4444", "#8B5CF6", "#6366F1"];

export default function Analytics() {
  const { data: analytics, isLoading: analyticsLoading } = useAnalytics();
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: leads } = useLeads();

  const isLoading = analyticsLoading || statsLoading;

  const ownerStats = (leads || []).reduce<Record<string, { total: number; hot: number; won: number; contacted: number }>>((acc, lead) => {
    if (!acc[lead.owner]) acc[lead.owner] = { total: 0, hot: 0, won: 0, contacted: 0 };
    acc[lead.owner].total++;
    if (lead.scoreCategory === "Hot") acc[lead.owner].hot++;
    if (lead.status === "Won") acc[lead.owner].won++;
    if (lead.status !== "New") acc[lead.owner].contacted++;
    return acc;
  }, {});

  const propertyStats = Object.entries(
    (leads || []).reduce<Record<string, number>>((acc, lead) => {
      acc[lead.propertyType] = (acc[lead.propertyType] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  const urgencyData = Object.entries(
    (leads || []).reduce<Record<string, number>>((acc, lead) => {
      acc[lead.timeline] = (acc[lead.timeline] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);

  const now = new Date();
  const leadsWithoutFollowUp = (leads || []).filter(l =>
    !l.nextFollowUp && !["Won", "Lost", "Not Qualified"].includes(l.status)
  );

  const agingLeads = (leads || []).filter(l => {
    if (["Won", "Lost", "Not Qualified"].includes(l.status)) return false;
    const daysSinceEntry = (now.getTime() - new Date(l.entryDate).getTime()) / (1000 * 60 * 60 * 24);
    return daysSinceEntry > 7;
  }).sort((a, b) => new Date(a.entryDate).getTime() - new Date(b.entryDate).getTime());

  const contactRate = (leads || []).length > 0
    ? (((leads || []).filter(l => l.status !== "New").length / (leads || []).length) * 100).toFixed(1)
    : "0";

  const qualificationRate = (leads || []).length > 0
    ? (((leads || []).filter(l => ["Qualified", "Evaluation Pending", "Offer Review", "Negotiation", "Won"].includes(l.status)).length / (leads || []).length) * 100).toFixed(1)
    : "0";

  type TrendPeriod = "weekly" | "monthly" | "quarterly" | "semester" | "yearly" | "ytd";
  const [trendPeriod, setTrendPeriod] = useState<TrendPeriod>("weekly");

  const TREND_PERIODS: { key: TrendPeriod; label: string }[] = [
    { key: "weekly",    label: "Semanal" },
    { key: "monthly",   label: "Mensual" },
    { key: "quarterly", label: "Trimestre" },
    { key: "semester",  label: "Semestre" },
    { key: "yearly",    label: "Anual" },
    { key: "ytd",       label: "YTD" },
  ];

  const TREND_DATA: Record<TrendPeriod, { name: string; leads: number; contactados: number; calificados: number }[]> = {
    weekly: [
      { name: "Lun", leads: 3, contactados: 2, calificados: 1 },
      { name: "Mar", leads: 5, contactados: 4, calificados: 2 },
      { name: "Mié", leads: 4, contactados: 3, calificados: 1 },
      { name: "Jue", leads: 6, contactados: 5, calificados: 3 },
      { name: "Vie", leads: 8, contactados: 6, calificados: 2 },
      { name: "Sáb", leads: 2, contactados: 1, calificados: 0 },
      { name: "Dom", leads: 1, contactados: 1, calificados: 0 },
    ],
    monthly: [
      { name: "Sem 1", leads: 8,  contactados: 5,  calificados: 2 },
      { name: "Sem 2", leads: 12, contactados: 9,  calificados: 4 },
      { name: "Sem 3", leads: 15, contactados: 11, calificados: 6 },
      { name: "Sem 4", leads: 10, contactados: 8,  calificados: 5 },
    ],
    quarterly: [
      { name: "Ene", leads: 18, contactados: 13, calificados: 6 },
      { name: "Feb", leads: 22, contactados: 17, calificados: 8 },
      { name: "Mar", leads: 30, contactados: 24, calificados: 11 },
    ],
    semester: [
      { name: "Ene", leads: 18, contactados: 13, calificados: 6 },
      { name: "Feb", leads: 22, contactados: 17, calificados: 8 },
      { name: "Mar", leads: 30, contactados: 24, calificados: 11 },
      { name: "Abr", leads: 25, contactados: 19, calificados: 9 },
      { name: "May", leads: 28, contactados: 21, calificados: 12 },
      { name: "Jun", leads: 35, contactados: 27, calificados: 14 },
    ],
    yearly: [
      { name: "Ene", leads: 18, contactados: 13, calificados: 6 },
      { name: "Feb", leads: 22, contactados: 17, calificados: 8 },
      { name: "Mar", leads: 30, contactados: 24, calificados: 11 },
      { name: "Abr", leads: 25, contactados: 19, calificados: 9 },
      { name: "May", leads: 28, contactados: 21, calificados: 12 },
      { name: "Jun", leads: 35, contactados: 27, calificados: 14 },
      { name: "Jul", leads: 40, contactados: 31, calificados: 16 },
      { name: "Ago", leads: 38, contactados: 29, calificados: 15 },
      { name: "Sep", leads: 32, contactados: 25, calificados: 13 },
      { name: "Oct", leads: 45, contactados: 36, calificados: 18 },
      { name: "Nov", leads: 42, contactados: 33, calificados: 17 },
      { name: "Dic", leads: 50, contactados: 40, calificados: 22 },
    ],
    ytd: [
      { name: "Ene", leads: 18, contactados: 13, calificados: 6 },
      { name: "Feb", leads: 22, contactados: 17, calificados: 8 },
      { name: "Mar", leads: 30, contactados: 24, calificados: 11 },
    ],
  };

  const trendData = TREND_DATA[trendPeriod];

  return (
    <AdminLayout>
      <div className="p-6 lg:p-8 max-w-[1400px] mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-display font-bold text-slate-900">Analytics</h1>
          <p className="text-sm text-slate-500 mt-1">Rendimiento general del pipeline de seller leads.</p>
        </div>

        {isLoading ? (
          <div className="text-center py-20 text-slate-500">Cargando datos...</div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="space-y-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard label="Leads Totales" value={stats?.total || 0} icon={Users} color="bg-blue-50 text-primary" />
              <MetricCard label="Tasa Contacto" value={`${contactRate}%`} icon={TrendingUp} color="bg-indigo-50 text-indigo-600" />
              <MetricCard label="Tasa Calificación" value={`${qualificationRate}%`} icon={Target} color="bg-emerald-50 text-emerald-600" />
              <MetricCard label="Tasa Conversión" value={`${stats?.conversionRate || 0}%`} icon={Target} color="bg-amber-50 text-amber-600" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="shadow-sm border-slate-200">
                <CardHeader className="border-b border-slate-100 pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <BarChart3 className="h-5 w-5 text-primary" /> Funnel de Conversión
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={analytics?.funnel || []} layout="vertical" margin={{ left: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                      <XAxis type="number" tick={{ fontSize: 12, fill: "#94a3b8" }} />
                      <YAxis type="category" dataKey="stage" tick={{ fontSize: 12, fill: "#64748b" }} width={100} />
                      <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0" }} />
                      <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                        {(analytics?.funnel || []).map((_, i) => (
                          <Cell key={i} fill={COLORS[i % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="shadow-sm border-slate-200">
                <CardHeader className="border-b border-slate-100 pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    Fuentes de Leads
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height={280}>
                    <PieChart>
                      <Pie
                        data={analytics?.sources || []}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={4}
                        label={({ name, value }) => `${name} ${value}%`}
                        labelLine={{ stroke: "#94a3b8" }}
                      >
                        {(analytics?.sources || []).map((_, i) => (
                          <Cell key={i} fill={COLORS[i % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0" }} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="shadow-sm border-slate-200">
                <CardHeader className="border-b border-slate-100 pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <MapPin className="h-5 w-5 text-primary" /> Leads por Región
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={analytics?.regions || []} margin={{ left: -10 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="region" tick={{ fontSize: 12, fill: "#64748b" }} />
                      <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} />
                      <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0" }} />
                      <Bar dataKey="leads" fill="#0059B3" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="shadow-sm border-slate-200">
                <CardHeader className="border-b border-slate-100 pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Clock className="h-5 w-5 text-primary" /> Distribución por Urgencia
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <ResponsiveContainer width="100%" height={260}>
                    <PieChart>
                      <Pie data={urgencyData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label={({ name, value }) => `${name}: ${value}`} labelLine={{ stroke: "#94a3b8" }}>
                        {urgencyData.map((entry, i) => (
                          <Cell key={i} fill={entry.name === "Urgente" ? "#EF4444" : COLORS[i % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0" }} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <Card className="shadow-sm border-slate-200">
              <CardHeader className="border-b border-slate-100 pb-3">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <TrendingUp className="h-5 w-5 text-primary" /> Tendencia de Leads
                  </CardTitle>
                  <div className="flex flex-wrap gap-1.5">
                    {TREND_PERIODS.map(p => (
                      <button
                        key={p.key}
                        onClick={() => setTrendPeriod(p.key)}
                        className={cn(
                          "px-2.5 py-1 rounded-full text-xs font-medium transition-all border",
                          trendPeriod === p.key
                            ? "bg-primary text-white border-primary shadow-sm"
                            : "bg-white text-slate-500 border-slate-200 hover:border-primary/50 hover:text-primary"
                        )}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#64748b" }} />
                    <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} />
                    <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0" }} />
                    <Legend />
                    <Line type="monotone" dataKey="leads" stroke="#0059B3" strokeWidth={2} dot={{ r: 4 }} name="Leads" />
                    <Line type="monotone" dataKey="contactados" stroke="#0D9488" strokeWidth={2} dot={{ r: 4 }} name="Contactados" />
                    <Line type="monotone" dataKey="calificados" stroke="#F59E0B" strokeWidth={2} dot={{ r: 4 }} name="Calificados" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="shadow-sm border-slate-200">
                <CardHeader className="border-b border-slate-100 pb-3">
                  <CardTitle className="text-base">Rendimiento por Agente</CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-4">
                    {Object.entries(ownerStats).map(([name, s]) => (
                      <div key={name} className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl">
                        <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                          {name.substring(0, 2).toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-sm text-slate-900">{name}</div>
                          <div className="text-xs text-slate-500">{s.total} leads · {s.contacted} contactados</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-bold text-slate-900">{s.hot} Hot</div>
                          <div className="text-xs text-emerald-600">{s.won} cerrados</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-sm border-slate-200">
                <CardHeader className="border-b border-slate-100 pb-3">
                  <CardTitle className="text-base">Tipo de Propiedad</CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <ResponsiveContainer width="100%" height={240}>
                    <PieChart>
                      <Pie data={propertyStats} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} label={({ name, value }) => `${name}: ${value}`} labelLine={{ stroke: "#94a3b8" }}>
                        {propertyStats.map((_, i) => (
                          <Cell key={i} fill={COLORS[i % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0" }} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {leadsWithoutFollowUp.length > 0 && (
              <Card className="shadow-sm border-red-200 bg-red-50/30">
                <CardHeader className="border-b border-red-100 pb-3">
                  <CardTitle className="flex items-center gap-2 text-base text-red-700">
                    <AlertTriangle className="h-5 w-5" /> Leads Sin Follow-up ({leadsWithoutFollowUp.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {leadsWithoutFollowUp.slice(0, 6).map(lead => (
                      <div key={lead.id} className="flex items-center gap-3 p-3 bg-white rounded-lg border border-red-100">
                        <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold text-xs">
                          {lead.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-sm text-slate-900 truncate">{lead.name}</div>
                          <div className="text-xs text-slate-500">{lead.municipality} · {lead.status}</div>
                        </div>
                        <Badge variant={scoreCategoryToBadgeVariant(lead.scoreCategory)} className="text-[10px] shrink-0">
                          {lead.scoreCategory}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {agingLeads.length > 0 && (
              <Card className="shadow-sm border-slate-200">
                <CardHeader className="border-b border-slate-100 pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Clock className="h-5 w-5 text-amber-500" /> Leads con Antigüedad &gt; 7 días ({agingLeads.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-xs text-slate-500 border-b border-slate-100">
                          <th className="text-left py-2 font-medium">Lead</th>
                          <th className="text-left py-2 font-medium">Estado</th>
                          <th className="text-left py-2 font-medium">Owner</th>
                          <th className="text-left py-2 font-medium">Antigüedad</th>
                          <th className="text-left py-2 font-medium">Score</th>
                        </tr>
                      </thead>
                      <tbody>
                        {agingLeads.slice(0, 8).map(lead => (
                          <tr key={lead.id} className="border-b border-slate-50">
                            <td className="py-2 font-medium text-slate-900">{lead.name}</td>
                            <td className="py-2"><Badge variant="outline" className="text-[10px]">{lead.status}</Badge></td>
                            <td className="py-2 text-slate-600">{lead.owner.split(" ")[0]}</td>
                            <td className="py-2 text-amber-600 font-medium">
                              {formatDistanceToNow(new Date(lead.entryDate), { locale: es })}
                            </td>
                            <td className="py-2">
                              <Badge variant={scoreCategoryToBadgeVariant(lead.scoreCategory)} className="text-[10px]">{lead.scoreCategory} {lead.score}</Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>
        )}
      </div>
    </AdminLayout>
  );
}

function MetricCard({ label, value, icon: Icon, color }: { label: string; value: string | number; icon: LucideIcon; color: string }) {
  return (
    <Card className="shadow-sm border-slate-200">
      <CardContent className="p-5 flex items-center gap-4">
        <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", color)}>
          <Icon className="h-6 w-6" />
        </div>
        <div>
          <p className="text-xs font-medium text-slate-500">{label}</p>
          <h3 className="text-2xl font-display font-bold text-slate-900">{value}</h3>
        </div>
      </CardContent>
    </Card>
  );
}
