import { useState } from "react";
import { AdminLayout } from "@/components/layouts/AdminLayout";
import { Card, CardContent, Badge, Button, Select } from "@/components/ui-components";
import { campaigns, type Campaign } from "@/store";
import { cn } from "@/lib/utils";
import { Megaphone, TrendingUp, DollarSign, Users, Plus, BarChart3, Pause, Play, Eye } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const STATUS_CONFIG: Record<Campaign["status"], { color: string; label: string }> = {
  Active: { color: "bg-emerald-100 text-emerald-700", label: "Activa" },
  Paused: { color: "bg-amber-100 text-amber-700", label: "Pausada" },
  Completed: { color: "bg-slate-100 text-slate-700", label: "Completada" },
  Draft: { color: "bg-blue-100 text-blue-700", label: "Borrador" },
};

export default function Campaigns() {
  const [statusFilter, setStatusFilter] = useState("All");

  const filtered = campaigns.filter(c => statusFilter === "All" || c.status === statusFilter);
  const totalBudget = campaigns.reduce((sum, c) => sum + c.budget, 0);
  const totalSpent = campaigns.reduce((sum, c) => sum + c.spent, 0);
  const totalLeads = campaigns.reduce((sum, c) => sum + c.leadsGenerated, 0);

  return (
    <AdminLayout breadcrumbs={[{ label: "Dashboard", href: "/admin/dashboard" }, { label: "Campaigns" }]}>
      <div className="p-6 lg:p-8 max-w-[1400px] mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold text-slate-900">Campaigns</h1>
            <p className="text-sm text-slate-500 mt-1">Campañas de adquisición y métricas.</p>
          </div>
          <Button><Plus className="h-4 w-4 mr-2" /> Nueva Campaña</Button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="shadow-sm border-slate-200">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center"><Megaphone className="h-5 w-5" /></div>
              <div>
                <div className="text-xs text-slate-500">Campañas</div>
                <div className="text-xl font-display font-bold text-slate-900">{campaigns.length}</div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-sm border-slate-200">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center"><DollarSign className="h-5 w-5" /></div>
              <div>
                <div className="text-xs text-slate-500">Presupuesto Total</div>
                <div className="text-xl font-display font-bold text-slate-900">${totalBudget.toLocaleString()}</div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-sm border-slate-200">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center"><TrendingUp className="h-5 w-5" /></div>
              <div>
                <div className="text-xs text-slate-500">Gastado</div>
                <div className="text-xl font-display font-bold text-amber-600">${totalSpent.toLocaleString()}</div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-sm border-slate-200">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center"><Users className="h-5 w-5" /></div>
              <div>
                <div className="text-xs text-slate-500">Leads Generados</div>
                <div className="text-xl font-display font-bold text-blue-600">{totalLeads}</div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Select className="h-9 w-48 bg-white text-sm" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="All">Todas las campañas</option>
          <option value="Active">Activas</option>
          <option value="Paused">Pausadas</option>
          <option value="Completed">Completadas</option>
          <option value="Draft">Borradores</option>
        </Select>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map(campaign => {
            const cfg = STATUS_CONFIG[campaign.status];
            const spentPct = campaign.budget > 0 ? (campaign.spent / campaign.budget) * 100 : 0;
            return (
              <Card key={campaign.id} className="shadow-sm border-slate-200 hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="font-bold text-slate-900">{campaign.name}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{campaign.platform} · {campaign.source}</div>
                    </div>
                    <Badge className={cn("border-0", cfg.color)}>{cfg.label}</Badge>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center p-2 bg-slate-50 rounded-lg">
                      <div className="text-lg font-display font-bold text-slate-900">{campaign.leadsGenerated}</div>
                      <div className="text-[10px] text-slate-500">Leads</div>
                    </div>
                    <div className="text-center p-2 bg-slate-50 rounded-lg">
                      <div className="text-lg font-display font-bold text-emerald-600">{campaign.conversionRate}%</div>
                      <div className="text-[10px] text-slate-500">Conversión</div>
                    </div>
                    <div className="text-center p-2 bg-slate-50 rounded-lg">
                      <div className="text-lg font-display font-bold text-primary">${campaign.cpl.toFixed(0)}</div>
                      <div className="text-[10px] text-slate-500">CPL</div>
                    </div>
                  </div>

                  {campaign.budget > 0 && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                        <span>Presupuesto</span>
                        <span>${campaign.spent.toLocaleString()} / ${campaign.budget.toLocaleString()}</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div className={cn("h-2 rounded-full transition-all", spentPct > 80 ? "bg-red-500" : spentPct > 50 ? "bg-amber-500" : "bg-emerald-500")} style={{ width: `${Math.min(spentPct, 100)}%` }} />
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Inicio: {format(new Date(campaign.startDate), "dd MMM yyyy", { locale: es })}</span>
                    <div className="flex gap-1">
                      {campaign.status === "Active" && (
                        <Button variant="ghost" size="sm" className="h-7 text-xs text-amber-600 hover:bg-amber-50"><Pause className="h-3 w-3 mr-1" /> Pausar</Button>
                      )}
                      {campaign.status === "Paused" && (
                        <Button variant="ghost" size="sm" className="h-7 text-xs text-emerald-600 hover:bg-emerald-50"><Play className="h-3 w-3 mr-1" /> Reactivar</Button>
                      )}
                      <Button variant="ghost" size="sm" className="h-7 text-xs"><Eye className="h-3 w-3 mr-1" /> Detalles</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </AdminLayout>
  );
}
